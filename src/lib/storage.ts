import type { HistoryEntry, Preferences } from "../types";

const PREFERENCES_KEY = "deka-moji.preferences.v1";
const HISTORY_KEY = "deka-moji.history.v1";
const MAX_HISTORY = 10;

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadPreferences(): Preferences | null {
  if (!hasStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(PREFERENCES_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Preferences;
  } catch {
    return null;
  }
}

export function savePreferences(preferences: Preferences): void {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

export function loadHistory(): HistoryEntry[] {
  if (!hasStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(HISTORY_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
}

export function upsertHistoryEntry(
  entries: HistoryEntry[],
  nextEntry: HistoryEntry
): HistoryEntry[] {
  const filtered = entries.filter(
    (entry) =>
      !(
        entry.text === nextEntry.text &&
        entry.textColor === nextEntry.textColor &&
        entry.themeChoice === nextEntry.themeChoice &&
        entry.fontPreset === nextEntry.fontPreset
      )
  );
  return [nextEntry, ...filtered].slice(0, MAX_HISTORY);
}

export function removeHistoryEntry(entries: HistoryEntry[], id: string): HistoryEntry[] {
  return entries.filter((entry) => entry.id !== id);
}
