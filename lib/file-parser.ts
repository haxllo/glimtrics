import Papa from 'papaparse';

export interface ParsedData {
  headers: string[];
  rows: any[];
  totalRows: number;
  totalColumns: number;
}

export async function parseCSV(fileUrl: string): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(fileUrl, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data;
        
        resolve({
          headers,
          rows,
          totalRows: rows.length,
          totalColumns: headers.length,
        });
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      },
    });
  });
}

export async function parseExcel(fileUrl: string): Promise<ParsedData> {
  try {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length === 0) {
      throw new Error('Excel file is empty');
    }
    
    const headers = jsonData[0] as string[];
    const rows = jsonData.slice(1).map((row: any) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    return {
      headers,
      rows,
      totalRows: rows.length,
      totalColumns: headers.length,
    };
  } catch (error) {
    throw new Error(`Excel parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function parseDataFile(fileUrl: string, fileType: string): Promise<ParsedData> {
  const lowerType = fileType.toLowerCase();
  
  if (lowerType.includes('csv') || lowerType === 'text/csv') {
    return parseCSV(fileUrl);
  } else if (
    lowerType.includes('excel') || 
    lowerType.includes('spreadsheet') ||
    fileUrl.endsWith('.xlsx') ||
    fileUrl.endsWith('.xls')
  ) {
    return parseExcel(fileUrl);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

export function validateDataStructure(data: ParsedData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.totalRows === 0) {
    errors.push('File contains no data rows');
  }
  
  if (data.totalColumns === 0) {
    errors.push('File contains no columns');
  }
  
  if (data.headers.some(header => !header || header.trim() === '')) {
    errors.push('File contains empty column headers');
  }
  
  const duplicateHeaders = data.headers.filter(
    (header, index) => data.headers.indexOf(header) !== index
  );
  if (duplicateHeaders.length > 0) {
    errors.push(`Duplicate column headers found: ${duplicateHeaders.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getDataSummary(data: ParsedData) {
  const numericColumns: string[] = [];
  const textColumns: string[] = [];
  const dateColumns: string[] = [];
  
  data.headers.forEach(header => {
    const sampleValues = data.rows.slice(0, 10).map(row => row[header]);
    
    const numericCount = sampleValues.filter(val => typeof val === 'number').length;
    const dateCount = sampleValues.filter(val => {
      if (typeof val === 'string') {
        const date = new Date(val);
        return !isNaN(date.getTime());
      }
      return false;
    }).length;
    
    if (numericCount > sampleValues.length * 0.7) {
      numericColumns.push(header);
    } else if (dateCount > sampleValues.length * 0.7) {
      dateColumns.push(header);
    } else {
      textColumns.push(header);
    }
  });
  
  return {
    totalRows: data.totalRows,
    totalColumns: data.totalColumns,
    numericColumns,
    textColumns,
    dateColumns,
  };
}
