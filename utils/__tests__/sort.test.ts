import { getSortLabel } from "@/utils/sort";

describe("getSortLabel", () => {
  const t = (key: string) => key;

  it("returns ascending name label", () => {
    expect(getSortLabel("name-asc", t)).toBe("sort.nameAsc");
  });

  it("returns descending name label", () => {
    expect(getSortLabel("name-desc", t)).toBe("sort.nameDesc");
  });

  it("returns newest and oldest labels", () => {
    expect(getSortLabel("newest", t)).toBe("sort.newest");
    expect(getSortLabel("oldest", t)).toBe("sort.oldest");
  });

  it("falls back to title for unknown options", () => {
    expect(getSortLabel("invalid" as never, t)).toBe("sort.title");
  });
});
