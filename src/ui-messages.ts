export type UiMessage = {
  id: string;
  text: string;
};

export const UI_MESSAGES = {
  appEyebrow: { id: "app.header.eyebrow", text: "Display" },
  appTitle: { id: "app.header.title", text: "Dekamoji" },
  appCopyright: { id: "app.footer.copyright", text: "Copyright tomy-git" },
  openSettings: { id: "app.action.open-settings", text: "表示設定を開く" },
  themeSectionEyebrow: { id: "settings.theme.eyebrow", text: "Theme" },
  themeSectionTitle: { id: "settings.theme.title", text: "テーマ" },
  themeSystem: { id: "settings.theme.system", text: "システム" },
  themeLight: { id: "settings.theme.light", text: "ライト" },
  themeDark: { id: "settings.theme.dark", text: "ダーク" },
  fontLabel: { id: "settings.font.label", text: "フォント" },
  textColorLabel: { id: "settings.text-color.label", text: "文字色" },
  fontGothic: { id: "settings.font.gothic", text: "ゴシック" },
  fontMincho: { id: "settings.font.mincho", text: "明朝" },
  fontMono: { id: "settings.font.mono", text: "等幅" },
  fontUd: { id: "settings.font.ud", text: "UD" },
  historyEyebrow: { id: "history.header.eyebrow", text: "History" },
  historyTitle: { id: "history.header.title", text: "履歴" },
  historyClear: { id: "history.action.clear", text: "すべて削除" },
  historyEmpty: { id: "history.empty", text: "表示履歴はまだありません。" },
  historyDelete: { id: "history.action.delete", text: "履歴を削除" },
  sidebarOpen: { id: "display.action.open-sidebar", text: "履歴サイドバーを開く" },
  sidebarClose: { id: "display.action.close-sidebar", text: "履歴サイドバーを閉じる" },
  pdfExport: { id: "display.action.pdf-export", text: "PDF 出力" },
  fullscreenEnter: { id: "display.action.fullscreen-enter", text: "全画面表示" },
  fullscreenExit: { id: "display.action.fullscreen-exit", text: "全画面を終了" },
  displayTextboxLabel: { id: "display.textbox.label", text: "表示文字" },
  displayPlaceholder: { id: "display.textbox.placeholder", text: "ここに直接入力" },
  lengthWarning: {
    id: "display.alert.length-warning",
    text: "文字数が多いため、自動で縮小して表示しています。"
  }
} as const satisfies Record<string, UiMessage>;
