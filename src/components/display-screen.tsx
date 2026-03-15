import fullscreenIcon from "bootstrap-icons/icons/arrows-fullscreen.svg";
import pdfIcon from "bootstrap-icons/icons/file-earmark-pdf.svg";
import sidebarCloseIcon from "bootstrap-icons/icons/layout-sidebar-inset-reverse.svg";
import sidebarOpenIcon from "bootstrap-icons/icons/layout-sidebar-inset.svg";
import { useEffect, useRef, useState } from "preact/hooks";
import { calculateFontSize } from "../lib/fit-text";
import { canUseFullscreen, enterFullscreen, exitFullscreen } from "../lib/fullscreen";
import { UI_MESSAGES } from "../ui-messages";
import type { ActiveTheme, FontPreset } from "../types";

type Props = {
  text: string;
  textColor: string;
  activeTheme: ActiveTheme;
  fontPreset: FontPreset;
  lengthWarning: string | null;
  isSidebarOpen: boolean;
  onTextInput: (value: string) => void;
  onTextCommit: () => void;
  onToggleSidebar: () => void;
  onPrint: () => void;
};

export function DisplayScreen(props: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const editable = editableRef.current;
    if (!editable) {
      return;
    }

    if (editable.textContent !== props.text) {
      editable.textContent = props.text;
    }
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

  const syncEditableText = () => {
    const editable = editableRef.current;
    if (!editable) {
      return;
    }

    const normalized = editable.innerText.replace(/\n+/g, " ");
    props.onTextInput(normalized);
  };

  return (
    <section
      ref={containerRef}
      class={`display-screen theme-${props.activeTheme} font-${props.fontPreset}`}
    >
      <header class="display-toolbar no-print">
        <sl-icon-button
          label={
            props.isSidebarOpen
              ? UI_MESSAGES.sidebarClose.text
              : UI_MESSAGES.sidebarOpen.text
          }
          src={props.isSidebarOpen ? sidebarCloseIcon : sidebarOpenIcon}
          onClick={props.onToggleSidebar}
        />
        <div class="toolbar-actions">
          <sl-icon-button label={UI_MESSAGES.pdfExport.text} src={pdfIcon} onClick={props.onPrint} />
          <sl-icon-button
            label={
              isFullscreen
                ? UI_MESSAGES.fullscreenExit.text
                : UI_MESSAGES.fullscreenEnter.text
            }
            src={fullscreenIcon}
            onClick={toggleFullscreen}
            disabled={!fullscreenSupported}
          />
        </div>
      </header>

      <div class="display-content">
        <div
          ref={editableRef}
          class="display-text"
          contentEditable
          role="textbox"
          aria-label={UI_MESSAGES.displayTextboxLabel.text}
          data-placeholder={UI_MESSAGES.displayPlaceholder.text}
          style={{ color: props.textColor, fontSize: `${fontSize}px` }}
          onInput={syncEditableText}
          onBlur={props.onTextCommit}
        />
        {props.lengthWarning ? (
          <sl-alert class="display-warning no-print" variant="warning" open>
            {props.lengthWarning}
          </sl-alert>
        ) : null}
      </div>
    </section>
  );
}
