# DifferentPay – Preise in Arbeitsstunden

Browser-Erweiterung für **Firefox** und **Chrome**, die Preise auf Shopping-Seiten durch die Arbeitszeit
ersetzt, die du dafür arbeiten musst. Statt `249,00 €` steht dort z.B. `⏱ 17,3 h (≈ 2,2 Arbeitstage)`.

- Monatslohn (netto) und Wochenstunden frei einstellbar
- Live an/aus per Schalter im Popup oder **Alt+Shift+H** – ohne Neuladen der Seite
- Originalpreis per Tooltip oder optional klein daneben
- Erkennt gängige Formate (`19,99 €`, `€ 1.299,00`, `$1,049.95`, `29,– €`, `CHF 120.50`, hochgestellte Cents,
  Amazon-Preise) und nachgeladene Inhalte

## Download & Installation

Die fertigen Pakete gibt es unter [**Releases**](../../releases/latest).

### Chrome (auch Edge, Brave, Opera)

1. `differentpay-chrome-<version>.zip` herunterladen und entpacken
2. `chrome://extensions` öffnen und oben rechts den **Entwicklermodus** aktivieren
3. **Entpackte Erweiterung laden** und den entpackten Ordner auswählen

Den Ordner danach nicht löschen – Chrome lädt die Erweiterung von dort.

### Firefox

1. `differentpay-firefox-<version>.xpi` herunterladen
2. `about:debugging#/runtime/this-firefox` öffnen → **Temporäres Add-on laden…** → die `.xpi` wählen

Firefox installiert dauerhaft nur von Mozilla signierte Add-ons; temporär geladene verschwinden beim Neustart.
Dauerhaft geht es so:

- **Firefox Developer Edition / Nightly:** in `about:config` `xpinstall.signatures.required` auf `false`
  setzen, dann die `.xpi` per Drag & Drop ins Fenster ziehen
- **Normales Firefox:** die `.xpi` auf [addons.mozilla.org/developers](https://addons.mozilla.org/developers/)
  als „Eigene Verbreitung“ (unlisted) kostenlos signieren lassen und die signierte Datei installieren

## Berechnung

Stundenlohn = Monatslohn / (Wochenstunden × 52 / 12). Ab 10 Stunden werden zusätzlich Arbeitstage
(Wochenstunden / 5) angezeigt. Fremdwährungen werden nicht umgerechnet, sondern 1:1 behandelt.

## Entwicklung

```
src/          gemeinsamer Code (Content-Script, Popup, Background, Icons)
manifests/    firefox.json (Manifest V2) und chrome.json (Manifest V3)
build.sh      baut dist/firefox, dist/chrome und die Release-Pakete
test/         Testseite mit Beispielpreisen
```

```sh
./build.sh
```

Zum Entwickeln `dist/chrome` bzw. `dist/firefox/manifest.json` direkt im Browser laden.

## Datenschutz

Die Erweiterung speichert nur deine Einstellungen lokal und überträgt keine Daten – siehe [PRIVACY.md](PRIVACY.md).
