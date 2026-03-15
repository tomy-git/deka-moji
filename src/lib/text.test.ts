import { describe, expect, it } from "vitest";
import { createLengthWarning, sanitizeText } from "./text";

describe("sanitizeText", () => {
  it("改行と余分な空白を単一スペースへ正規化する", () => {
    expect(sanitizeText("漢\n\n字\t テスト")).toBe("漢 字 テスト");
  });
});

describe("createLengthWarning", () => {
  it("長文時に警告を返す", () => {
    expect(createLengthWarning("あいうえおかきくけこさしす")).toContain("自動で縮小");
  });
});

