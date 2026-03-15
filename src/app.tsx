import { effect } from "@preact/signals";
import menuIcon from "bootstrap-icons/icons/list.svg";
import { useEffect, useRef, useState } from "preact/hooks";
import { DisplayScreen } from "./components/display-screen";
import { HistoryPanel } from "./components/history-panel";
import {
  SettingsDrawer,
  showSettingsDrawer,
  type DrawerElement
} from "./components/settings-drawer";
import {
  activeTheme,
  applyHistoryEntry,
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
import { UI_MESSAGES } from "./ui-messages";
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
  const drawerRef = useRef<DrawerElement>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

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
      <header class="app-header no-print">
        <div class="app-header-copy">
          <p class="eyebrow">{UI_MESSAGES.appEyebrow.text}</p>
          <h1>{UI_MESSAGES.appTitle.text}</h1>
        </div>
        <sl-icon-button
          label={UI_MESSAGES.openSettings.text}
          src={menuIcon}
          onClick={() => {
            showSettingsDrawer(drawerRef.current);
          }}
        />
      </header>

      <div class={`workspace ${isHistoryOpen ? "with-history" : "without-history"}`}>
        <aside class={`history-sidebar no-print ${isHistoryOpen ? "is-open" : "is-closed"}`}>
          <HistoryPanel
            entries={historyEntries.value}
            onSelect={handleHistorySelect}
            onDelete={handleHistoryDelete}
            onClear={handleHistoryClear}
          />
        </aside>

        <DisplayScreen
          text={text.value}
          textColor={textColor.value}
          activeTheme={activeTheme.value}
          fontPreset={fontPreset.value}
          lengthWarning={lengthWarning.value}
          isSidebarOpen={isHistoryOpen}
          onTextInput={updateText}
          onTextCommit={commitCurrentText}
          onToggleSidebar={() => {
            setIsHistoryOpen((current) => !current);
          }}
          onPrint={handlePrint}
        />
      </div>

      <footer class="app-footer no-print">
        <small>{UI_MESSAGES.appCopyright.text}</small>
      </footer>

      <SettingsDrawer
        drawerRef={drawerRef}
        textColor={textColor.value}
        themeChoice={themeChoice.value}
        fontPreset={fontPreset.value}
        onThemeChange={(value: ThemeChoice) => {
          themeChoice.value = value;
        }}
        onFontChange={(value: FontPreset) => {
          fontPreset.value = value;
        }}
        onTextColorChange={(value: string) => {
          textColor.value = value;
        }}
      />
    </main>
  );
}
