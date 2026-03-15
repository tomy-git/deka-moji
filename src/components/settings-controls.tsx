import displayIcon from "bootstrap-icons/icons/display.svg";
import moonIcon from "bootstrap-icons/icons/moon-stars.svg";
import sunIcon from "bootstrap-icons/icons/sun.svg";
import { useEffect, useRef } from "preact/hooks";
import type { FontPreset, ThemeChoice } from "../types";
import { UI_MESSAGES } from "../ui-messages";

type Props = {
  textColor: string;
  themeChoice: ThemeChoice;
  fontPreset: FontPreset;
  fontClassName: string;
  onThemeChange: (value: ThemeChoice) => void;
  onFontChange: (value: FontPreset) => void;
  onTextColorChange: (value: string) => void;
};

const fontOptions: Array<{ value: FontPreset; label: string }> = [
  { value: "gothic", label: UI_MESSAGES.fontGothic.text },
  { value: "mincho", label: UI_MESSAGES.fontMincho.text },
  { value: "mono", label: UI_MESSAGES.fontMono.text },
  { value: "ud", label: UI_MESSAGES.fontUd.text }
];

function detectRuntimeSystemTheme(): Exclude<ThemeChoice, "system"> {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function SettingsControls(props: Props) {
  const themeSwitchRef = useRef<(HTMLElement & { checked: boolean }) | null>(null);
  const fontSelectRef = useRef<HTMLElement>(null);
  const colorPickerRef = useRef<HTMLElement>(null);
  const isSystemTheme = props.themeChoice === "system";
  const manualTheme = props.themeChoice === "dark" ? "dark" : "light";

  useEffect(() => {
    const themeSwitch = themeSwitchRef.current;
    if (!themeSwitch) {
      return;
    }

    const handleChange = () => {
      props.onThemeChange(
        themeSwitch.checked ? "system" : detectRuntimeSystemTheme()
      );
    };

    themeSwitch.addEventListener("sl-change", handleChange);
    return () => themeSwitch.removeEventListener("sl-change", handleChange);
  }, [props]);

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

  return (
    <div class="settings-controls">
      <div class="settings-group">
        <span class="settings-label">{UI_MESSAGES.themeSectionTitle.text}</span>
        <div class="theme-toggle-row">
          <div class="theme-system-control">
            <sl-tooltip content={UI_MESSAGES.themeSystem.text}>
              <sl-icon-button label={UI_MESSAGES.themeSystem.text} src={displayIcon} />
            </sl-tooltip>
            <sl-switch
              ref={themeSwitchRef}
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

      <label class="field settings-select-field">
        <span class="settings-label">{UI_MESSAGES.fontLabel.text}</span>
        <sl-select
          class={`settings-font-select ${props.fontClassName}`}
          ref={fontSelectRef}
          value={props.fontPreset}
          hoist
        >
          {fontOptions.map((option) => (
            <sl-option key={option.value} value={option.value}>
              {option.label}
            </sl-option>
          ))}
        </sl-select>
      </label>

      <label class="field settings-color-field">
        <span class="settings-label">{UI_MESSAGES.textColorLabel.text}</span>
        <sl-color-picker
          ref={colorPickerRef}
          value={props.textColor}
          format="hex"
          hoist
        />
      </label>
    </div>
  );
}
