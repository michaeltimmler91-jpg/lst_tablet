# Los Santos Taxi Tablet

FiveM-/ESX-Tablet für das Los Santos Taxi.

Das Tablet öffnet deine Taxi-Webseite ingame in einer NUI, während der Spieler ein Tablet in der Hand hält.

Webseite:

```txt
https://los-santos-taxi.michaeltimmler91.workers.dev/
```

## Funktionen

- Tablet per Command öffnen
- Tablet-Prop in der Hand
- Tablet-Animation
- NUI mit echter Tablet-Optik
- Transparenz-Regler
- Größen-Regler für das komplette Tablet
- Einstellungen werden lokal gespeichert
- Schließen per X oder ESC

## Installation

### 1. Resource herunterladen

Repo herunterladen oder klonen:

```txt
https://github.com/michaeltimmler91-jpg/lst_tablet
```

Der Ordner muss danach so heißen:

```txt
lst_tablet
```

### 2. Resource in den Server kopieren

Kopiere den Ordner nach:

```txt
resources/[local]/lst_tablet
```

Oder in einen anderen Resource-Ordner, den dein Server lädt.

Wichtig ist nur, dass im Ordner diese Dateien liegen:

```txt
lst_tablet/
├─ fxmanifest.lua
├─ client.lua
└─ html/
   ├─ index.html
   ├─ style.css
   └─ app.js
```

### 3. In die server.cfg eintragen

In deiner `server.cfg` eintragen:

```txt
ensure lst_tablet
```

Danach Server starten oder Resource neu starten:

```txt
restart lst_tablet
```

## Nutzung ingame

Tablet öffnen/schließen:

```txt
/taxitablet
```

Schließen geht auch über:

```txt
ESC
```

oder über das X oben rechts im Tablet.

## Einstellungen im Tablet

Oben rechts auf das Zahnrad klicken.

Dort gibt es:

```txt
Transparenz
Tablet-Größe
```

Die Werte werden im FiveM-Client lokal gespeichert. Jeder Spieler kann sich das Tablet also selbst einstellen.

## ESX-Hinweis

Aktuell ist das Tablet erstmal per Command nutzbar.

Für ein ESX-Item kann später z. B. ein Item wie `taxi_tablet` registriert werden, das dann clientseitig das Tablet öffnet.

Beispiel-Idee:

```lua
RegisterNetEvent('lst_tablet:open', function()
    ExecuteCommand('taxitablet')
end)
```

## Wenn die Webseite nicht lädt

Wenn das Tablet aufgeht, aber die Webseite weiß bleibt:

- Prüfen, ob die Webseite erreichbar ist.
- Prüfen, ob die URL in `html/index.html` stimmt.
- Prüfen, ob die Webseite iframe/NUI erlaubt.

Die URL steht hier:

```html
<iframe src="https://los-santos-taxi.michaeltimmler91.workers.dev/"></iframe>
```

## Wenn das Tablet nicht aufgeht

Prüfen:

```txt
ensure lst_tablet
```

Dann in der F8-Konsole schauen, ob Fehler angezeigt werden.

Häufige Ursachen:

```txt
Resource-Ordner falsch benannt
fxmanifest.lua fehlt
html-Dateien liegen nicht im html-Ordner
Resource wurde nicht neugestartet
```

## Anpassung der Webseite

Die Webseite kann in dieser Datei geändert werden:

```txt
html/index.html
```

Dort die iframe-URL ändern:

```html
src="https://los-santos-taxi.michaeltimmler91.workers.dev/"
```

## Lizenz / Nutzung

Für das Los Santos Taxi Projekt erstellt.
