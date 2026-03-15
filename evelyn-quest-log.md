# 🏔️ EVELYN'S QUEST LOG — 200 Projektů & Misí

> *"I had treasures in my mind but couldn't open up my own vaults."*
> — Teď máš klíč.

**Setup:** MacBook Pro 16" M5 Pro (24 GB) · PC: Ryzen 5 7600X + RTX 3080 10GB + 32 GB RAM (Win11/Arch+Sway) · Samsung G9 OLED 49" · iPad Pro 13" + Apple Pencil Pro · Wacom One · Steam Deck OLED · iPhone 17 Pro · Mackie CR4.5BT · Sony WH-1000XM6 · Razer Ornata V3 · MX Master 3 · Anker Prime 250W + 165W · Garmin Fenix 8 Solar · Dell Latitude E5300 (Arch) · SDR · Casio klávesy

---

## 📋 Systém

**Každý bod má:** Popis · Jak začít za 5 min · ⏱ Time · ★ Difficulty · 🎯 XP · 🔗 Prereqs · 🏷 Tagy · Checkboxy

### XP Level System
| Lvl | XP | Název | Lvl | XP | Název |
|-----|-----|-------|-----|-----|-------|
| 1 | 0 | `git init` | 7 | 1100 | Fullstack Alchemist |
| 2 | 50 | Script Kiddie | 8 | 1500 | System Whisperer |
| 3 | 150 | Config Warrior | 9 | 2000 | Creative Polymath |
| 4 | 300 | Pipeline Architect | 10 | 2750 | Digital Kanye |
| 5 | 500 | Dotfile Artisan | 11 | 3500 | Vault Keeper |
| 6 | 750 | Shader Witch | 12 | 4500 | Evelyn.exe |
| | | | MAX | 6000+ | ✨ GOAT ✨ |

**XP:** ★=10 · ★★=25 · ★★★=50 · ★★★★=100 · ★★★★★=200

---

## 🧠 AKT I — ZÁKLADY (Foundational)

### 001 — Obsidian Vault: Second Brain
Postav Obsidian vault jako OS tvého života. Složky: `📥 Inbox`, `🎓 FEL` (per předmět), `🎮 Game Dev`, `🎵 Music`, `📊 Stats`, `🔧 Projects`, `📓 Journal`. Daily Note = brain dump. iCloud sync (Mac↔iPhone), Syncthing (Mac↔Arch), vault v gitu.

**5 min start:** Stáhni Obsidian → vault `~/Obsidian/evelyn-brain` → vytvoř složky → první daily note.

⏱ 2h + 5min/den | ★★ | 🎯 25 | 🔗 — | 🏷 `#adhd` `#foundational`
☐ Vault ☐ Složky ☐ Daily Note template ☐ iCloud sync ☐ Syncthing ☐ 7 dní daily notes

### 002 — Dotfiles v Gitu (GNU Stow)
`~/.dotfiles` bare repo. Sway, Kitty, Waybar, Bash, Neovim, Git, SketchyBar — vše verzované. GNU Stow pro symlinky. Nový install = `git clone + stow`.

**5 min start:** `mkdir ~/.dotfiles && cd ~/.dotfiles && git init && mkdir kitty && mv ~/.config/kitty kitty/.config/kitty && stow kitty`

⏱ 3h + ongoing | ★★ | 🎯 25 | 🔗 — | 🏷 `#systém` `#foundational`
☐ Repo ☐ Kitty ☐ Sway ☐ Waybar ☐ Bash ☐ Git config ☐ README ☐ GitHub push

### 003 — Mac Setup Script (brew.sh)
Tvůj 80+ app brew seznam jako spustitelný skript + macOS defaults + Karabiner config + SketchyBar config. Mac přijde 20.3. — buď ready.

**5 min start:** `vim ~/.dotfiles/macos/setup.sh` → vlož brew příkaz → `chmod +x` → commit.

⏱ 4h | ★★ | 🎯 25 | 🔗 #002 | 🏷 `#mac` `#foundational`
☐ brew.sh ☐ macOS defaults ☐ Karabiner ☐ SketchyBar ☐ Testnut 20.3.

### 004 — Downloads Auto-Sorter
`inotifywait` na Archu, Hazel na Macu. `.pdf` → Documents, `.zip` → _archives, installers → _installers (auto-delete 7d), images → Pictures/YYYY-MM/. Bonus: Ollama AI classifier.

**5 min start:** `sudo pacman -S inotify-tools` → 20-řádkový bash case statement.

⏱ 1h + 2h AI | ★★ | 🎯 25 | 🔗 — | 🏷 `#automatizace` `#adhd`
☐ Bash skript ☐ Hazel rules ☐ Systemd service ☐ 7 dní čistý Downloads ☐ AI classifier

### 005 — Unified File Structure
`~/Projects/{fel,gamedev,web,experiments}`, `~/Creative/{music,video,art,photos}`, `~/Documents/{fel,personal,reference}`. Syncthing across OS.

**5 min start:** `mkdir -p ~/Projects/{fel,gamedev,web,experiments} ~/Creative/{music,video,art,photos}`

⏱ 2h | ★ | 🎯 10 | 🔗 #001 #002 | 🏷 `#systém` `#foundational`
☐ Mac struktura ☐ Arch struktura ☐ Syncthing ☐ Soubory migrovány

### 006 — Git Workflow & Aliasy
Conventional commits, `.gitconfig` aliasy (`gs`, `co`, `cm`, `lg`), lazygit TUI.

**5 min start:** Přidej aliasy do `.gitconfig`. Install lazygit.

⏱ 30m | ★ | 🎯 10 | 🔗 #002 | 🏷 `#git` `#productivity`

### 007 — Syncthing Mesh (Mac↔Arch↔iPhone)
P2P sync bez cloudu. Möbius Sync na iPhone.

**5 min start:** `brew install syncthing` + `pacman -S syncthing` → web GUI → spárovat.

⏱ 1h | ★★ | 🎯 25 | 🔗 #005 | 🏷 `#cross-platform` `#sync`

### 008 — Notion Task Database
Task name, Status, Priority (P1-P4), Due date, Energy level (🔴🟡🟢). Views: Kanban, Calendar, "Co teď." Notion Calendar propojení.

**5 min start:** Notion → New Database "Tasks" → 3 aktuální úkoly.

⏱ 1h + ongoing | ★★ | 🎯 25 | 🔗 — | 🏷 `#adhd` `#productivity`

### 009 — ADHD Morning Launch Sequence
iPhone Shortcut "Ráno": alarm → kalendář → top 3 tasky → weather → léky reminder → Spotify playlist. Raycast script na Macu.

**5 min start:** Shortcuts → New → Show Calendar Events (today) → Show Reminder → Play Playlist.

⏱ 1h | ★★ | 🎯 25 | 🔗 #008 | 🏷 `#adhd` `#automatizace`

### 010 — Léky Tracker & Reminders
Venlafaxin 150mg (ráno), Trittico 25mg (večer), Progesteron Besins (večer), Neofollin 1x/týden, Lamotrigin. iPhone reminders + mood tracking v Obsidian daily note (1-5) → data pro psychiatra.

**5 min start:** 3 iPhone reminders: 8:00, 22:00, [den] Neofollin.

⏱ 15m | ★ | 🎯 10 | 🔗 — | 🏷 `#zdraví` `#adhd`
☐ Reminders ☐ Mood tracking 7d ☐ Data 30d

---

## 🖥️ AKT II — STROJE & PROSTŘEDÍ

### 011 — Arch + Sway Rice (r/unixporn Level)
Unified colorscheme, Waybar custom moduly, Kitty + Maple Mono, Wofi, Mako, swaylock blur, grim+slurp+swappy. Cíl: r/unixporn 1k+ upvotes.

**5 min start:** `yay -S catppuccin-gtk-theme-mocha` → aplikuj na Kitty.

⏱ 8-15h | ★★★ | 🎯 50 | 🔗 #002 | 🏷 `#arch` `#ricing`
☐ Colorscheme ☐ Sway ☐ Waybar ☐ Kitty ☐ Wofi ☐ Mako ☐ swaylock ☐ GTK ☐ Screenshot post ☐ 1k+ upvotes 🏆

### 012 — SketchyBar na macOS
Lua scripty: workspace indicators, Spotify now playing, CPU/RAM, battery, clock, git branch, Ollama status. Purple aesthetic.

**5 min start:** `brew install sketchybar` → default config → `brew services start sketchybar`.

⏱ 6-10h | ★★★ | 🎯 50 | 🔗 #003 | 🏷 `#mac` `#ricing`

### 013 — Karabiner: Hyper Key
Caps Lock → Hyper (Ctrl+Opt+Cmd+Shift). Hyper+T=Kitty, +B=Arc, +F=Figma, +S=Spotify, +O=Obsidian, +N=Notion, +I=IntelliJ.

**5 min start:** Karabiner → Complex Modifications → Caps Lock → Hyper Key.

⏱ 1h | ★★ | 🎯 25 | 🔗 #003 | 🏷 `#mac` `#productivity`

### 014 — Ollama: Lokální AI
Mac: 7-8B modely (Llama 3.1 8B, Mistral 7B, CodeLlama). PC: 7B full / 13B Q4 (CUDA). Open WebUI frontend. RAG s Obsidian vault.

**5 min start:** `brew install ollama && ollama serve && ollama pull llama3.1:8b`

⏱ 1h/stroj | ★★ | 🎯 25 | 🔗 — | 🏷 `#ai` `#foundational`
☐ Mac ☐ PC CUDA ☐ Open WebUI ☐ CodeLlama ☐ RAG

### 015 — Barrier: Software KVM
Razer Ornata + MX Master sdílené mezi Mac a PC po síti.

**5 min start:** `brew install barrier` + `pacman -S barrier` → Mac=server, PC=client.

⏱ 30m | ★★ | 🎯 25 | 🔗 — | 🏷 `#cross-platform`

### 016 — G9 OLED Dual-Input
USB-C z Macu + DP z PC. MonitorControl na Macu. MX Master BT profily.

⏱ 30m | ★ | 🎯 10 | 🔗 — | 🏷 `#hardware`

### 017 — PipeWire Audio Routing (Arch)
Per-app routing: Discord→XM6, hra→Mackie. WirePlumber. BT profily (XM6 LDAC, Mackie).

⏱ 2h | ★★★ | 🎯 50 | 🔗 — | 🏷 `#arch` `#audio`

### 018 — iPad Pro Sidecar + Astropad
Sidecar = wireless second display. Astropad = wireless drawing tablet. Procreate standalone.

⏱ 15m+1h | ★ | 🎯 10 | 🔗 — | 🏷 `#ipad`

### 019 — Steam Deck OLED Config
EmuDeck, Decky Loader, ProtonUp-Qt + Proton-GE, CryoUtilities. Dock→G9+Mackie.

⏱ 3h | ★★ | 🎯 25 | 🔗 — | 🏷 `#steamdeck`

### 020 — Tailscale VPN Mesh
Všechna zařízení v privátní síti. MagicDNS. SSH odkudkoli.

**5 min start:** `brew install tailscale && tailscale up`

⏱ 30m | ★★ | 🎯 25 | 🔗 — | 🏷 `#networking`

---

## 🎓 AKT III — ŠKOLA

### 021 — "Mundane Mountain" Java Celeste Hra (PJV)
2D platformer o každodenních překážkách mentálního zdraví. Java SE, Java2D, tilemap levels. Game loop → tilemap → collision → movement → jump → wall climb → dash → levels → NPC dialogy → art → polish. **ČERVENÝ ČTVEREC** dokud nefunguje gameplay.

**5 min start:** IntelliJ → Maven projekt → JFrame 800x600 → `while(true)` 60fps loop → commit.

⏱ 30-50h | ★★★ | 🎯 50 | 🔗 — | 🏷 `#fel` `#pjv` `#gamedev`
☐ Game loop ☐ Tilemap ☐ Player ☐ Gravity ☐ Collision ☐ Movement+jump ☐ Wall slide ☐ Dash ☐ Camera ☐ Checkpoints ☐ Level 1 ☐ NPCs ☐ Collectibles ☐ Art pass ☐ Sound ☐ Menu ☐ Save ☐ 3+ levels ☐ Polish

### 022 — OpenGL Rendering Engine (PGR)
C++ + GLFW + GLAD. Triangle → textured quad → Phong lighting → shadow mapping → model loading. Mac (OpenGL legacy) nebo PC (full 4.6).

**Phong = ambient + diffuse(N·L) + specular(R·V)^n. Tři vektory: Normal, Light dir, View dir.**

⏱ 40-60h | ★★★★ | 🎯 100 | 🔗 — | 🏷 `#fel` `#pgr` `#opengl` `#gpu`
☐ Window ☐ Triangle ☐ Shaders ☐ Textures ☐ Camera ☐ Phong ☐ Multi-light ☐ Normal maps ☐ Shadows ☐ Model loading

### 023 — A* Visualizer (AI předmět)
Interaktivní grid: BFS, Dijkstra, A* v reálném čase. React+Canvas nebo Python+Pygame. Side-by-side porovnání na G9. **Admissible heuristic = nikdy nepřestřelí skutečnou vzdálenost.**

⏱ 8-15h | ★★★ | 🎯 50 | 🔗 — | 🏷 `#fel` `#ai` `#vizualizace`
☐ Grid ☐ Walls ☐ BFS ☐ Dijkstra ☐ A* ☐ Animace ☐ Stats panel

### 024 — Parallel Algorithms (PDV)
Thread pool rozšíření: parallel merge sort, matrix multiply. CUDA port na RTX 3080. CPU vs GPU benchmark.

⏱ 10-20h | ★★★ | 🎯 50 | 🔗 — | 🏷 `#fel` `#pdv` `#cpp` `#gpu`

### 025 — Network Monitor (PSIA)
Python + scapy: real-time packet sniffer → dashboard. TCP handshakes, UDP, DNS. **TCP = doporučený dopis (víš že došel). UDP = křičíš z okna (rychlý ale kdo ví).**

⏱ 10-15h | ★★★ | 🎯 50 | 🔗 — | 🏷 `#fel` `#psia` `#python`

### 026 — Databázová Semestrálka
Schema design, normalizace, SQL, indexy. TablePlus/Postico na Macu.

⏱ 15-25h | ★★★ | 🎯 50 | 🔗 — | 🏷 `#fel` `#sql`

### 027 — FEL Study System (Obsidian)
Per-předmět: README (sylabus, deadlines), notes, labs, exam-prep.

⏱ 2h + ongoing | ★ | 🎯 10 | 🔗 #001 | 🏷 `#fel` `#obsidian`

### 028 — Matematické Vizualizace
Eigenvalues, Fourier, gradient fields. Python + Matplotlib/Manim. Stokes' theorem on manifolds visual.

⏱ 5-15h | ★★★ | 🎯 50 | 🔗 — | 🏷 `#matika` `#vizualizace`

---

## 🎨 AKT IV — KREATIVNÍ

### 029 — JID Koncert Edit (DaVinci Resolve)
iPhone footage → Mac → DaVinci. Lyrics overlay, slow-mo, color grade. **30 sec první verze. Ne 3 minuty.**

⏱ 4-8h | ★★ | 🎯 25 | 🔗 — | 🏷 `#video` `#mac` `#první-kontakt`
☐ DaVinci ☐ Import ☐ Rough cut 30s ☐ Color grade ☐ Lyrics ☐ Audio sync ☐ Export ☐ Post

### 030 — FL Studio: První Beat (DOOM × Kanye × Depeche Mode)
30sec loop. Boom-bap drums + soul sample chop + dark synth. Casio MIDI.

**5 min start:** FL → Channel Rack → kick+snare+hat → boom-bap pattern → Play.

⏱ 2h+ | ★★★ | 🎯 50 | 🔗 — | 🏷 `#hudba` `#fl-studio` `#první-kontakt`
☐ FL open ☐ Drum pattern ☐ Sample ☐ Casio MIDI ☐ 30s loop ☐ 8 bar ☐ Full song ☐ Mix ☐ Export

### 031 — Voice Training
Voice Tools app → baseline pitch → 10min/den cvičení. FIFINE mic + Mackie = home voice lab. Marathon, ne sprint.

⏱ 10min/den, 6-12 měs | ★★★★ | 🎯 100 | 🔗 — | 🏷 `#zdraví` `#osobní`

### 032 — Portfolio Redesign (Next.js + Tailwind)
Dark theme, fialová, project showcase, CV, kontakt. Vercel deploy.

⏱ 10-20h | ★★★ | 🎯 50 | 🔗 — | 🏷 `#web` `#kariéra`

### 033 — CV / Resume
LaTeX nebo Figma. CZ + EN verze. Apple Specialist ready.

⏱ 3-5h | ★★ | 🎯 25 | 🔗 #032 | 🏷 `#kariéra`

### 034 — Procreate: Překonání Strachu z Kreslení
**PRVNÍ 10 KRESEB JE TRASH A TO JE OK.** Kruhy, obličeje, setup, Steam Deck. Inspired by: "Can I Learn to Draw in 100 Hours?"

**5 min start:** Procreate → New canvas → Nakresli kruh → Oči + pusu → Save → Zavři → Zítra další.

⏱ 15min/den | ★★ | 🎯 25 | 🔗 — | 🏷 `#art` `#ipad` `#strach`
☐ První kresba ☐ 7 dní ☐ 30 dní ☐ Pyšná kresba ☐ Online

### 035 — Pixel Art v Aseprite (Game Assets)
Máš Aseprite na Steamu. Character sprite, walk cycle, dash effect, tileset pro Mundane Mountain.

⏱ 2-4h/sheet | ★★★ | 🎯 50 | 🔗 #021 | 🏷 `#pixel-art` `#gamedev`

### 036 — Blender Donut Tutorial
RTX 3080 CUDA rendering. **Cíl = projít tutoriál od A do Z bez rage-quitu.** Ne masterpiece.

**5 min start:** Blender → Delete cube → Add Torus → Save.

⏱ 8-12h | ★★★ | 🎯 50 | 🔗 — | 🏷 `#3d` `#blender` `#strach`

### 037 — iPhone ProRAW Photography Workflow
Foť ProRAW → edit Lightroom/Affinity → export → organize. Texture creation pro game dev.

⏱ ongoing | ★ | 🎯 10 | 🔗 — | 🏷 `#foto` `#iphone`

### 038 — DID Hra Koncept: Octopus Girl
Holka s DID, vlasy mění barvu per osobnost, pět octopus. GDD v Obsidian, moodboard, concept art. **Engine later — příběh a design first.**

⏱ ongoing | ★★★★ | 🎯 100 | 🔗 #034 | 🏷 `#gamedev` `#dream-projekt` `#osobní`
☐ GDD ☐ Character designs ☐ Octopus designs ☐ Moodboard ☐ Color palette ☐ Engine choice ☐ Prototype

---

## 🤖 AKT V — AI & AUTOMATIZACE

### 039 — RAG Pipeline (FEL Tutor)
LlamaIndex + Ollama. Nahraj skripta → ptej se → odpovědi s citacemi.

⏱ 4-8h | ★★★ | 🎯 50 | 🔗 #014 | 🏷 `#ai` `#fel`

### 040 — Stable Diffusion (RTX 3080)
ComfyUI + SDXL. Concept art, textures, reference images.

⏱ 3h+ | ★★★ | 🎯 50 | 🔗 — | 🏷 `#ai` `#pc` `#art`

### 041 — Whisper Transkripce
Voice memo → Mac/PC → Whisper → text v Obsidian. CZ + EN.

⏱ 1h | ★★ | 🎯 25 | 🔗 #001 | 🏷 `#ai` `#automatizace`

### 042 — Life Dashboard: Statistiky na Všechno
Garmin API + Spotify API + Git API + WakaTime → Python → Grafana. Real-time na G9.

⏱ 10-20h | ★★★★ | 🎯 100 | 🔗 — | 🏷 `#stats` `#dream-projekt`
☐ WakaTime ☐ stats.fm ☐ Garmin API ☐ Python aggregator ☐ Grafana ☐ Typing tracker ☐ Weekly report

### 043 — Typing Speed Tracker
MonkeyType sessions → CSV → Grafana vizualizace. 60→100 WPM.

⏱ 5min/den | ★★ | 🎯 25 | 🔗 #042 | 🏷 `#stats`

### 044 — Custom Task Manager (React + Tauri)
Tvůj vlastní Todoist. XP systém, energy filter, Obsidian sync, keyboard-first, dark purple theme.

⏱ 30-50h | ★★★★ | 🎯 100 | 🔗 #001 #008 | 🏷 `#react` `#rust` `#dream-projekt`

### 045 — ADHD Auto-Reminders
Systemd timers + launchd + Shortcuts. Voda, spánek, git push, deadlines, cleanup.

⏱ 2h | ★★ | 🎯 25 | 🔗 #008 #010 | 🏷 `#adhd` `#automatizace`

---

## 🎧 AKT VI — AUDIO & HUDBA

### 046 — FIFINE Mikrofon Setup
USB → Mac/PC → OBS/DaVinci/FL Studio. Gain, acoustics, monitoring.

⏱ 1h | ★★ | 🎯 25 | 🔗 — | 🏷 `#audio` `#hardware`

### 047 — Multi-Output Audio Routing
Mac: Audio MIDI Setup multi-output. Arch: PipeWire profiles. Raycast switch script.

⏱ 1h | ★★ | 🎯 25 | 🔗 #017 | 🏷 `#audio`

### 048 — Spotify Data Analysis
5500+ řádků dat. K/DA MORE = 58 HODIN. Python + pandas: top artists, listening patterns, genre clusters.

⏱ 5-10h | ★★★ | 🎯 50 | 🔗 #042 | 🏷 `#stats` `#hudba`

### 049 — Music Theory Basics
Major/minor, chord progressions, rhythm, song structure. Casio hands-on. YouTube: Andrew Huang / 12tone.

⏱ 5-10h | ★★ | 🎯 25 | 🔗 #030 | 🏷 `#hudba` `#learning`

### 050 — Horrorcore Sound Design (Memphisto Vibes)
Vital synth (free) + FL Studio. Dark pads, industrial textures, granular synthesis. Field recording iPhone.

⏱ 3-8h | ★★★ | 🎯 50 | 🔗 #030 | 🏷 `#hudba` `#horrorcore`

---

## 🎮 AKT VII — GAMING

### 051 — Terraria: 137/137 Achievements
582h, 111/137. Expert/Master mode run.
⏱ 50-100h | ★★★ | 🎯 50 | 🏷 `#completionist`

### 052 — Disco Elysium: Second Playthrough
78h, 5/45 ach. Jiný build. Steam Deck OLED v posteli.
⏱ 30-50h | ★★ | 🎯 25 | 🏷 `#narrative`

### 053 — Persona 5 Royal: Dohrát
61h, asi v půlce. True ending.
⏱ 40-60h | ★★ | 🎯 25 | 🏷 `#jrpg`

### 054 — Hollow Knight Completion
Metroidvania perfection na OLED.
⏱ 20-40h | ★★★ | 🎯 50

### 055 — Ultrawide Gaming Best-Of
RTX 3080 + G9 5120x1440. Cyberpunk, Elden Ring, RDR2, Skyrim. DLSS + HDR.
⏱ ongoing | ★ | 🎯 10

### 056 — Skyrim Modded
MO2, ENB, texture overhaul. RTX 3080 + G9 cinematic.
⏱ 5h setup + play | ★★★ | 🎯 50

### 057 — Stardew Valley Co-op (Mája)
Mac + Deck = relaxační farming.
⏱ endless | ★ | 🎯 10 | 🏷 `#coop` `#mája`

### 058 — It Takes Two (Mája)
Split screen na G9 = 2×24.5". GOTY co-op.
⏱ 12-15h | ★ | 🎯 10 | 🏷 `#coop` `#mája`

### 059 — Steam Deck MHD Kit
Deck OLED + XM6 pro 20min cesty. BTD6, Balatro, Geometry Dash, Slay the Spire.
⏱ ongoing | ★ | 🎯 10

### 060 — EmuDeck Retro
SNES, PS1, GBA, N64 klasiky na OLED.
⏱ 2h setup | ★★ | 🎯 25 | 🔗 #019

---

## 💜 AKT VIII — WELL-BEING

### 061 — Spánkový Režim
Fix bedtime 23:00, trittico 30min předem, DND, XM6 sleep sounds. Garmin sleep tracking.

⏱ ongoing | ★★★★ | 🎯 100 | 🏷 `#zdraví` `#adhd`
☐ Bedtime alarm ☐ DND ☐ 7d ☐ 30d 🏆

### 062 — Hydration
1L láhev, 2L/den cíl, reminder každé 2h, daily note checkboxy.
⏱ 5min/den | ★ | 🎯 10 | 🏷 `#zdraví`

### 063 — Posilovna (Multisportka)
Po=škola, Út=volejbal, +1-2 gym. 3x/týden. Garmin tracking.
⏱ 3x/týden | ★★★ | 🎯 50 | 🏷 `#fitness`

### 064 — Finance Tracker
Notion database: příjmy, výdaje, kategorie. Nebo Wallet app (český).
⏱ 1h + 2min/den | ★★ | 🎯 25 | 🏷 `#finance` `#adhd`

### 065 — Psychiatr Appointment Template
Obsidian template: léky, změny, mood log, spánek data, otázky. Print/iPhone.
⏱ 30m | ★ | 🎯 10 | 🔗 #001 #010 | 🏷 `#zdraví`

---

## 🏠 AKT IX — HOMELAB

### 066 — Raspberry Pi Homelab
Pi-hole, Home Assistant, Gitea, Syncthing relay. Headless, SSH only.
⏱ 4-8h | ★★★ | 🎯 50 | 🔗 #020 | 🏷 `#homelab`

### 067 — SDR Experimenty
ADS-B letadla, FM radio, NOAA satelity. GNURadio + GQRX na Archu. Waterfall na G9.
⏱ 2h/experiment | ★★★ | 🎯 50 | 🏷 `#hardware` `#sdr`

### 068 — Dell Latitude → Headless Server
SSH only, Docker, Gitea, Grafana, Jellyfin. 24/7, Tailscale.
⏱ 4-8h | ★★★ | 🎯 50 | 🔗 #020 | 🏷 `#homelab`

---

## 🌟 AKT X — DREAM PROJEKTY

### 069 — Indie Studio Založení
Jméno, itch.io, GitHub org, Discord server. První release = #021 nebo game jam.
⏱ 2h + ongoing | ★★★★ | 🎯 100 | 🏷 `#gamedev` `#dream-projekt`

### 070 — Full Album/EP (Horrorcore Electronic)
5-7 tracků. FL Studio + FIFINE + Vital. Artwork v Procreate/AI. SoundCloud/Bandcamp release.
⏱ 50-100h | ★★★★★ | 🎯 200 | 🔗 #030 #046 #049 #050 | 🏷 `#hudba` `#dream-projekt`

### 071 — Psychologická Indie Hra (Full Game)
Celeste + DID hra = magnum opus. Godot, pixel art, original OST, mental health narrative.
⏱ 6-12 měs | ★★★★★ | 🎯 200 | 🔗 #021 #035 #038 #050 #069

### 072 — Ray Tracer od Nuly (C++/CUDA)
Shirley "Ray Tracing in One Weekend." Spheres → BVH → path tracing → RTX 3080 CUDA port.
⏱ 20-40h | ★★★★ | 🎯 100 | 🔗 #022 | 🏷 `#rendering` `#gpu`

### 073 — Custom Wayland Compositor
wlroots + C. Cíl: okno se renderuje. Zbytek je bonus. Ultra hardcore.
⏱ 20-50h | ★★★★★ | 🎯 200 | 🏷 `#linux` `#hardcore`

### 074 — Apple Specialist Job
CV + portfolio + apply. Nebo junior dev / QA.
⏱ 5-10h | ★★ | 🎯 25 | 🔗 #032 #033 | 🏷 `#kariéra`

---

## 🔮 SIDE QUESTS (075–200)

| # | Quest | ⏱ | ★ | XP |
|---|-------|----|---|-----|
| 075 | r/unixporn post 1K upvotes | 2h | ★★★ | 50 |
| 076 | r/battlestations G9 setup photo | 1h | ★ | 10 |
| 077 | Neovim config (LSP+Treesitter+Telescope) | 8-15h | ★★★ | 50 |
| 078 | Starship prompt config | 1h | ★ | 10 |
| 079 | Fzf workflow mastery | 1h | ★★ | 25 |
| 080 | Obsidian Canvas visual planning | 1h | ★ | 10 |
| 081 | Apple Notes → Obsidian migration | 2h | ★ | 10 |
| 082 | Garmin Fenix data export + vizualizace | 4h | ★★★ | 50 |
| 083 | Custom Wallpaper Engine live wallpaper | 4-8h | ★★★ | 50 |
| 084 | Terraria Journal (Procreate, per-boss) | ongoing | ★★★ | 50 |
| 085 | Geometry Dash custom level + FL Studio music | 5-10h | ★★★ | 50 |
| 086 | Game Jam (Ludum Dare/GMTK) — DODAT > perfect | 48h | ★★★★ | 100 |
| 087 | ShaderToy GLSL experiments | 1-2h | ★★★ | 50 |
| 088 | Docker Compose dev environments | 3h | ★★ | 25 |
| 089 | Self-hosted Vaultwarden (password manager) | 2h | ★★★ | 50 |
| 090 | Home network diagram (Figma) | 1h | ★ | 10 |
| 091 | Git hooks (format, lint, test) | 1h | ★★ | 25 |
| 092 | 3-2-1 Backup (Syncthing+Restic+rclone) | 3h | ★★★ | 50 |
| 093 | Markdown blog (Astro + GitHub Pages) | 4h | ★★ | 25 |
| 094 | Linux From Scratch | 20-40h | ★★★★★ | 200 |
| 095 | Open source contribution (Sway/Kitty/Godot) | 5-20h | ★★★ | 50 |
| 096 | LEGO train automation (Arduino/RPi) | 10-30h | ★★★★ | 100 |
| 097 | MonkeyType grind: 100 WPM | 3-6 měs | ★★★ | 50 |
| 098 | Custom Discord bot (Python) | 5-10h | ★★★ | 50 |
| 099 | LoL data analytics (Riot API + Grafana) | 8-15h | ★★★ | 50 |
| 100 | First track on SoundCloud — PUBLISH not finish | 2h | ★★ | 25 |
| 101 | Custom Raycast extension | 2h | ★★ | 25 |
| 102 | 10 Vim keybindů v IntelliJ | 1h | ★ | 10 |
| 103 | GitHub Actions CI pro FEL repo | 2h | ★★ | 25 |
| 104 | Waybar Spotify module | 1h | ★★ | 25 |
| 105 | Project scaffolding Bash script | 1h | ★★ | 25 |
| 106 | Firefox userChrome.css | 2h | ★★ | 25 |
| 107 | Git GPG signing | 30m | ★ | 10 |
| 108 | tmux basics | 1h | ★★ | 25 |
| 109 | 3D scan pokoje (iPhone LiDAR) | 30m | ★ | 10 |
| 110 | Sway keybind cheat sheet | 30m | ★ | 10 |
| 111 | Cava audio visualizer | 30m | ★ | 10 |
| 112 | Auto git push reminder (systemd) | 1h | ★★ | 25 |
| 113 | Python price scraper (Alza) | 3h | ★★★ | 50 |
| 114 | Custom 404 page | 1h | ★ | 10 |
| 115 | Regex mastery (regex101) | 2h | ★★ | 25 |
| 116 | Obsidian meeting notes template | 30m | ★ | 10 |
| 117 | CleanShot X → Obsidian workflow | 30m | ★ | 10 |
| 118 | Auto dark/light mode switch | 1h | ★★ | 25 |
| 119 | M5 Pro vs Ryzen benchmark | 1h | ★★ | 25 |
| 120 | .gitignore template collection | 30m | ★ | 10 |
| 121 | SSH config (ČVUT, GitHub, servers) | 30m | ★ | 10 |
| 122 | Custom Kitty theme | 1h | ★★ | 25 |
| 123 | Read "The Pragmatic Programmer" | 10h | ★★★ | 50 |
| 124 | Read "Designing Data-Intensive Apps" | 15h | ★★★★ | 100 |
| 125 | Voice journal entry (FIFINE + Whisper) | 15m | ★ | 10 |
| 126 | Proton gaming: top 5 her na Archu | 3h | ★★ | 25 |
| 127 | Custom Steam grid art (SteamGridDB) | 1h | ★ | 10 |
| 128 | Game review na Steam/blog | 1h | ★ | 10 |
| 129 | Figma design system (colors, fonts, components) | 4h | ★★★ | 50 |
| 130 | Procreate: 30 dní denně ✏️ | 15m/den | ★★★★ | 100 |
| 131 | 3 Blender shortcuts/den (30 dní) | 5m/den | ★★ | 25 |
| 132 | Pixel art tileset | 4h | ★★★ | 50 |
| 133 | FL Studio: reproduce oblíbený beat | 3h | ★★★ | 50 |
| 134 | Field recording Prague (iPhone) | 1h | ★★ | 25 |
| 135 | Napsat texty k jedné písničce | 1h | ★★ | 25 |
| 136 | LaTeX environment pro FEL | 2h | ★★ | 25 |
| 137 | Time-lapse z okna (iPhone) | 30m | ★ | 10 |
| 138 | Custom macOS icon pack (purple) | 3h | ★★★ | 50 |
| 139 | Docker Compose tutorial | 3h | ★★★ | 50 |
| 140 | Celeste 32/32 achievements 🏆 | 20h | ★★★★ | 100 |
| 141 | "Mája's Guide to Evelyn's Setup" (fun doc) | 2h | ★★ | 25 |
| 142 | Night photography (iPhone ProRAW) | 1h | ★★ | 25 |
| 143 | Instagram setup highlights | 30m | ★ | 10 |
| 144 | ffmpeg basics | 2h | ★★ | 25 |
| 145 | Raycast → Obsidian workflow | 2h | ★★★ | 50 |
| 146 | Auto screenshot organization | 1h | ★★ | 25 |
| 147 | RPi weather station | 8h | ★★★★ | 100 |
| 148 | Arch reinstall speed run | 4h | ★★★ | 50 |
| 149 | Pixel art → open source game | 4h | ★★★ | 50 |
| 150 | "Day in my life" video edit | 4h | ★★★ | 50 |
| 151 | Custom notification sounds | 1h | ★★ | 25 |
| 152 | Auto weekly report (Python) | 3h | ★★★ | 50 |
| 153 | SQL window functions | 2h | ★★★ | 50 |
| 154 | CLI quiz tool pro exam prep | 4h | ★★★ | 50 |
| 155 | Arch 1000 packages milestone | — | ★ | 10 |
| 156 | 10 Sway layout screenshots | 1h | ★ | 10 |
| 157 | Prodej starý hardware (Bazoš) | 2h | ★ | 10 |
| 158 | Spotify playlists per mood/activity | 1h | ★ | 10 |
| 159 | C basics (systems programming) | 10h | ★★★ | 50 |
| 160 | Docker: Ollama + WebUI one-command | 2h | ★★ | 25 |
| 161 | DID hra moodboard (Figma) | 2h | ★★ | 25 |
| 162 | Short story / micro-fiction | 1h | ★★ | 25 |
| 163 | Waybar theme switcher script | 2h | ★★★ | 50 |
| 164 | iOS Shortcut: voice→Whisper→Obsidian | 3h | ★★★ | 50 |
| 165 | Learn Rust (The Book, ch 1-8) | 15h | ★★★★ | 100 |
| 166 | Obsidian plugin (TypeScript) | 8h | ★★★★ | 100 |
| 167 | 3D print (FEL makerspace) | 4h | ★★★ | 50 |
| 168 | Generative art (p5.js) | 3h | ★★★ | 50 |
| 169 | Balatro deep run 🃏 | — | ★ | 10 |
| 170 | Celeste speedrun sub-1h | 5h | ★★★★ | 100 |
| 171 | **Detox: 30 dní bez trávy** 🏆 | — | ★★★★★ | 200 |
| 172 | **ADHD diagnostika 10.4.** | — | ★★★★ | 100 |
| 173 | Procreate: nakreslit Máju 💜 | 2h | ★★★ | 50 |
| 174 | Album cover art (Procreate) | 4h | ★★★★ | 100 |
| 175 | First voice memo music idea | 5m | ★ | 10 |
| 176 | MacBook + G9 dual monitor workflow | 30m | ★ | 10 |
| 177 | Custom GTK theme (Arch) | 2h | ★★★ | 50 |
| 178 | Sway IPC scripting | 3h | ★★★ | 50 |
| 179 | Archive staré fotky/videa | 2h | ★ | 10 |
| 180 | Dopisy sobě: za rok, za 5 let | 1h | ★★ | 25 |
| 181 | GDB debugging (PGR/PDV) | 3h | ★★★ | 50 |
| 182 | Obsidian CSS snippet (purple) | 1h | ★★ | 25 |
| 183 | Auto wallpaper rotation | 1h | ★★ | 25 |
| 184 | Anki flashcards pro FEL | 3h | ★★★ | 50 |
| 185 | Home Assistant IoT | 4h | ★★★ | 50 |
| 186 | Custom Sway loading screen | 2h | ★★★ | 50 |
| 187 | Steam Deck custom boot animation | 1h | ★★ | 25 |
| 188 | 30-day gesture drawing (5min/den) | ongoing | ★★★ | 50 |
| 189 | Night walk Prague + iPhone | 2h | ★★ | 25 |
| 190 | Ambient soundscape v FL (pro focus) | 3h | ★★★ | 50 |
| 191 | Fun 404/500 error page | 1h | ★★ | 25 |
| 192 | RPi RetroPie gaming station | 3h | ★★★ | 50 |
| 193 | Dotfiles README showcase | 2h | ★★ | 25 |
| 194 | Digital journaling na iPadu | ongoing | ★★ | 25 |
| 195 | Custom GRUB theme | 1h | ★★ | 25 |
| 196 | Stardew farm optimization spreadsheet | 2h | ★★ | 25 |
| 197 | Game tier list (Obsidian) | 1h | ★ | 10 |
| 198 | Uvařit jednu věc od nuly (pasta) | 1h | ★★ | 25 |
| 199 | **Napsat děkovný dopis Máje** 💜 | 30m | ★★★★★ | 200 |
| 200 | Otevřít seznam za rok — kolik XP? | 5m | ★ | 10 |

---

## 📊 XP SOUHRN

| Akt | Questů | Max XP |
|-----|--------|--------|
| I Foundation | 10 | 200 |
| II System | 10 | 270 |
| III FEL | 8 | 360 |
| IV Creative | 10 | 525 |
| V AI & Auto | 7 | 375 |
| VI Audio | 5 | 175 |
| VII Gaming | 10 | 225 |
| VIII Well-being | 5 | 210 |
| IX Homelab | 3 | 150 |
| X Dream | 6 | 825 |
| Side Quests | 126 | ~4760 |
| **TOTAL** | **200** | **~8075** |

GOAT (6000+ XP) = všechny main questy + ~60% side questů.

---

## 🗺️ DOPORUČENÉ POŘADÍ

```
WEEK 1 (Mac přijde 20.3.):
  001 Obsidian · 002 Dotfiles · 003 Mac Setup · 010 Léky

WEEK 2:
  005 Files · 006 Git · 007 Syncthing · 008 Notion Tasks
  013 Karabiner · 014 Ollama · 016 G9 Dual-Input

WEEK 3-4:
  004 Downloads Sorter · 009 Morning Routine
  011 Arch Rice · 012 SketchyBar · 029 JID Edit

ONGOING (parallel):
  021 Java Celeste (PJV deadline!)
  022 OpenGL (PGR)
  030 FL Studio · 034 Procreate · 042 Dashboard

MILESTONES:
  171 Detox 30 dní (cíl: 14.4.)
  172 ADHD diagnostika (10.4.)

DREAM (when ready):
  038 Octopus Girl · 069 Indie Studio
  070 Album · 071 Full Game
```

---

*XP: 0 / 8075 · Level 1: `git init` · 15. března 2026 · Mac za 5 dní*

> *"The world ain't ready for me."* — Evelyn, 4:47 AM, King Crimson v XM6
