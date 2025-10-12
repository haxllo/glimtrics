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
