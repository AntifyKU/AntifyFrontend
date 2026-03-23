export type SortOption = "name-asc" | "name-desc" | "newest" | "oldest";

export const getSortLabel = (
  option: SortOption,
  t: (key: string) => string,
) => {
  switch (option) {
    case "name-asc":
      return t("sort.nameAsc");
    case "name-desc":
      return t("sort.nameDesc");
    case "newest":
      return t("sort.newest");
    case "oldest":
      return t("sort.oldest");
    default:
      return t("sort.title");
  }
};
