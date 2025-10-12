import { DashboardData, isDashboardData } from "@/types/dashboard";

/**
 * Safely parse Prisma JSON field to DashboardData
 * Avoids unsafe type casts like 'as unknown as DashboardData'
 */
export function parseDashboardData(data: unknown): DashboardData {
  if (isDashboardData(data)) {
    return data;
  }
  
  // Fallback for invalid data
  return {
    fileUrl: '',
    fileType: '',
    headers: [],
    rows: [],
    totalRows: 0,
    totalColumns: 0,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Type-safe data extractor for dashboard cards
 */
export function getDashboardStats(data: unknown): {
  totalRows: number;
  totalColumns: number;
  headers: string[];
} {
  const parsed = parseDashboardData(data);
  return {
    totalRows: parsed.totalRows,
    totalColumns: parsed.totalColumns,
    headers: parsed.headers,
  };
}
