import { DashboardData } from "@/types/dashboard";

export interface AnalyticsData {
  summary: {
    totalRows: number;
    totalColumns: number;
    numericColumns: string[];
    textColumns: string[];
    dateColumns: string[];
  };
  statistics: {
    [column: string]: {
      min: number;
      max: number;
      avg: number;
      sum: number;
      count: number;
      isDate?: boolean; // Flag to indicate date column
    };
  };
  chartData: {
    [column: string]: Array<{ name: string; value: number }>;
  };
  categoryDistribution: {
    [column: string]: Array<{ name: string; value: number; percentage: number }>;
  };
}

export function analyzeData(data: DashboardData): AnalyticsData {
  const { headers, rows } = data;
  
  const numericColumns: string[] = [];
  const textColumns: string[] = [];
  const dateColumns: string[] = [];
  const statistics: AnalyticsData['statistics'] = {};
  const chartData: AnalyticsData['chartData'] = {};
  const categoryDistribution: AnalyticsData['categoryDistribution'] = {};

  // Identify column types and calculate statistics
  headers.forEach((header) => {
    const values = rows.map((row) => row[header]).filter((val) => val !== null && val !== undefined);
    
    if (values.length === 0) return;

    // Check if date first (before numeric check)
    const dateValues = values.filter((val) => {
      if (typeof val === 'string') {
        const date = new Date(val);
        return !isNaN(date.getTime()) && val.includes('-'); // Simple date check
      }
      return false;
    });

    if (dateValues.length > values.length * 0.7) {
      // Mostly dates - only calculate min/max
      dateColumns.push(header);
      
      const dates = dateValues.map(val => new Date(String(val)).getTime());
      const min = Math.min(...dates);
      const max = Math.max(...dates);

      statistics[header] = {
        min: min,
        max: max,
        avg: 0, // Not applicable for dates
        sum: 0, // Not applicable for dates
        count: dateValues.length,
        isDate: true,
      };
      return; // Skip numeric check
    }

    // Check if numeric
    const numericValues = values
      .map((val) => {
        const num = typeof val === 'number' ? val : parseFloat(String(val));
        return isNaN(num) ? null : num;
      })
      .filter((val): val is number => val !== null);

    if (numericValues.length > values.length * 0.7) {
      // Mostly numeric
      numericColumns.push(header);
      
      const sum = numericValues.reduce((acc, val) => acc + val, 0);
      const avg = sum / numericValues.length;
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);

      statistics[header] = {
        min,
        max,
        avg,
        sum,
        count: numericValues.length,
        isDate: false,
      };

      // Create chart data for numeric columns
      chartData[header] = numericValues.slice(0, 50).map((val, idx) => ({
        name: `Row ${idx + 1}`,
        value: val,
      }));
    } else {
      // Text columns
      textColumns.push(header);

      // Create category distribution for text columns
      if (textColumns.includes(header)) {
        const distribution = new Map<string, number>();
        values.forEach((val) => {
          let key = String(val);
          // Truncate very long text for distribution (e.g., descriptions, URLs)
          if (key.length > 100) {
            key = key.substring(0, 100) + '...';
          }
          distribution.set(key, (distribution.get(key) || 0) + 1);
        });

        // Skip if too many unique values (e.g., descriptions, titles, IDs)
        // A good category distribution should have < 50% unique values
        const uniqueRatio = distribution.size / values.length;
        if (uniqueRatio > 0.5 || distribution.size > 50) {
          // Too many unique values, not useful for pie chart
          return;
        }

        const total = values.length;
        categoryDistribution[header] = Array.from(distribution.entries())
          .map(([name, count]) => ({
            name: name.length > 40 ? name.substring(0, 40) + '...' : name, // Truncate for legend
            value: count,
            percentage: (count / total) * 100,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8); // Top 8 categories for cleaner charts
      }
    }
  });

  return {
    summary: {
      totalRows: rows.length,
      totalColumns: headers.length,
      numericColumns,
      textColumns,
      dateColumns,
    },
    statistics,
    chartData,
    categoryDistribution,
  };
}

export function filterData(
  rows: Record<string, unknown>[],
  filters: {
    column?: string;
    minValue?: number;
    maxValue?: number;
    categories?: string[];
    dateRange?: { start: Date; end: Date };
  }
): Record<string, unknown>[] {
  let filtered = [...rows];

  if (filters.column && filters.minValue !== undefined && filters.maxValue !== undefined) {
    filtered = filtered.filter((row) => {
      const value = row[filters.column!];
      const numValue = typeof value === 'number' ? value : parseFloat(String(value));
      if (isNaN(numValue)) return false;
      return numValue >= filters.minValue! && numValue <= filters.maxValue!;
    });
  }

  if (filters.column && filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((row) => {
      const value = String(row[filters.column!]);
      return filters.categories!.includes(value);
    });
  }

  return filtered;
}

export function calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
  if (values.length < 2) return 'stable';
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (Math.abs(change) < 5) return 'stable';
  return change > 0 ? 'increasing' : 'decreasing';
}

export function detectAnomalies(values: number[]): number[] {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  const anomalyIndices: number[] = [];
  values.forEach((val, idx) => {
    if (Math.abs(val - mean) > 2 * stdDev) {
      anomalyIndices.push(idx);
    }
  });
  
  return anomalyIndices;
}
