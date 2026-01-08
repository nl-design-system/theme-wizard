export interface OpeningHoursSpec {
  '@type': string;
  closes: string;
  dayOfWeek: string;
  opens: string;
}

export interface SummaryItem {
  hours: OpeningHoursSpec[] | null;
  label: string;
}

export interface OpeningHoursCardProps {
  openingHoursSummary?: SummaryItem[];
}
