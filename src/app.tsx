import { effect } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { ControlPanel } from "./components/control-panel";
import { DisplayScreen } from "./components/display-screen";
import { HistoryPanel } from "./components/history-panel";
import {
  activeTheme,
  applyHistoryEntry,
  currentScreen,
  fontPreset,
  historyEntries,
  lengthWarning,
  systemTheme,
  text,
  textColor,
  themeChoice,
  updateText
} from "./state/app-state";
import {
  loadHistory,
  loadPreferences,
  removeHistoryEntry,
  saveHistory,
  savePreferences,
  upsertHistoryEntry
} from "./lib/storage";
import type { ActiveTheme, FontPreset, HistoryEntry, ThemeChoice } from "./types";

const fontClassMap: Record<FontPreset, string> = {
  gothic: "font-gothic",
  mincho: "font-mincho",
  mono: "font-mono",
  ud: "font-ud"
};

function detectSystemTheme(): ActiveTheme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function App() {
  useEffect(() => {
    systemTheme.value = detectSystemTheme();
    historyEntries.value = loadHistory();

    const preferences = loadPreferences();
    if (preferences) {
      text.value = preferences.text;
      textColor.value = preferences.textColor;
      themeChoice.value = preferences.themeChoice;
      fontPreset.value = preferences.fontPreset;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      systemTheme.value = event.matches ? "dark" : "light";
    };

    mediaQuery.addEventListener("change", handleChange);

    const stopEffect = effect(() => {
      savePreferences({
        text: text.value,
        textColor: textColor.value,
        themeChoice: themeChoice.value,
        fontPreset: fontPreset.value
      });
    });

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      stopEffect();
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = activeTheme.value;
  }, [activeTheme.value]);

  const commitCurrentText = () => {
    if (!text.value) {
      return;
    }

    const nextEntry: HistoryEntry = {
      id: `${Date.now()}`,
      text: text.value,
      textColor: textColor.value,
      themeChoice: themeChoice.value,
      fontPreset: fontPreset.value,
      savedAt: new Date().toISOString()
    };

    historyEntries.value = upsertHistoryEntry(historyEntries.value, nextEntry);
    saveHistory(historyEntries.value);
  };

  const openDisplay = () => {
    commitCurrentText();
    currentScreen.value = "display";
  };

  const handlePrint = () => {
    commitCurrentText();
    window.print();
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    applyHistoryEntry(entry);
    saveHistory(historyEntries.value);
  };

  const handleHistoryDelete = (id: string) => {
    historyEntries.value = removeHistoryEntry(historyEntries.value, id);
    saveHistory(historyEntries.value);
  };

  const handleHistoryClear = () => {
    historyEntries.value = [];
    saveHistory(historyEntries.value);
  };

  return (
    <main
      class={`app-shell theme-${activeTheme.value} ${fontClassMap[fontPreset.value]}`}
    >
      {currentScreen.value === "compose" ? (
        <div class="workspace">
          <ControlPanel
            text={text.value}
            textColor={textColor.value}
            themeChoice={themeChoice.value}
            fontPreset={fontPreset.value}
            lengthWarning={lengthWarning.value}
            onTextInput={updateText}
            onThemeChange={(value: ThemeChoice) => {
              themeChoice.value = value;
            }}
            onFontChange={(value: FontPreset) => {
              fontPreset.value = value;
            }}
            onTextColorChange={(value: string) => {
              textColor.value = value;
            }}
            onOpenDisplay={openDisplay}
            onPrint={handlePrint}
          />
          <div class="workspace-side">
            <DisplayScreen
              text={text.value}
              textColor={textColor.value}
              activeTheme={activeTheme.value}
              fontPreset={fontPreset.value}
              lengthWarning={lengthWarning.value}
              onBack={() => {
                currentScreen.value = "compose";
              }}
              onPrint={handlePrint}
            />
            <HistoryPanel
              entries={historyEntries.value}
              onSelect={handleHistorySelect}
              onDelete={handleHistoryDelete}
              onClear={handleHistoryClear}
            />
          </div>
        </div>
      ) : (
        <DisplayScreen
          text={text.value}
          textColor={textColor.value}
          activeTheme={activeTheme.value}
          fontPreset={fontPreset.value}
          lengthWarning={lengthWarning.value}
          onBack={() => {
            currentScreen.value = "compose";
          }}
          onPrint={handlePrint}
        />
      )}
    </main>
  );
}
