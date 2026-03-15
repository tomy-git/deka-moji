import { beforeEach, describe, expect, it } from "vitest";
import {
  loadHistory,
  loadPreferences,
  removeHistoryEntry,
  saveHistory,
  savePreferences,
  upsertHistoryEntry
} from "./storage";

describe("storage helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("設定を保存して復元できる", () => {
    savePreferences({
      text: "漢",
      textColor: "#111111",
      themeChoice: "dark",
      fontPreset: "gothic"
    });

    expect(loadPreferences()).toEqual({
      text: "漢",
      textColor: "#111111",
      themeChoice: "dark",
      fontPreset: "gothic"
    });
  });

  it("履歴は新しいものを先頭に追加する", () => {
    const next = upsertHistoryEntry([], {
      id: "1",
      text: "漢",
      textColor: "#111111",
      themeChoice: "light",
      fontPreset: "gothic",
      savedAt: new Date().toISOString()
    });

    saveHistory(next);
    expect(loadHistory()).toHaveLength(1);
    expect(removeHistoryEntry(loadHistory(), "1")).toEqual([]);
  });

  it("同じ文字でも設定が異なれば別履歴として残す", () => {
    const first = upsertHistoryEntry([], {
      id: "1",
      text: "漢",
      textColor: "#111111",
      themeChoice: "light",
      fontPreset: "gothic",
      savedAt: new Date().toISOString()
    });

    const second = upsertHistoryEntry(first, {
      id: "2",
      text: "漢",
      textColor: "#ff0000",
      themeChoice: "dark",
      fontPreset: "mincho",
      savedAt: new Date().toISOString()
    });

    expect(second).toHaveLength(2);
  });
});
