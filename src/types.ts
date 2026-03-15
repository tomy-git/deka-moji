export type ThemeChoice = "system" | "light" | "dark";
export type ActiveTheme = "light" | "dark";
export type FontPreset = "gothic" | "mincho" | "mono" | "ud";

export type HistoryEntry = {
  id: string;
  text: string;
  textColor: string;
  themeChoice: ThemeChoice;
  fontPreset: FontPreset;
  savedAt: string;
};

export type Preferences = {
  text: string;
  textColor: string;
  themeChoice: ThemeChoice;
  fontPreset: FontPreset;
};

