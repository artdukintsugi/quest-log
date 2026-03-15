"use client";

// Cloud sync via GitHub Gist — zero backend, works with existing GitHub account
// User needs: a GitHub PAT with `gist` scope

const GIST_STORAGE_KEY = "evelyn-gist-config";
const QUEST_STORAGE_KEY = "evelyn-quest-log";
const GIST_FILENAME = "quest-log-state.json";

export interface GistConfig {
  token: string;
  gistId: string | null; // null = needs to be created
  lastSync: string | null;
}

export function getGistConfig(): GistConfig | null {
  try {
    const raw = localStorage.getItem(GIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveGistConfig(config: GistConfig) {
  localStorage.setItem(GIST_STORAGE_KEY, JSON.stringify(config));
}

export function clearGistConfig() {
  localStorage.removeItem(GIST_STORAGE_KEY);
}

async function apiRequest(method: string, url: string, token: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  return res.json();
}

/** Push current localStorage state to Gist. Creates gist if none exists. */
export async function pushToGist(): Promise<string> {
  const config = getGistConfig();
  if (!config?.token) throw new Error("No GitHub token configured");

  const stateRaw = localStorage.getItem(QUEST_STORAGE_KEY) ?? "{}";

  if (!config.gistId) {
    // Create new private gist
    const data = await apiRequest("POST", "https://api.github.com/gists", config.token, {
      description: "Quest Log — Evelyn's save state",
      public: false,
      files: { [GIST_FILENAME]: { content: stateRaw } },
    });
    const updated: GistConfig = { ...config, gistId: data.id, lastSync: new Date().toISOString() };
    saveGistConfig(updated);
    return data.id;
  } else {
    await apiRequest("PATCH", `https://api.github.com/gists/${config.gistId}`, config.token, {
      files: { [GIST_FILENAME]: { content: stateRaw } },
    });
    saveGistConfig({ ...config, lastSync: new Date().toISOString() });
    return config.gistId;
  }
}

/** Pull state from Gist and merge into localStorage (Gist wins). */
export async function pullFromGist(): Promise<void> {
  const config = getGistConfig();
  if (!config?.token || !config.gistId) throw new Error("No Gist configured");

  const data = await apiRequest("GET", `https://api.github.com/gists/${config.gistId}`, config.token);
  const content = data.files?.[GIST_FILENAME]?.content;
  if (!content) throw new Error("No quest-log state found in Gist");

  // Validate JSON
  JSON.parse(content);
  localStorage.setItem(QUEST_STORAGE_KEY, content);
  saveGistConfig({ ...config, lastSync: new Date().toISOString() });
}

/**
 * Pull from Gist, but only apply + return true if the content is actually
 * different from what's already in localStorage. Safe to call on focus.
 */
export async function pullFromGistIfChanged(): Promise<boolean> {
  const config = getGistConfig();
  if (!config?.token || !config.gistId) return false;

  const data = await apiRequest("GET", `https://api.github.com/gists/${config.gistId}`, config.token);
  const content = data.files?.[GIST_FILENAME]?.content;
  if (!content) return false;

  const current = localStorage.getItem(QUEST_STORAGE_KEY);
  if (content === current) {
    // No change — still update lastSync timestamp
    saveGistConfig({ ...config, lastSync: new Date().toISOString() });
    return false;
  }

  JSON.parse(content); // validate
  localStorage.setItem(QUEST_STORAGE_KEY, content);
  saveGistConfig({ ...config, lastSync: new Date().toISOString() });
  return true;
}

/** Validate a token by fetching /user */
export async function validateToken(token: string): Promise<string> {
  const data = await apiRequest("GET", "https://api.github.com/user", token);
  return data.login as string;
}
