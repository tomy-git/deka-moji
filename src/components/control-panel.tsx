import { useEffect, useRef } from "preact/hooks";
import type { FontPreset, ThemeChoice } from "../types";

type Props = {
  text: string;
  textColor: string;
  themeChoice: ThemeChoice;
  fontPreset: FontPreset;
  lengthWarning: string | null;
  onTextInput: (value: string) => void;
  onThemeChange: (value: ThemeChoice) => void;
  onFontChange: (value: FontPreset) => void;
  onTextColorChange: (value: string) => void;
  onOpenDisplay: () => void;
  onPrint: () => void;
};

const fontOptions: Array<{ value: FontPreset; label: string }> = [
  { value: "gothic", label: "ゴシック" },
  { value: "mincho", label: "明朝" },
  { value: "mono", label: "等幅" },
  { value: "ud", label: "UD" }
];

export function ControlPanel(props: Props) {
  const textareaRef = useRef<HTMLElement>(null);
  const themeSelectRef = useRef<HTMLElement>(null);
  const fontSelectRef = useRef<HTMLElement>(null);
  const colorPickerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const handleInput = (event: Event) => {
      const target = event.target as HTMLTextAreaElement & { value: string };
      props.onTextInput(target.value);
    };

    textarea.addEventListener("sl-input", handleInput);
    return () => textarea.removeEventListener("sl-input", handleInput);
  }, [props]);

  useEffect(() => {
    const themeSelect = themeSelectRef.current;
    if (!themeSelect) {
      return;
    }

    const handleChange = (event: Event) => {
      const target = event.target as HTMLSelectElement & { value: ThemeChoice };
      props.onThemeChange(target.value);
    };

    themeSelect.addEventListener("sl-change", handleChange);
    return () => themeSelect.removeEventListener("sl-change", handleChange);
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
    <sl-card class="panel control-panel">
      <div slot="header" class="panel-header">
        <div>
          <p class="eyebrow">Compose</p>
          <h1>Dekamoji</h1>
        </div>
        <p class="panel-copy">
          Unicode 文字を大きく表示して、紙への転記や掲示に使うためのビューです。
        </p>
      </div>

      <label class="field">
        <span>表示する文字</span>
        <sl-textarea
          ref={textareaRef}
          rows={3}
          value={props.text}
          placeholder="例: 龍, ∞, あ"
          resize="auto"
        />
      </label>

      <div class="field-grid">
        <label class="field">
          <span>テーマ</span>
          <sl-select ref={themeSelectRef} value={props.themeChoice} hoist>
            <sl-option value="system">OS に追従</sl-option>
            <sl-option value="light">ライト</sl-option>
            <sl-option value="dark">ダーク</sl-option>
          </sl-select>
        </label>

        <label class="field">
          <span>フォント</span>
          <sl-select ref={fontSelectRef} value={props.fontPreset} hoist>
            {fontOptions.map((option) => (
              <sl-option key={option.value} value={option.value}>
                {option.label}
              </sl-option>
            ))}
          </sl-select>
        </label>

        <label class="field">
          <span>文字色</span>
          <sl-color-picker
            ref={colorPickerRef}
            value={props.textColor}
            format="hex"
            hoist
          />
        </label>
      </div>

      <div class="field note-field">
        <span>表示方針</span>
        <p>改行はスペースへ正規化し、長文は自動縮小して表示します。</p>
        {props.lengthWarning ? (
          <sl-alert variant="warning" open>
            {props.lengthWarning}
          </sl-alert>
        ) : null}
      </div>

      <div class="actions">
        <sl-button variant="primary" size="large" onClick={props.onOpenDisplay}>
          表示画面を開く
        </sl-button>
        <sl-button size="large" onClick={props.onPrint}>
          PDF 出力
        </sl-button>
      </div>
    </sl-card>
  );
}
