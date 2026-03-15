import { useEffect, useRef, useState } from "preact/hooks";
import { calculateFontSize } from "../lib/fit-text";
import { canUseFullscreen, enterFullscreen, exitFullscreen } from "../lib/fullscreen";
import type { ActiveTheme, FontPreset } from "../types";

type Props = {
  text: string;
  textColor: string;
  activeTheme: ActiveTheme;
  fontPreset: FontPreset;
  lengthWarning: string | null;
  onBack: () => void;
  onPrint: () => void;
};

export function DisplayScreen(props: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const [fontSize, setFontSize] = useState(120);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const element = containerRef.current;
      if (!element) {
        return;
      }

      const { width, height } = element.getBoundingClientRect();
      setFontSize(calculateFontSize(props.text, width, height));
      setFullscreenSupported(canUseFullscreen(element));
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    const fullscreenListener = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("resize", updateSize);
    document.addEventListener("fullscreenchange", fullscreenListener);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
      document.removeEventListener("fullscreenchange", fullscreenListener);
    };
  }, [props.text]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) {
      return;
    }

    if (document.fullscreenElement) {
      await exitFullscreen();
      setIsFullscreen(false);
      return;
    }

    const entered = await enterFullscreen(containerRef.current);
    setIsFullscreen(entered);
  };

  return (
    <section
      ref={containerRef}
      class={`display-screen theme-${props.activeTheme} font-${props.fontPreset}`}
    >
      <header class="display-toolbar no-print">
        <sl-button onClick={props.onBack}>
          戻る
        </sl-button>
        <div class="toolbar-actions">
          <sl-button onClick={props.onPrint}>
            PDF 出力
          </sl-button>
          <sl-button onClick={toggleFullscreen} disabled={!fullscreenSupported}>
            {isFullscreen ? "全画面を終了" : "全画面"}
          </sl-button>
        </div>
      </header>

      <div class="display-content">
        <p class="display-text" style={{ color: props.textColor, fontSize: `${fontSize}px` }}>
          {props.text || "文字を入力してください"}
        </p>
        {props.lengthWarning ? (
          <sl-alert class="display-warning no-print" variant="warning" open>
            {props.lengthWarning}
          </sl-alert>
        ) : null}
      </div>
    </section>
  );
}
