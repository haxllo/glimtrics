export interface DashboardData {
  fileUrl: string;
  fileType: string;
  headers: string[];
  rows: Record<string, unknown>[];
  totalRows: number;
  totalColumns: number;
  uploadedAt: string;
}

export interface DatasetSummary {
  totalRows: number;
  totalColumns: number;
  numericColumns: string[];
  textColumns: string[];
  dateColumns: string[];
}

// Type guard for DashboardData
export function isDashboardData(data: unknown): data is DashboardData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Partial<DashboardData>;
  return (
    Array.isArray(d.headers) &&
    Array.isArray(d.rows) &&
    typeof d.totalRows === 'number' &&
    typeof d.totalColumns === 'number'
  );
}
