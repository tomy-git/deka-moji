import type { RefObject } from "preact";
import type { FontPreset, ThemeChoice } from "../types";
import { UI_MESSAGES } from "../ui-messages";
import { SettingsControls } from "./settings-controls";
import { fontClassMap } from "../lib/font-class";

type Props = {
  drawerRef: RefObject<DrawerElement>;
  textColor: string;
  themeChoice: ThemeChoice;
  fontPreset: FontPreset;
  onThemeChange: (value: ThemeChoice) => void;
  onFontChange: (value: FontPreset) => void;
  onTextColorChange: (value: string) => void;
};

export type DrawerElement = HTMLElement & {
  show: () => Promise<void>;
  hide: () => Promise<void>;
};

export function showSettingsDrawer(drawer: DrawerElement | null): void {
  void drawer?.show();
}

export function SettingsDrawer(props: Props) {
  return (
    <sl-drawer
      ref={props.drawerRef}
      class="settings-drawer"
      label={UI_MESSAGES.openSettings.text}
      placement="end"
    >
      <div class="drawer-section">
        <SettingsControls
          textColor={props.textColor}
          themeChoice={props.themeChoice}
          fontPreset={props.fontPreset}
          fontClassName={fontClassMap[props.fontPreset]}
          onThemeChange={props.onThemeChange}
          onFontChange={props.onFontChange}
          onTextColorChange={props.onTextColorChange}
        />
      </div>
    </sl-drawer>
  );
}
