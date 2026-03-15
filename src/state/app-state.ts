import { computed, signal } from "@preact/signals";
import { createLengthWarning, sanitizeText } from "../lib/text";
import type { ActiveTheme, FontPreset, HistoryEntry, ThemeChoice } from "../types";

export const text = signal("漢");
export const textColor = signal("#101828");
export const themeChoice = signal<ThemeChoice>("system");
export const systemTheme = signal<ActiveTheme>("light");
export const fontPreset = signal<FontPreset>("gothic");
export const historyEntries = signal<HistoryEntry[]>([]);
export const currentScreen = signal<"compose" | "display">("compose");

export const activeTheme = computed<ActiveTheme>(() => {
  if (themeChoice.value === "system") {
    return systemTheme.value;
  }

  return themeChoice.value;
});

export const lengthWarning = computed(() => createLengthWarning(text.value));

export function updateText(rawText: string): void {
  text.value = sanitizeText(rawText);
}

export function applyHistoryEntry(entry: HistoryEntry): void {
  text.value = entry.text;
  textColor.value = entry.textColor;
  themeChoice.value = entry.themeChoice;
  fontPreset.value = entry.fontPreset;
  currentScreen.value = "display";
}

