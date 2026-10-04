# Firefox Add-ons (AMO) – Einreichung DifferentPay

Alle Texte und Dateien für den [Add-on Developer Hub](https://addons.mozilla.org/developers/),
in der Reihenfolge, in der das Formular danach fragt. Texte einfach in die jeweiligen Felder kopieren.

## Vorab (einmalig)

1. Auf [addons.mozilla.org](https://addons.mozilla.org) mit einem Mozilla-Konto anmelden (kostenlos)
2. Im Developer Hub die Entwickler-Vereinbarung akzeptieren

## Paket

| Datei | Erzeugen mit |
|---|---|
| `dist/differentpay-firefox-1.0.0.xpi` | `./build.sh` im Projektordner |

Geprüft mit dem offiziellen `addons-linter`: 0 Fehler, 0 Warnungen
(`npx addons-linter dist/differentpay-firefox-1.0.0.xpi`).

Das Manifest deklariert bereits `data_collection_permissions: none`. Diese Angabe verlangt AMO von allen neuen
Erweiterungen. Deshalb setzt das Manifest Firefox 140 bzw. Firefox für Android 142 als Mindestversion voraus.

---

## Schritt 1: Vertriebsart

**Submit a New Add-on** → **On this site** (öffentlich auf addons.mozilla.org gelistet)

## Schritt 2: Hochladen

- `differentpay-firefox-1.0.0.xpi` hochladen
- Kompatible Plattformen: **Firefox** und **Firefox for Android** ankreuzen

## Schritt 3: Quellcode

**„Do You Need to Submit Source Code?“** → **No**

Begründung: Der Code ist weder minifiziert noch gebündelt oder transpiliert – die Dateien in der XPI sind der
Quellcode.

## Schritt 4: Beschreibung

**Name** (max. 50 Zeichen, kommt aus dem Manifest):
```
DifferentPay – Preise in Arbeitsstunden
```

**Add-on-URL:**
```
differentpay
```
→ `https://addons.mozilla.org/firefox/addon/differentpay/`

**Zusammenfassung** (max. 250 Zeichen):
```
Was kostet das wirklich? DifferentPay zeigt Preise auf Shopping-Seiten als Arbeitszeit an – berechnet aus deinem Netto-Monatslohn und deinen Wochenstunden. Jederzeit per Klick oder Alt+Shift+H an- und ausschaltbar.
```

**Beschreibung:**
```
Was kostet das wirklich? DifferentPay zeigt dir Preise nicht in Euro, sondern in der Zeit, die du dafür arbeiten musst.

Statt „249,00 €“ steht dort z. B. „⏱ 14,4 h“ – und bei größeren Anschaffungen zusätzlich die Zahl der Arbeitstage. So siehst du auf einen Blick, ob dir etwas den Aufwand wirklich wert ist.

SO FUNKTIONIERT'S
1. Auf das DifferentPay-Symbol in der Symbolleiste klicken
2. Netto-Monatslohn und Wochenstunden eintragen
3. Fertig – Preise auf Webseiten werden sofort umgerechnet

FUNKTIONEN
• Individueller Stundenlohn aus Monatslohn und Wochenarbeitszeit
• Jederzeit an- und ausschalten – per Schalter oder Tastenkürzel Alt+Shift+H, ohne Neuladen der Seite
• Originalpreis per Mauszeiger (Tooltip) oder auf Wunsch klein daneben
• Große Beträge zusätzlich in Arbeitstagen
• Erkennt gängige Preisformate: 19,99 €, € 1.299,00, 29,– €, $1,049.95, CHF 120.50, £5, hochgestellte Cent-Beträge
• Funktioniert auch bei nachgeladenen Produkten und beim Wechsel von Produktvarianten

DATENSCHUTZ
Deine Angaben bleiben auf deinem Gerät. DifferentPay sendet keine Daten, nutzt kein Tracking und keine Werbung. Der Quellcode ist offen: https://github.com/Floposos/differentpay

BERECHNUNG
Stundenlohn = Monatslohn ÷ (Wochenstunden × 52 ÷ 12). Ein Arbeitstag entspricht einem Fünftel deiner Wochenstunden. Fremdwährungen werden nicht umgerechnet.
```

**Kategorien:**
- Firefox: **Shopping**
- Firefox for Android: **Shopping**

**Support-E-Mail:** deine Kontakt-Adresse (Pflichtfeld, wird öffentlich angezeigt – ggf. eine eigene Adresse dafür nutzen)

**Support-Website:**
```
https://github.com/Floposos/differentpay/issues
```

**Lizenz:** **MIT License** (entspricht der `LICENSE`-Datei im Repository)

**Datenschutzerklärung:** Häkchen bei „This add-on has a privacy policy“ setzen und einfügen:
```
DifferentPay speichert ausschließlich die Einstellungen, die du im Popup einträgst (Netto-Monatslohn, Wochenstunden, Ein/Aus-Status, Anzeigeoption), lokal in deinem Browser (storage.local). Der Text besuchter Webseiten wird nur lokal gelesen, um Preise zu ersetzen, und weder gespeichert noch übertragen. Die Erweiterung erhebt, überträgt, verkauft oder teilt keine Daten, verwendet kein Tracking und lädt keinen Code aus dem Internet nach. Beim Entfernen der Erweiterung werden alle Einstellungen gelöscht.

Vollständige Fassung: https://github.com/Floposos/differentpay/blob/main/PRIVACY.md
```

**Hinweise für die Prüfer** (Notes to Reviewer):
```
No build step, no minification, no remote code – the XPI contains the original source (also at https://github.com/Floposos/differentpay).

How to test:
1. Click the toolbar icon and enter a monthly salary (e.g. 3000) and weekly hours (e.g. 40).
2. Open any shopping page (e.g. amazon.de) – prices are replaced by working time ("⏱ 14,4 h"); hover shows the original price.
3. Toggle on/off via the popup switch or Alt+Shift+H; prices are restored immediately.

Permissions: "storage" keeps the user's settings locally. The content script runs on <all_urls> because prices can appear on any shopping site; page text is only processed locally and never stored or transmitted.
```

**Versionshinweise** (Release notes für 1.0.0):
```
Erste Version.
```

---

## Nach dem Einreichen: Bilder & Details

Im Developer Hub unter **Edit Product Page** → **Images**:

| Feld | Datei | Hinweis |
|---|---|---|
| Symbol (optional) | `src/icons/icon-128.png` | Ohne Upload nimmt AMO das Icon aus dem Manifest |
| Screenshot 1 | `store/images/screenshot-1.png` | 1280×800 (von AMO empfohlen) |
| Screenshot 2 | `store/images/screenshot-2.png` | 1280×800 |
| Screenshot 3 | `store/images/screenshot-3.png` | 1280×800 |

Bildunterschriften für die Screenshots:
1. `Preise im Shop werden als Arbeitszeit angezeigt – Lohn und Stunden stellst du im Popup ein.`
2. `Auf Produktseiten: Arbeitszeit, Arbeitstage und auf Wunsch der Originalpreis.`
3. `Vorher/Nachher – und jederzeit an- und ausschaltbar.`

Unter **Additional Details**:

| Feld | Wert |
|---|---|
| Tags | `shopping` |
| Homepage | `https://github.com/Floposos/differentpay` |
| Contributions URL | – (leer lassen) |

---

## Hinweise zur Prüfung

- Neue Add-ons werden zuerst automatisch geprüft und sind danach meist innerhalb von Minuten bis wenigen Tagen
  öffentlich. Mozilla kann später zusätzlich manuell prüfen.
- Nach der Freigabe bietet AMO die signierte Datei an. Normale Firefox-Nutzer können die Erweiterung dann
  direkt von addons.mozilla.org installieren.
- Für ein Update `version` in `manifests/firefox.json` erhöhen, `./build.sh` ausführen und im Developer Hub
  unter **Upload New Version** die neue `.xpi` hochladen.
