import type { SortOption } from "../../../SearchResultsPage/types";

export interface SortProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
  sortOptions?: { label: string; value: string }[] | readonly { label: string; value: string }[];
}