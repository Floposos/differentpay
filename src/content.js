(() => {
  'use strict';

  const api = globalThis.browser ?? globalThis.chrome;

  const DEFAULTS = { enabled: true, monthlySalary: null, hoursPerWeek: 40, showOriginal: false };
  const WEEKS_PER_MONTH = 52 / 12;
  const MAX_PRICE_TEXT = 40; // längere Texte sind keine reinen Preis-Elemente
  const MAX_CLIMB = 5;       // wie viele Eltern-Ebenen wir für zerstückelte Preise hochgehen

  const CUR = '(?:€|EUR|US\\$|\\$|USD|£|GBP|CHF|Fr\\.)';
  const SEP = '[.,\'’ \\u00a0\\u202f]';
  const DEC = '[.,](?:\\d{1,2}|[-–—]{1,2})';
  const NUM = `\\d{1,3}(?:${SEP}\\d{3})+(?:${DEC})?|\\d+(?:${DEC})?`;
  const PRICE = `(?:${CUR}\\s?(${NUM})|(${NUM})\\s?${CUR})`;
  const FULL_RE = new RegExp(`^${PRICE}\\s?\\*?$`, 'i');
  const INLINE_RE = new RegExp(`(?<![\\w.,])${PRICE}(?![\\w])`, 'gi');

  const SKIP_SELECTOR = [
    'script', 'style', 'noscript', 'textarea', 'input', 'select', 'option', 'code', 'pre',
    '[contenteditable=""]', '[contenteditable="true"]', '.dp-hours', '[data-dp]',
  ].join(',');

  let settings = { ...DEFAULTS };
  let observer = null;
  const pendingRoots = new Set();
  let pendingTimer = null;

  // ---------- Berechnung & Formatierung ----------

  function hourlyRate() {
    const salary = Number(settings.monthlySalary);
    const hours = Number(settings.hoursPerWeek);
    if (!(salary > 0) || !(hours > 0)) return null;
    return salary / (hours * WEEKS_PER_MONTH);
  }

  function isActive() {
    return settings.enabled && hourlyRate() !== null;
  }

  function norm(text) {
    return text.replace(/[\s  ]+/g, ' ').trim();
  }

  // Wie textContent, setzt aber ein Komma vor hochgestellte/separate Cent-Angaben (89<sup>95</sup> -> 89,95).
  const CENTS_CLASS_RE = /cent|fraction|decimal|minor/i;
  function priceText(el) {
    let out = '';
    const walk = (node) => {
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          out += child.nodeValue;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const t = child.textContent.trim();
          const isCents = (child.tagName === 'SUP' || CENTS_CLASS_RE.test(child.className))
            && /^\d{2}$/.test(t) && /\d\s*$/.test(out);
          if (isCents) out = out.trimEnd() + ',' + t;
          else walk(child);
        }
      }
    };
    walk(el);
    return norm(out);
  }

  function parseAmount(raw) {
    let s = raw.replace(/[\s'’  ]/g, '').replace(/[.,][-–—]+$/, '');
    let dec = '';
    const m = s.match(/[.,](\d{1,2})$/);
    if (m) {
      dec = m[1];
      s = s.slice(0, -m[0].length);
    }
    s = s.replace(/[.,]/g, '');
    const value = parseFloat(dec ? `${s}.${dec}` : s);
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  const nf1 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
  const nf0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
  const nfMoney = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function formatWorkTime(amount) {
    const hours = amount / hourlyRate();
    const totalMin = Math.round(hours * 60);
    if (totalMin < 1) return '< 1 min';
    if (totalMin < 60) return `${totalMin} min`;
    if (hours < 10) {
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      return m ? `${h} h ${m} min` : `${h} h`;
    }
    const days = hours / (settings.hoursPerWeek / 5);
    const h = hours < 100 ? nf1.format(hours) : nf0.format(hours);
    const d = days < 100 ? nf1.format(days) : nf0.format(days);
    return `${h} h (≈ ${d} Arbeitstage)`;
  }

  function makeBadge(amount, originalText, inline) {
    const badge = document.createElement('span');
    badge.className = inline ? 'dp-hours dp-inline' : 'dp-hours';
    badge.textContent = `⏱ ${formatWorkTime(amount)}`;
    badge.title = `Originalpreis: ${originalText}\nDein Stundenlohn: ${nfMoney.format(hourlyRate())}`;
    if (settings.showOriginal) {
      const orig = document.createElement('span');
      orig.className = 'dp-orig';
      orig.textContent = `(${originalText})`;
      badge.appendChild(orig);
    }
    return badge;
  }

  // ---------- Erkennung ----------

  function findPriceElement(textNode) {
    let el = textNode.parentElement;
    for (let depth = 0; el && depth < MAX_CLIMB && el !== document.body; depth++, el = el.parentElement) {
      const text = priceText(el);
      if (text.length > MAX_PRICE_TEXT) return null;
      if (FULL_RE.test(text)) {
        return el.querySelector('[data-dp], .dp-hours') ? null : el;
      }
    }
    return null;
  }

  // Screenreader-Preise (z.B. Amazons .a-offscreen) und selbst ausgeblendete Elemente überspringen.
  function shouldSkipElement(el) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return true;
    if (el.getClientRects().length === 0) return false; // Vorfahre ausgeblendet -> Badge wird mit ausgeblendet
    const rect = el.getBoundingClientRect();
    return rect.width <= 1 && rect.height <= 1;
  }

  function scan(root) {
    if (!isActive() || !root || !root.isConnected) return;
    if (root.nodeType === Node.TEXT_NODE) root = root.parentElement;
    if (!root || root.nodeType !== Node.ELEMENT_NODE || root.closest(SKIP_SELECTOR)) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (/\d/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });

    const elements = new Set();
    const inlineNodes = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const parent = n.parentElement;
      if (!parent || parent.closest(SKIP_SELECTOR)) continue;
      const el = findPriceElement(n);
      if (el) {
        elements.add(el);
      } else {
        INLINE_RE.lastIndex = 0;
        if (INLINE_RE.test(n.nodeValue)) inlineNodes.push(n);
      }
    }

    // Erst alles lesen (Layout), dann schreiben – vermeidet Layout-Thrashing.
    const toReplace = [];
    for (const el of elements) {
      if (shouldSkipElement(el)) continue;
      const style = getComputedStyle(el);
      toReplace.push({ el, fontSize: style.fontSize, fontWeight: style.fontWeight, color: style.color });
    }

    for (const { el, fontSize, fontWeight, color } of toReplace) replaceElement(el, fontSize, fontWeight, color);
    for (const n of inlineNodes) if (n.isConnected) replaceInline(n);

    if (observer) observer.takeRecords(); // eigene Änderungen ignorieren
  }

  function replaceElement(el, fontSize, fontWeight, color) {
    const text = priceText(el);
    const m = text.match(FULL_RE);
    const amount = m && parseAmount(m[1] || m[2]);
    if (!amount) return;
    const badge = makeBadge(amount, text, false);
    Object.assign(badge.style, { fontSize, fontWeight, color });
    el.dataset.dp = 'el';
    el.classList.add('dp-hide');
    el.insertAdjacentElement('afterend', badge);
  }

  function replaceInline(textNode) {
    const text = textNode.nodeValue;
    const frag = document.createDocumentFragment();
    let last = 0;
    let replaced = false;
    INLINE_RE.lastIndex = 0;
    for (let m = INLINE_RE.exec(text); m; m = INLINE_RE.exec(text)) {
      const amount = parseAmount(m[1] || m[2]);
      if (!amount) continue;
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const badge = makeBadge(amount, norm(m[0]), true);
      badge.dataset.dp = 'inline';
      badge.dataset.dpOrig = m[0];
      frag.appendChild(badge);
      last = m.index + m[0].length;
      replaced = true;
    }
    if (!replaced) return;
    frag.appendChild(document.createTextNode(text.slice(last)));
    textNode.replaceWith(frag);
  }

  // ---------- Wiederherstellen ----------

  function restoreElement(el) {
    const next = el.nextElementSibling;
    if (next && next.classList.contains('dp-hours')) next.remove();
    el.classList.remove('dp-hide');
    delete el.dataset.dp;
  }

  function restoreAll() {
    document.querySelectorAll('[data-dp="el"]').forEach(restoreElement);
    document.querySelectorAll('[data-dp="inline"]').forEach((badge) => {
      badge.replaceWith(document.createTextNode(badge.dataset.dpOrig));
    });
    document.querySelectorAll('.dp-hours').forEach((b) => b.remove()); // verwaiste Badges
    if (observer) observer.takeRecords();
  }

  function rerender() {
    restoreAll();
    if (isActive()) scan(document.body);
  }

  // ---------- Dynamische Seiten ----------

  function isOwnNode(node) {
    return node.nodeType === Node.ELEMENT_NODE && node.classList.contains('dp-hours');
  }

  function onMutations(records) {
    if (!isActive()) return;
    for (const r of records) {
      const target = r.target.nodeType === Node.ELEMENT_NODE ? r.target : r.target.parentElement;
      if (!target || target.closest('.dp-hours')) continue;
      if (r.type === 'childList' && r.addedNodes.length && [...r.addedNodes].every(isOwnNode)) continue;

      // Preis in einem bereits ersetzten Element hat sich geändert (z.B. andere Variante gewählt)
      const host = target.closest('[data-dp="el"]');
      if (host) {
        restoreElement(host);
        pendingRoots.add(host.parentElement || host);
      } else {
        pendingRoots.add(target);
      }
    }
    if (pendingRoots.size && !pendingTimer) pendingTimer = setTimeout(flushPending, 300);
  }

  function flushPending() {
    pendingTimer = null;
    const roots = [...pendingRoots];
    pendingRoots.clear();
    // Nur die äußersten Wurzeln scannen
    for (const root of roots) {
      if (!roots.some((other) => other !== root && other.contains(root))) scan(root);
    }
  }

  function startObserver() {
    observer = new MutationObserver(onMutations);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'hidden'],
    });
  }

  // ---------- Start ----------

  api.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    let relevant = false;
    for (const key of Object.keys(DEFAULTS)) {
      if (key in changes) {
        settings[key] = changes[key].newValue ?? DEFAULTS[key];
        relevant = true;
      }
    }
    if (relevant) rerender();
  });

  api.storage.local.get(DEFAULTS).then((stored) => {
    settings = { ...DEFAULTS, ...stored };
    if (!document.body) return;
    startObserver();
    if (isActive()) scan(document.body);
  });
})();
