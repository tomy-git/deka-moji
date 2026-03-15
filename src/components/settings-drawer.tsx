import displayIcon from "bootstrap-icons/icons/display.svg";
import moonIcon from "bootstrap-icons/icons/moon-stars.svg";
import sunIcon from "bootstrap-icons/icons/sun.svg";
import type { RefObject } from "preact";
import { useEffect, useRef } from "preact/hooks";
import type { FontPreset, ThemeChoice } from "../types";
import { UI_MESSAGES } from "../ui-messages";

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

const fontOptions: Array<{ value: FontPreset; label: string }> = [
  { value: "gothic", label: UI_MESSAGES.fontGothic.text },
  { value: "mincho", label: UI_MESSAGES.fontMincho.text },
  { value: "mono", label: UI_MESSAGES.fontMono.text },
  { value: "ud", label: UI_MESSAGES.fontUd.text }
];

export function showSettingsDrawer(drawer: DrawerElement | null): void {
  void drawer?.show();
}

function detectRuntimeSystemTheme(): Exclude<ThemeChoice, "system"> {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function SettingsDrawer(props: Props) {
  const fontSelectRef = useRef<HTMLElement>(null);
  const colorPickerRef = useRef<HTMLElement>(null);
  const systemSwitchRef = useRef<(HTMLElement & { checked: boolean }) | null>(null);
  const isSystemTheme = props.themeChoice === "system";
  const manualTheme = props.themeChoice === "dark" ? "dark" : "light";

  useEffect(() => {
    const fontSelect = fontSelectRef.current;
    if (!fontSelect) {
      return;
    }

    const handleChange = (event: Event) => {
      const target = event.target as HTMLSelectElement & { value: FontPreset };
      props.onFontChange(target.value);
    };

    fontSelect.addEventListener("sl-change", handleChange);
    return () => fontSelect.removeEventListener("sl-change", handleChange);
  }, [props]);

  useEffect(() => {
    const colorPicker = colorPickerRef.current;
    if (!colorPicker) {
      return;
    }

    const handleChange = (event: Event) => {
      const target = event.target as HTMLInputElement & { value: string };
      props.onTextColorChange(target.value);
    };

    colorPicker.addEventListener("sl-change", handleChange);
    return () => colorPicker.removeEventListener("sl-change", handleChange);
  }, [props]);

  useEffect(() => {
    const systemSwitch = systemSwitchRef.current;
    if (!systemSwitch) {
      return;
    }

    const handleChange = (event: Event) => {
      const nextChecked = systemSwitch.checked;
      props.onThemeChange(nextChecked ? "system" : detectRuntimeSystemTheme());
    };

    systemSwitch.addEventListener("sl-change", handleChange);
    return () => systemSwitch.removeEventListener("sl-change", handleChange);
  }, [manualTheme, props]);

  return (
    <sl-drawer
      ref={props.drawerRef}
      class="settings-drawer"
      label={UI_MESSAGES.openSettings.text}
      placement="end"
    >
      <div class="drawer-section">
        <p class="eyebrow">{UI_MESSAGES.themeSectionEyebrow.text}</p>
        <h2>{UI_MESSAGES.themeSectionTitle.text}</h2>
        <div class="theme-toggle-row">
          <div class="theme-system-control">
            <sl-tooltip content={UI_MESSAGES.themeSystem.text}>
              <sl-icon-button label={UI_MESSAGES.themeSystem.text} src={displayIcon} />
            </sl-tooltip>
            <sl-switch
              ref={systemSwitchRef}
              checked={isSystemTheme}
              size="medium"
            />
          </div>

          {!isSystemTheme ? (
            <div class="manual-theme-switches">
              <sl-tooltip content={UI_MESSAGES.themeLight.text}>
                <sl-icon-button
                  label={UI_MESSAGES.themeLight.text}
                  src={sunIcon}
                  class={manualTheme === "light" ? "theme-mode-button is-selected" : "theme-mode-button"}
                  onClick={() => {
                    props.onThemeChange("light");
                  }}
                />
              </sl-tooltip>
              <sl-tooltip content={UI_MESSAGES.themeDark.text}>
                <sl-icon-button
                  label={UI_MESSAGES.themeDark.text}
                  src={moonIcon}
                  class={manualTheme === "dark" ? "theme-mode-button is-selected" : "theme-mode-button"}
                  onClick={() => {
                    props.onThemeChange("dark");
                  }}
                />
              </sl-tooltip>
            </div>
          ) : null}
        </div>
      </div>

      <sl-divider />

      <div class="drawer-section">
        <label class="field">
          <span>{UI_MESSAGES.fontLabel.text}</span>
          <sl-select ref={fontSelectRef} value={props.fontPreset} hoist>
            {fontOptions.map((option) => (
              <sl-option key={option.value} value={option.value}>
                {option.label}
              </sl-option>
            ))}
          </sl-select>
        </label>

        <label class="field">
          <span>{UI_MESSAGES.textColorLabel.text}</span>
          <sl-color-picker
            ref={colorPickerRef}
            value={props.textColor}
            format="hex"
            hoist
          />
        </label>
      </div>

    </sl-drawer>
  );
}
