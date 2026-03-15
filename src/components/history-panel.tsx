import deleteIcon from "bootstrap-icons/icons/x.svg";
import { fontClassMap } from "../lib/font-class";
import type { HistoryEntry } from "../types";
import { UI_MESSAGES } from "../ui-messages";

type Props = {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onClose?: () => void;
};

const fontLabelMap: Record<HistoryEntry["fontPreset"], string> = {
  gothic: UI_MESSAGES.fontGothic.text,
  mincho: UI_MESSAGES.fontMincho.text,
  mono: UI_MESSAGES.fontMono.text,
  ud: UI_MESSAGES.fontUd.text
};

function truncateText(text: string, maxLength: number): string {
  const graphemes = Array.from(text);
  if (graphemes.length <= maxLength) {
    return text;
  }

  return `${graphemes.slice(0, maxLength).join("")}...`;
}

export function HistoryPanel(props: Props) {
  return (
    <sl-card class="panel history-panel">
      <div slot="header" class="panel-header inline">
        <div>
          <p class="eyebrow">{UI_MESSAGES.historyEyebrow.text}</p>
          <h2>{UI_MESSAGES.historyTitle.text}</h2>
        </div>
        <div class="history-header-actions">
          {props.onClose ? (
            <sl-icon-button
              class="history-close-button"
              name="x-lg"
              library="system"
              label={UI_MESSAGES.sidebarClose.text}
              onClick={props.onClose}
            />
          ) : null}
          <sl-button size="small" onClick={props.onClear} disabled={props.entries.length === 0}>
            {UI_MESSAGES.historyClear.text}
          </sl-button>
        </div>
      </div>

      {props.entries.length === 0 ? (
        <p class="empty-state">{UI_MESSAGES.historyEmpty.text}</p>
      ) : (
        <ul class="history-list">
          {props.entries.map((entry) => (
            <li key={entry.id}>
              <sl-button
                class="history-delete-button"
                aria-label={UI_MESSAGES.historyDelete.text}
                onClick={(event: Event) => {
                  event.stopPropagation();
                  props.onDelete(entry.id);
                }}
              >
                <sl-icon
                  class="history-delete-icon"
                  src={deleteIcon}
                  aria-hidden="true"
                />
              </sl-button>
              <button type="button" class="history-item" onClick={() => props.onSelect(entry)}>
                <span class={`history-text ${fontClassMap[entry.fontPreset]}`}>
                  {truncateText(entry.text, 10)}
                </span>
                <span class="history-meta">
                  <sl-badge pill>{fontLabelMap[entry.fontPreset]}</sl-badge>
                  {new Date(entry.savedAt).toLocaleString("ja-JP")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </sl-card>
  );
}
