export interface SkillDomain {
  id: string;
  name: string;
  category: SkillCategory;
  apps: string[];
  color: string;
  emoji: string;
}

export type SkillCategory =
  | "System & Environment"
  | "Programming"
  | "AI & Automation"
  | "Audio & Music"
  | "Creative"
  | "Game Dev"
  | "Knowledge & School"
  | "Hardware"
  | "Wellbeing & Life"
  | "Social & Output";

export const SKILL_DOMAINS: SkillDomain[] = [
  // ── System & Environment ──────────────────────────────────────────────────
  {
    id: "linux",
    name: "Linux",
    category: "System & Environment",
    apps: ["Arch Linux", "pacman", "systemd", "journalctl", "udev"],
    color: "#f97316",
    emoji: "🐧",
  },
  {
    id: "macos",
    name: "macOS",
    category: "System & Environment",
    apps: ["Homebrew", "Raycast", "Karabiner", "SketchyBar", "macOS"],
    color: "#60a5fa",
    emoji: "🍎",
  },
  {
    id: "sway-wm",
    name: "Sway / WM",
    category: "System & Environment",
    apps: ["Sway", "Waybar", "wofi", "Mako", "wl-clipboard", "swaylock"],
    color: "#34d399",
    emoji: "🪟",
  },
  {
    id: "terminal",
    name: "Terminal",
    category: "System & Environment",
    apps: ["Kitty", "Bash", "Zsh", "tmux", "Neovim"],
    color: "#a3e635",
    emoji: "⌨️",
  },
  {
    id: "dotfiles",
    name: "Dotfiles",
    category: "System & Environment",
    apps: ["GNU Stow", "chezmoi", "Git", "symlinks"],
    color: "#c084fc",
    emoji: "📂",
  },
  {
    id: "networking",
    name: "Networking",
    category: "System & Environment",
    apps: ["Tailscale", "WireGuard", "nginx", "nmap", "SSH"],
    color: "#38bdf8",
    emoji: "🌐",
  },
  {
    id: "homelab",
    name: "Homelab",
    category: "System & Environment",
    apps: ["Proxmox", "Docker", "Nextcloud", "Home Assistant", "Portainer"],
    color: "#fb923c",
    emoji: "🏠",
  },
  {
    id: "security",
    name: "Security",
    category: "System & Environment",
    apps: ["GPG", "pass", "Bitwarden", "YubiKey", "SSH keys"],
    color: "#f43f5e",
    emoji: "🔐",
  },

  // ── Programming ───────────────────────────────────────────────────────────
  {
    id: "git",
    name: "Git",
    category: "Programming",
    apps: ["Git", "GitHub", "lazygit", "GitLab"],
    color: "#fb923c",
    emoji: "🌿",
  },
  {
    id: "c-cpp",
    name: "C / C++",
    category: "Programming",
    apps: ["GCC", "Clang", "CMake", "GDB", "Valgrind", "Make"],
    color: "#60a5fa",
    emoji: "⚙️",
  },
  {
    id: "rust",
    name: "Rust",
    category: "Programming",
    apps: ["Cargo", "rustc", "rustup", "crates.io"],
    color: "#f97316",
    emoji: "🦀",
  },
  {
    id: "python",
    name: "Python",
    category: "Programming",
    apps: ["pip", "Poetry", "Jupyter", "pandas", "numpy", "venv"],
    color: "#facc15",
    emoji: "🐍",
  },
  {
    id: "java",
    name: "Java",
    category: "Programming",
    apps: ["JVM", "Maven", "Gradle", "IntelliJ IDEA"],
    color: "#f97316",
    emoji: "☕",
  },
  {
    id: "web-frontend",
    name: "Web Frontend",
    category: "Programming",
    apps: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite"],
    color: "#38bdf8",
    emoji: "🌐",
  },
  {
    id: "web-backend",
    name: "Web Backend",
    category: "Programming",
    apps: ["Node.js", "Express", "FastAPI", "PostgreSQL", "REST API"],
    color: "#34d399",
    emoji: "🖥️",
  },
  {
    id: "shaders",
    name: "Shaders / GLSL",
    category: "Programming",
    apps: ["GLSL", "HLSL", "OpenGL", "Shadertoy", "WebGL"],
    color: "#e879f9",
    emoji: "✨",
  },
  {
    id: "scripting",
    name: "Scripting",
    category: "Programming",
    apps: ["Bash", "zsh", "Python scripts", "Makefile", "cron"],
    color: "#a3e635",
    emoji: "📜",
  },

  // ── AI & Automation ───────────────────────────────────────────────────────
  {
    id: "ai-tools",
    name: "AI Tools",
    category: "AI & Automation",
    apps: ["Claude", "ChatGPT", "Cursor", "GitHub Copilot", "Perplexity"],
    color: "#a78bfa",
    emoji: "🤖",
  },
  {
    id: "ai-ml",
    name: "AI / ML",
    category: "AI & Automation",
    apps: ["PyTorch", "scikit-learn", "Hugging Face", "Jupyter", "CUDA"],
    color: "#818cf8",
    emoji: "🧠",
  },
  {
    id: "llm-dev",
    name: "LLM Dev",
    category: "AI & Automation",
    apps: ["LangChain", "Ollama", "OpenAI API", "Anthropic API", "RAG"],
    color: "#c084fc",
    emoji: "💬",
  },
  {
    id: "automation",
    name: "Automation",
    category: "AI & Automation",
    apps: ["Hazel", "cron", "systemd timers", "n8n", "Zapier"],
    color: "#34d399",
    emoji: "⚡",
  },
  {
    id: "workflow",
    name: "Workflow",
    category: "AI & Automation",
    apps: ["Raycast", "Alfred", "Apple Shortcuts", "Make", "Automator"],
    color: "#60a5fa",
    emoji: "🔄",
  },

  // ── Audio & Music ─────────────────────────────────────────────────────────
  {
    id: "music-production",
    name: "Music Production",
    category: "Audio & Music",
    apps: ["Ableton Live", "FL Studio", "Logic Pro", "REAPER"],
    color: "#f472b6",
    emoji: "🎹",
  },
  {
    id: "music-theory",
    name: "Music Theory",
    category: "Audio & Music",
    apps: ["MuseScore", "teoria.com", "ear training apps"],
    color: "#fb923c",
    emoji: "🎼",
  },
  {
    id: "sound-design",
    name: "Sound Design",
    category: "Audio & Music",
    apps: ["Vital", "Serum", "MASSIVE", "PatchWork", "VCV Rack"],
    color: "#e879f9",
    emoji: "🔊",
  },
  {
    id: "music-performance",
    name: "Performance",
    category: "Audio & Music",
    apps: ["MIDI controllers", "guitar", "piano", "Ableton Push"],
    color: "#facc15",
    emoji: "🎸",
  },
  {
    id: "mixing-mastering",
    name: "Mixing & Mastering",
    category: "Audio & Music",
    apps: ["iZotope Ozone", "FabFilter", "EQ plugins", "compression"],
    color: "#38bdf8",
    emoji: "🎚️",
  },

  // ── Creative ──────────────────────────────────────────────────────────────
  {
    id: "3d-modeling",
    name: "3D Modeling",
    category: "Creative",
    apps: ["Blender", "ZBrush", "Cinema 4D"],
    color: "#f97316",
    emoji: "🧊",
  },
  {
    id: "visual-art",
    name: "Visual Art",
    category: "Creative",
    apps: ["Procreate", "Krita", "Photoshop", "Illustrator"],
    color: "#f472b6",
    emoji: "🎨",
  },
  {
    id: "ui-design",
    name: "UI Design",
    category: "Creative",
    apps: ["Figma", "Sketch", "Adobe XD"],
    color: "#60a5fa",
    emoji: "🖌️",
  },
  {
    id: "video-editing",
    name: "Video Editing",
    category: "Creative",
    apps: ["DaVinci Resolve", "Premiere Pro", "Final Cut Pro"],
    color: "#a3e635",
    emoji: "🎬",
  },
  {
    id: "writing",
    name: "Writing",
    category: "Creative",
    apps: ["Obsidian", "iA Writer", "Markdown", "Ulysses"],
    color: "#e2e8f0",
    emoji: "✍️",
  },
  {
    id: "photography",
    name: "Photography",
    category: "Creative",
    apps: ["Lightroom", "Darktable", "RawTherapee", "Photoshop"],
    color: "#facc15",
    emoji: "📷",
  },

  // ── Game Dev ──────────────────────────────────────────────────────────────
  {
    id: "gamedev-code",
    name: "Game Dev",
    category: "Game Dev",
    apps: ["Unity", "Godot", "Unreal Engine", "LÖVE"],
    color: "#34d399",
    emoji: "🎮",
  },
  {
    id: "game-design",
    name: "Game Design",
    category: "Game Dev",
    apps: ["Twine", "ink", "Figma", "paper prototyping"],
    color: "#f472b6",
    emoji: "🎲",
  },
  {
    id: "computer-graphics",
    name: "Computer Graphics",
    category: "Game Dev",
    apps: ["OpenGL", "Vulkan", "WebGL", "Three.js", "DirectX"],
    color: "#a78bfa",
    emoji: "🖼️",
  },

  // ── Knowledge & School ────────────────────────────────────────────────────
  {
    id: "obsidian-pkm",
    name: "Obsidian / PKM",
    category: "Knowledge & School",
    apps: ["Obsidian", "Logseq", "Zotero", "Notion"],
    color: "#c084fc",
    emoji: "🔮",
  },
  {
    id: "learning-systems",
    name: "Learning Systems",
    category: "Knowledge & School",
    apps: ["Anki", "SuperMemo", "Readwise", "spaced repetition"],
    color: "#34d399",
    emoji: "📚",
  },
  {
    id: "school-fel",
    name: "FEL / ČVUT",
    category: "Knowledge & School",
    apps: ["ČVUT IS", "Moodle", "LaTeX", "MATLAB"],
    color: "#facc15",
    emoji: "🎓",
  },
  {
    id: "math",
    name: "Math",
    category: "Knowledge & School",
    apps: ["Wolfram Alpha", "Desmos", "MATLAB", "numpy", "scipy"],
    color: "#60a5fa",
    emoji: "📐",
  },
  {
    id: "research",
    name: "Research",
    category: "Knowledge & School",
    apps: ["Zotero", "Google Scholar", "Obsidian", "Papers"],
    color: "#94a3b8",
    emoji: "🔬",
  },

  // ── Hardware ──────────────────────────────────────────────────────────────
  {
    id: "hardware",
    name: "Hardware",
    category: "Hardware",
    apps: ["PC components", "soldering", "3D printing"],
    color: "#fb923c",
    emoji: "🔧",
  },
  {
    id: "peripherals",
    name: "Peripherals",
    category: "Hardware",
    apps: ["QMK", "ZMK", "Via", "keyboards", "mice", "monitors"],
    color: "#38bdf8",
    emoji: "⌨️",
  },
  {
    id: "steam-deck",
    name: "Steam Deck",
    category: "Hardware",
    apps: ["Steam", "Decky Loader", "EmuDeck", "Proton", "SteamOS"],
    color: "#60a5fa",
    emoji: "🕹️",
  },
  {
    id: "ipad",
    name: "iPad",
    category: "Hardware",
    apps: ["iPadOS", "Apple Pencil", "GoodNotes", "Procreate", "Sidecar"],
    color: "#94a3b8",
    emoji: "📱",
  },

  // ── Wellbeing & Life ──────────────────────────────────────────────────────
  {
    id: "adhd-management",
    name: "ADHD Management",
    category: "Wellbeing & Life",
    apps: ["Notion", "Toggl", "Structured", "Obsidian", "reminders"],
    color: "#f472b6",
    emoji: "🧩",
  },
  {
    id: "mental-health",
    name: "Mental Health",
    category: "Wellbeing & Life",
    apps: ["journaling apps", "therapy tools", "mood tracking"],
    color: "#a78bfa",
    emoji: "💜",
  },
  {
    id: "physical-health",
    name: "Physical Health",
    category: "Wellbeing & Life",
    apps: ["workout apps", "nutrition tracking", "Apple Health"],
    color: "#34d399",
    emoji: "💪",
  },
  {
    id: "routine-habits",
    name: "Routine & Habits",
    category: "Wellbeing & Life",
    apps: ["Structured", "Habitica", "streaks", "Apple Shortcuts"],
    color: "#facc15",
    emoji: "📅",
  },
  {
    id: "finance",
    name: "Finance",
    category: "Wellbeing & Life",
    apps: ["YNAB", "budgeting spreadsheets", "Notion", "banking apps"],
    color: "#4ade80",
    emoji: "💰",
  },

  // ── Social & Output ───────────────────────────────────────────────────────
  {
    id: "community",
    name: "Community",
    category: "Social & Output",
    apps: ["Discord", "Reddit", "GitHub", "Twitter/X"],
    color: "#818cf8",
    emoji: "🌍",
  },
  {
    id: "content-creation",
    name: "Content Creation",
    category: "Social & Output",
    apps: ["YouTube", "Twitch", "blog", "newsletter", "OBS"],
    color: "#f472b6",
    emoji: "📹",
  },
  {
    id: "relationships",
    name: "Relationships",
    category: "Social & Output",
    apps: ["journaling", "letters", "quality time"],
    color: "#f43f5e",
    emoji: "❤️",
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  "System & Environment",
  "Programming",
  "AI & Automation",
  "Audio & Music",
  "Creative",
  "Game Dev",
  "Knowledge & School",
  "Hardware",
  "Wellbeing & Life",
  "Social & Output",
];

export function getSkillById(id: string): SkillDomain | undefined {
  return SKILL_DOMAINS.find((s) => s.id === id);
}

export function getSkillsByCategory(category: SkillCategory): SkillDomain[] {
  return SKILL_DOMAINS.filter((s) => s.category === category);
}
