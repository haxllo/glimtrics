export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string
): void {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(headers.map(h => `"${h}"`).join(","));

  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = String(val ?? "").replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  });

  // Create blob and download
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportStatisticsToCSV(
  statistics: Record<string, { min: number; max: number; avg: number; sum: number; count: number }>,
  filename: string
): void {
  const data = Object.entries(statistics).map(([column, stats]) => ({
    Column: column,
    Min: stats.min,
    Max: stats.max,
    Average: stats.avg,
    Sum: stats.sum,
    Count: stats.count,
  }));

  exportToCSV(data, filename);
}
