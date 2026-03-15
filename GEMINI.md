# CLAUDE4.md — QoL & Ergonomics Overhaul

## Kontext a Cíl
Aplikace potřebuje kritické úpravy pro reálné každodenní používání na specifickém hardwaru (49" ultrawide) a přizpůsobení pro dny s nízkou energií. Zaměř se na ergonomii, keyboard-first navigaci a multi-device přípravu.

## Implementační kroky

### 1. Ultrawide G9 Fix (Centrování)
* Zabal celý hlavní layout (včetně sidebaru) do kontejneru `max-w-[1600px] mx-auto`.
* Sidebar nesmí být "přilepený" na levém fyzickém okraji 49" monitoru. Musí být součástí vycentrovaného bloku. Zbytek obrazovky je pure black (`#000000`).

### 2. State Sync Příprava
* Čistý `localStorage` omezuje použití na jedno zařízení.
* Napiš utilitu pro manuální Export/Import stavu do JSONu (`quest-state.json`).
* Odděl logiku ukládání tak, aby se dala v budoucnu snadno napojit na **Tauri** (pro přímý zápis do lokální synchronizované složky).

### 3. Command Palette (`cmdk`)
* Nainstaluj a implementuj `cmdk`.
* Spouštění přes `Cmd + K` (nebo Ctrl+K).
* Overlay s blurem. Musí umět: hledat questy, přepínat routy, togglovat nastavení.
* Přidej základní Vim navigaci (`j`/`k` pro pohyb v listu, `x` pro splnění vybraného questu).

### 4. Zen Mode
* Přidej tlačítko / zkratku pro absolutní focus.
* Akce: Skryje celý UI (sidebar, staty, XP bar, ostatní questy).
* Zobrazí pouze **jeden vybraný (pinned) quest** uprostřed černé obrazovky.

### 5. OS Integration API
* Vytvoř local API endpoint (např. `/api/status`).
* Endpoint bude vracet čistý JSON aktuálního stavu: `{"level": 12, "xp": 4500, "active_quest": "Název"}`.
* Slouží pro externí systémové status bary.

### 6. Sensory Settings & Soft Fail
* Přidej do nastavení "Sensory Panel" – oddělené přepínače pro zvuky a animace/konfety.
* Implementuj "Soft Fail" – místo agresivních červených "Missed" nebo "Failed" stavů questy pouze "usnou" (Snooze state) a zšednou, žádná penalizace.