/** Aggregate send result for a single day, shown in the admin dashboard. */
export interface DeliverySummaryDTO {
  date: string;
  sent: number;
  failed: number;
  total: number;
}
