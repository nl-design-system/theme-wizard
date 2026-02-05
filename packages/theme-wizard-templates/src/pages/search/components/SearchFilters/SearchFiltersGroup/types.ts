import type { ReactNode } from 'react';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface SearchFilterGroupProps {
  title: string;
  id: string;
  name: string;
  options: readonly FilterOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  children?: ReactNode;
}
