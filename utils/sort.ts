export type SortOption = "name-asc" | "name-desc" | "newest" | "oldest";

export const getSortLabel = (option: SortOption) => {
  switch (option) {
    case "name-asc":
      return "A-Z";
    case "name-desc":
      return "Z-A";
    case "newest":
      return "Newest";
    case "oldest":
      return "Oldest";
    default:
      return "Sort";
  }
};