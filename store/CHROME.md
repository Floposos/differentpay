# Chrome Web Store – Einreichung DifferentPay

Alle Texte und Dateien für das [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole),
geordnet nach den Reitern dort. Texte einfach in die jeweiligen Felder kopieren.

## Vorab (einmalig)

1. Developer-Konto registrieren: einmalig 5 US$ Gebühr, mit deinem Google-Konto
2. Im Dashboard unter **Konto** eine Kontakt-E-Mail eintragen und bestätigen (Pflicht zum Veröffentlichen)

## Paket

| Datei | Erzeugen mit |
|---|---|
| `dist/differentpay-chrome-1.0.0.zip` | `./build.sh` im Projektordner |

Im Dashboard: **Neues Element hinzufügen** → ZIP hochladen.

---

## Reiter „Store-Eintrag“

**Sprache:** Deutsch

**Name** (kommt aus dem Manifest):
```
DifferentPay – Preise in Arbeitsstunden
```

**Zusammenfassung** (kommt aus dem Manifest, max. 132 Zeichen):
```
Zeigt Preise auf Shopping-Seiten als Arbeitszeit an, die du dafür arbeiten musst.
```

**Beschreibung:**
```
Was kostet das wirklich? DifferentPay zeigt dir Preise nicht in Euro, sondern in der Zeit, die du dafür arbeiten musst.

Statt „249,00 €“ steht dort z. B. „⏱ 14,4 h“ – und bei größeren Anschaffungen zusätzlich die Zahl der Arbeitstage. So siehst du auf einen Blick, ob dir etwas den Aufwand wirklich wert ist.

SO FUNKTIONIERT'S
1. Auf das DifferentPay-Symbol klicken
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
Deine Angaben bleiben auf deinem Gerät. DifferentPay sendet keine Daten, nutzt kein Tracking und keine Werbung. Der Quellcode ist offen auf GitHub einsehbar.

BERECHNUNG
Stundenlohn = Monatslohn ÷ (Wochenstunden × 52 ÷ 12). Ein Arbeitstag entspricht einem Fünftel deiner Wochenstunden. Fremdwährungen werden nicht umgerechnet.
```

**Kategorie:** Lifestyle → Shopping

**Grafiken:**

| Feld | Datei | Format |
|---|---|---|
| Store-Symbol | `store/images/store-icon-128.png` | 128×128 |
| Screenshot 1 | `store/images/screenshot-1.png` | 1280×800 |
| Screenshot 2 | `store/images/screenshot-2.png` | 1280×800 |
| Screenshot 3 | `store/images/screenshot-3.png` | 1280×800 |
| Kleine Werbekachel | `store/images/promo-small.png` | 440×280 |
| Marquee-Werbekachel (optional) | `store/images/promo-marquee.png` | 1400×560 |

**Zusätzliche Felder:**

| Feld | Wert |
|---|---|
| Offizielle URL | – (leer lassen, erfordert verifizierte Domain) |
| Startseiten-URL | `https://github.com/Floposos/differentpay` |
| Support-URL | `https://github.com/Floposos/differentpay/issues` |
| Nicht jugendfreie Inhalte | Nein |

---

## Reiter „Datenschutz“

**Beschreibung des einzigen Zwecks:**
```
DifferentPay rechnet Preise auf Webseiten in die Arbeitszeit um, die der Nutzer anhand seines selbst eingegebenen Monatslohns und seiner Wochenstunden dafür arbeiten müsste, und zeigt diese Arbeitszeit anstelle des Preises an.
```

**Begründung für „storage“:**
```
Speichert lokal die vom Nutzer eingegebenen Einstellungen (Monatslohn, Wochenstunden, Ein/Aus-Status, Anzeigeoption), damit sie auf allen Seiten und nach einem Neustart erhalten bleiben. Die Daten verlassen das Gerät nicht.
```

**Begründung für Host-Berechtigungen** (Content-Script auf `<all_urls>`):
```
Preise erscheinen auf beliebigen Shopping-Seiten, daher muss das Content-Script auf allen Seiten laufen, um Preisangaben im Seitentext zu erkennen und lokal durch die berechnete Arbeitszeit zu ersetzen. Seiteninhalte werden ausschließlich im Browser verarbeitet und weder gespeichert noch übertragen.
```

**Remote-Code:**
```
Nein, ich verwende keinen Remote-Code.
```

**Datennutzung** – bei „Welche Nutzerdaten erfassen Sie?“ **nichts ankreuzen**
(die Einstellungen werden nur lokal gespeichert und nicht erfasst/übertragen).

Alle drei Bestätigungen am Ende ankreuzen:
- Ich verkaufe oder übertrage keine Nutzerdaten an Dritte …
- Ich verwende oder übertrage keine Nutzerdaten für Zwecke, die nicht mit dem einzigen Zweck zusammenhängen …
- Ich verwende oder übertrage keine Nutzerdaten, um die Kreditwürdigkeit zu ermitteln …

**URL der Datenschutzerklärung:**
```
https://github.com/Floposos/differentpay/blob/main/PRIVACY.md
```

---

## Reiter „Vertrieb“

| Feld | Empfehlung |
|---|---|
| Sichtbarkeit | Öffentlich |
| Regionen | Alle Regionen |
| Preis | Kostenlos |

---

## Hinweise zur Prüfung

- Wegen der Berechtigung für alle Webseiten kann die Prüfung einige Tage länger dauern („in-depth review“).
  Das ist bei Erweiterungen dieser Art normal.
- Grafiken neu erzeugen nach Änderungen: `store/render.sh` (benötigt Chrome, Chromium oder Edge).
- Für ein Update `version` in `manifests/chrome.json` erhöhen, `./build.sh` ausführen und die neue ZIP im
  Dashboard unter **Paket** hochladen.
