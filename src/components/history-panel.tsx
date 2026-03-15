import type { HistoryEntry } from "../types";

type Props = {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
};

export function HistoryPanel(props: Props) {
  return (
    <sl-card class="panel history-panel">
      <div slot="header" class="panel-header inline">
        <div>
          <p class="eyebrow">History</p>
          <h2>履歴</h2>
        </div>
        <sl-button onClick={props.onClear} disabled={props.entries.length === 0}>
          すべて削除
        </sl-button>
      </div>

      {props.entries.length === 0 ? (
        <p class="empty-state">表示履歴はまだありません。</p>
      ) : (
        <ul class="history-list">
          {props.entries.map((entry) => (
            <li key={entry.id}>
              <button type="button" class="history-item" onClick={() => props.onSelect(entry)}>
                <span class="history-text">{entry.text}</span>
                <span class="history-meta">
                  <sl-badge pill>{entry.fontPreset}</sl-badge>
                  {new Date(entry.savedAt).toLocaleString("ja-JP")}
                </span>
              </button>
              <sl-button variant="danger" class="history-delete" onClick={() => props.onDelete(entry.id)}>
                削除
              </sl-button>
            </li>
          ))}
        </ul>
      )}
    </sl-card>
  );
}
