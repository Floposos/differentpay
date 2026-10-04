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

1. `differentpay-firefox-<version>.zip` herunterladen (nicht entpacken)
2. `about:debugging#/runtime/this-firefox` öffnen → **Temporäres Add-on laden…** → die `.zip` wählen

Die Datei liegt bewusst als `.zip` vor: Eine `.xpi` versucht Firefox beim Klick sofort zu installieren und
blockiert sie, weil sie (noch) nicht von Mozilla signiert ist.

Temporär geladene Add-ons verschwinden beim Neustart von Firefox. Dauerhaft geht es so:

- **Firefox Developer Edition / Nightly:** in `about:config` `xpinstall.signatures.required` auf `false`
  setzen, die Datei in `.xpi` umbenennen und per Drag & Drop ins Fenster ziehen
- **Normales Firefox:** die Datei auf [addons.mozilla.org/developers](https://addons.mozilla.org/developers/)
  als „Eigene Verbreitung“ (unlisted) kostenlos signieren lassen und die signierte `.xpi` installieren

## Berechnung

Stundenlohn = Monatslohn / (Wochenstunden × 52 / 12). Ab 10 Stunden werden zusätzlich Arbeitstage
(Wochenstunden / 5) angezeigt. Fremdwährungen werden nicht umgerechnet, sondern 1:1 behandelt.

## Entwicklung

```
src/          gemeinsamer Code (Content-Script, Popup, Background, Icons)
manifests/    firefox.json (Manifest V2) und chrome.json (Manifest V3)
build.sh      baut dist/firefox, dist/chrome und die Release-Pakete
test/         Testseite mit Beispielpreisen
store/        Store-Einreichung: CHROME.md, FIREFOX.md, Grafiken und render.sh
```

```sh
./build.sh
```

Zum Entwickeln `dist/chrome` bzw. `dist/firefox/manifest.json` direkt im Browser laden.

## Datenschutz

Die Erweiterung speichert nur deine Einstellungen lokal und überträgt keine Daten – siehe [PRIVACY.md](PRIVACY.md).

## Lizenz

[MIT](LICENSE)
