#!/usr/bin/env python3
"""Parse INSANE.md and generate TypeScript quest entries for quests.ts"""
import re, sys

INSANE_MD = "/home/evelyn/quest-log/INSANE.md"
OUTPUT_TS = "/home/evelyn/quest-log/scripts/insane_quests_output.ts"
ID_OFFSET = 600  # INSANE.md quest N → app ID (600 + N)

# Act mapping: INSANE.md quest number range → act id
# Acts 29-38 will be added to acts.ts separately
def get_act(n: int) -> int:
    if n <= 100: return 29    # Arch & Terminal
    if n <= 200: return 30    # Mac & Apple
    if n <= 300: return 31    # FEL Extended
    if n <= 400: return 32    # Creative Production
    if n <= 500: return 33    # Gaming & Gear
    if n <= 600: return 34    # Next.js Extended
    if n <= 650: return 35    # SDR & Electronics
    if n <= 700: return 36    # Music & Kanye
    if n <= 800: return 37    # Identity & Wellness
    return 38                 # Hardware & Meta

def get_difficulty(n: int, title: str, desc: str) -> int:
    txt = (title + " " + desc).lower()
    if any(w in txt for w in ["master", "final", "kompletní", "finální", "vlastní", "advanced"]):
        return 4
    if any(w in txt for w in ["experimental", "deep", "complex", "přepiš", "navrhni", "implementuj"]):
        return 3
    if any(w in txt for w in ["nastav", "zkus", "zjisti", "test", "check"]):
        return 2
    return 2

def get_xp(diff: int) -> int:
    return {1: 10, 2: 25, 3: 50, 4: 100, 5: 200}[diff]

def get_tags(n: int, title: str, desc: str) -> list:
    txt = (title + " " + desc).lower()
    tags = []
    if n <= 100: tags.append("#arch")
    if 101 <= n <= 200: tags.append("#mac")
    if 201 <= n <= 300: tags.append("#škola")
    if 301 <= n <= 400: tags.append("#music")
    if 401 <= n <= 500: tags.append("#gaming")
    if 501 <= n <= 600: tags.append("#nextjs")
    if 601 <= n <= 650: tags.append("#sdr")
    if 651 <= n <= 700: tags.append("#music")
    if 701 <= n <= 800: tags.append("#wellbeing")
    if 801 <= n <= 1000: tags.append("#meta")

    if any(w in txt for w in ["linux", "arch", "pacman", "sway", "waybar", "terminal"]): tags.append("#linux")
    if any(w in txt for w in ["mac", "brew", "raycast", "m5", "apple"]): tags.append("#mac")
    if any(w in txt for w in ["adhd"]): tags.append("#adhd")
    if any(w in txt for w in ["bpd", "disociace", "systém", "alter"]): tags.append("#bpd")
    if any(w in txt for w in ["kanye", "ye ", "music", "fl studio", "sample", "beat", "mix"]): tags.append("#music")
    if any(w in txt for w in ["git", "github"]): tags.append("#git")
    if any(w in txt for w in ["script", "skript", "bash", "python", "automation"]): tags.append("#automation")
    if any(w in txt for w in ["steam", "gaming", "hra", "deck"]): tags.append("#gaming")
    if any(w in txt for w in ["sdr", "rádio", "antenna", "signal"]): tags.append("#sdr")
    if any(w in txt for w in ["wellness", "zdraví", "sleep", "spánek", "voda", "pohyb"]): tags.append("#wellbeing")
    # deduplicate while preserving order
    seen = set()
    result = []
    for t in tags:
        if t not in seen:
            seen.add(t)
            result.append(t)
    return result[:3]  # max 3 tags

def get_skills(n: int, title: str, desc: str) -> list:
    txt = (title + " " + desc).lower()
    skills = []
    if any(w in txt for w in ["arch", "linux", "pacman", "systemd", "kernel"]): skills.append("linux")
    if any(w in txt for w in ["sway", "waybar", "wofi", "swaylock", "mako"]): skills.append("sway-wm")
    if any(w in txt for w in ["terminal", "bash", "zsh", "kitty", "alacritty", "tmux"]): skills.append("terminal")
    if any(w in txt for w in ["neovim", "vim", "lua"]): skills.append("neovim")
    if any(w in txt for w in ["dotfiles", "stow", "config"]): skills.append("dotfiles")
    if any(w in txt for w in ["git", "github", "gitlab", "commit", "branch"]): skills.append("git")
    if any(w in txt for w in ["mac", "brew", "homebrew", "raycast", "m5", "apple"]): skills.append("macos")
    if any(w in txt for w in ["react", "next", "typescript", "tailwind", "framer", "zustand"]): skills.append("react")
    if any(w in txt for w in ["next.js", "nextjs", "server action", "app router"]): skills.append("nextjs")
    if any(w in txt for w in ["typescript", "ts ", "types", "zod"]): skills.append("typescript")
    if any(w in txt for w in ["fl studio", "daw", "sample", "beat", "mix", "kanye", "vst", "serum", "midi"]): skills.append("music-production")
    if any(w in txt for w in ["python", "script", "automation"]): skills.append("python")
    if any(w in txt for w in ["c++", "java", "algorithm", "shader", "opengl"]): skills.append("cpp")
    if any(w in txt for w in ["sdr", "rádio", "antenna", "signal", "rtl", "gnu radio"]): skills.append("hardware")
    if any(w in txt for w in ["arduino", "esp32", "pcb", "soldering", "circuit", "elektronik"]): skills.append("hardware")
    if any(w in txt for w in ["mental", "adhd", "bpd", "wellness", "terapie", "therapy"]): skills.append("mental-health")
    if any(w in txt for w in ["garmin", "fenix", "steam deck", "sony xm", "samsung g9", "mx master"]): skills.append("hardware")
    if not skills:
        # fallback based on act
        if n <= 100: skills = ["linux", "terminal"]
        elif n <= 200: skills = ["macos"]
        elif n <= 300: skills = ["git"]
        elif n <= 400: skills = ["music-production"]
        elif n <= 500: skills = ["gaming"]
        elif n <= 600: skills = ["react", "nextjs"]
        elif n <= 650: skills = ["hardware"]
        elif n <= 700: skills = ["music-production"]
        elif n <= 800: skills = ["mental-health"]
        else: skills = ["focus"]
    # deduplicate
    seen = set(); result = []
    for s in skills:
        if s not in seen:
            seen.add(s); result.append(s)
    return result[:3]

def get_time(n: int, title: str, desc: str) -> str:
    txt = (title + " " + desc).lower()
    if any(w in txt for w in ["každý den", "ongoing", "streaks", "denně", "daily"]): return "ongoing"
    if any(w in txt for w in ["rok", "year", "měsíc"]): return "30+ dní"
    if any(w in txt for w in ["týden", "week", "7 dní"]): return "1 týden"
    if any(w in txt for w in ["hodinu", "hodiny", "hours", "2h", "3h", "4h"]): return "2h"
    if any(w in txt for w in ["minutách", "minutes", "30min", "15 min", "5 min"]): return "30min"
    return "1h"

def get_checkpoints(title: str, desc: str, n: int) -> list:
    # Generate 3 checkpoints based on content
    cp = []
    # First checkpoint: start/setup
    if any(w in desc.lower() for w in ["nastav", "install", "stáhni", "vytvoř", "setup"]):
        cp.append(f"{title[:30].strip()} — setup")
    else:
        cp.append(f"{title[:30].strip()} — start")
    # Middle checkpoint: main action
    words = desc.split()[:8]
    mid = " ".join(words)[:40].strip()
    cp.append(f"{mid}")
    # Final checkpoint: done
    cp.append(f"{title[:25].strip()} — hotovo ✓")
    return cp

def escape_ts(s: str) -> str:
    s = s.replace("\\", "\\\\")
    s = s.replace('"', '\\"')
    s = s.replace("`", "'")
    return s.strip()

def generate_quickstart(title: str, desc: str) -> str:
    # Take first meaningful part of desc
    parts = desc.split(".")
    first = parts[0].strip()
    if len(first) > 80:
        first = first[:77] + "..."
    return first

# Parse INSANE.md
with open(INSANE_MD, "r", encoding="utf-8") as f:
    content = f.read()

# Match pattern: number. **Title:** description
pattern = r"^(\d+)\.\s+\*\*([^*]+)\*\*[:\s—–]+(.+)$"
quests = []
for line in content.splitlines():
    m = re.match(pattern, line.strip())
    if m:
        n = int(m.group(1))
        title = m.group(2).strip()
        desc = m.group(3).strip()
        quests.append((n, title, desc))

print(f"Parsed {len(quests)} quests from INSANE.md", file=sys.stderr)

# Generate TypeScript
lines = []
for n, title, desc in quests:
    app_id = ID_OFFSET + n
    act = get_act(n)
    diff = get_difficulty(n, title, desc)
    xp = get_xp(diff)
    tags = get_tags(n, title, desc)
    skills = get_skills(n, title, desc)
    time_est = get_time(n, title, desc)
    checkpoints = get_checkpoints(title, desc, n)
    quickstart = generate_quickstart(title, desc)

    tags_ts = ", ".join(f'"{t}"' for t in tags)
    skills_ts = ", ".join(f'"{s}"' for s in skills)
    cp_ts = ", ".join(f'"{escape_ts(c)}"' for c in checkpoints)
    title_esc = escape_ts(title)
    desc_esc = escape_ts(desc)
    qs_esc = escape_ts(quickstart)

    lines.append(f"""  {{
    id: {app_id},
    title: "{title_esc}",
    description: "{desc_esc}",
    quickStart: "{qs_esc}",
    timeEstimate: "{time_est}",
    difficulty: {diff},
    xp: {xp},
    prerequisites: [],
    tags: [{tags_ts}],
    skills: [{skills_ts}],
    act: {act},
    checkpoints: [{cp_ts}],
  }},""")

with open(OUTPUT_TS, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Written {len(quests)} quests to {OUTPUT_TS}", file=sys.stderr)
print(f"ID range: {ID_OFFSET+1} - {ID_OFFSET+quests[-1][0]}", file=sys.stderr)
