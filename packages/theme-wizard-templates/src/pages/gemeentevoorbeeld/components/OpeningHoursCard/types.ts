export interface OpeningHoursSpec {
  '@type': string;
  closes: string;
  dayOfWeek: string;
  opens: string;
}

export interface SummaryHours {
  closes: string;
  opens: string;
}

export interface SummaryItem {
  hours: SummaryHours[] | null;
  label: string;
}

export interface OpeningHoursCardProps {
  openingHoursSummary?: SummaryItem[];
}
