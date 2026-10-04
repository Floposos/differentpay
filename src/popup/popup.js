'use strict';

const api = globalThis.browser ?? globalThis.chrome;

const DEFAULTS = { enabled: true, monthlySalary: null, hoursPerWeek: 40, showOriginal: false };
const WEEKS_PER_MONTH = 52 / 12;
const money = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

const $ = (id) => document.getElementById(id);
const els = {
  enabled: $('enabled'),
  monthlySalary: $('monthlySalary'),
  hoursPerWeek: $('hoursPerWeek'),
  showOriginal: $('showOriginal'),
  rate: $('rate'),
  status: $('status'),
};

function readNumber(input) {
  const v = parseFloat(input.value.replace(',', '.'));
  return Number.isFinite(v) && v > 0 ? v : null;
}

function render() {
  const salary = readNumber(els.monthlySalary);
  const hours = readNumber(els.hoursPerWeek);
  const rate = salary && hours ? salary / (hours * WEEKS_PER_MONTH) : null;
  els.rate.textContent = rate ? money.format(rate) : '–';

  els.status.classList.toggle('warn', !rate);
  if (!rate) els.status.textContent = 'Bitte Monatslohn und Wochenstunden eintragen.';
  else if (els.enabled.checked) els.status.textContent = 'Preise werden als Arbeitszeit angezeigt.';
  else els.status.textContent = 'Ausgeschaltet – Originalpreise sichtbar.';
}

let saveTimer = null;
function save() {
  render();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    api.storage.local.set({
      enabled: els.enabled.checked,
      monthlySalary: readNumber(els.monthlySalary),
      hoursPerWeek: readNumber(els.hoursPerWeek) ?? DEFAULTS.hoursPerWeek,
      showOriginal: els.showOriginal.checked,
    });
  }, 250);
}

api.storage.local.get(DEFAULTS).then((s) => {
  els.enabled.checked = s.enabled;
  els.monthlySalary.value = s.monthlySalary ?? '';
  els.hoursPerWeek.value = s.hoursPerWeek;
  els.showOriginal.checked = s.showOriginal;
  render();
  if (!s.monthlySalary) els.monthlySalary.focus();
});

for (const input of [els.monthlySalary, els.hoursPerWeek]) input.addEventListener('input', save);
for (const input of [els.enabled, els.showOriginal]) input.addEventListener('change', save);

// Falls per Tastenkürzel umgeschaltet wird, während das Popup offen ist
api.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.enabled) {
    els.enabled.checked = changes.enabled.newValue;
    render();
  }
});
