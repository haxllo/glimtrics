import jsPDF from 'jspdf';
import { getCurrentDateForFilename, sanitizeFilename } from './utils-date';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  filename: string;
  datasetName: string;
  insights?: Array<{
    type: string;
    title: string;
    description: string;
  }>;
  statistics?: Record<string, {
    min: number;
    max: number;
    avg: number;
    sum: number;
    isDate?: boolean;
  }>;
}

export async function exportAnalyticsToPDF(
  containerId: string,
  options: PDFExportOptions
): Promise<void> {
  const element = document.getElementById(containerId);
  
  if (!element) {
    throw new Error('Container element not found');
  }

  // Create a clone to manipulate
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = '1200px';
  clone.style.padding = '20px';
  
  // Temporarily append to body for rendering
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    // Remove the clone
    document.body.removeChild(clone);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add title page
    pdf.setFontSize(24);
    pdf.text(options.datasetName, 15, 20);
    pdf.setFontSize(12);
    pdf.text(`Analytics Report - Generated ${new Date().toLocaleDateString()}`, 15, 30);

    // Add insights if provided
    if (options.insights && options.insights.length > 0) {
      let yPosition = 50;
      pdf.setFontSize(16);
      pdf.text('AI Insights', 15, yPosition);
      yPosition += 10;

      options.insights.forEach((insight, index) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${insight.title}`, 15, yPosition);
        yPosition += 7;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const splitDescription = pdf.splitTextToSize(insight.description, pageWidth - 30);
        pdf.text(splitDescription, 15, yPosition);
        yPosition += splitDescription.length * 5 + 5;
      });
    }

    // Add new page for charts
    pdf.addPage();
    
    let currentY = 0;
    while (currentY < imgHeight) {
      pdf.addImage(
        imgData,
        'PNG',
        10,
        10 - currentY,
        imgWidth,
        imgHeight
      );
      currentY += pageHeight - 20;
      
      if (currentY < imgHeight) {
        pdf.addPage();
      }
    }

    // Add statistics page if provided
    if (options.statistics) {
      pdf.addPage();
      let yPos = 20;
      pdf.setFontSize(16);
      pdf.text('Statistical Summary', 15, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      Object.entries(options.statistics).forEach(([column, stats]) => {
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.text(column, 15, yPos);
        yPos += 6;

        pdf.setFont('helvetica', 'normal');
        
        if (stats.isDate) {
          // Date columns - show earliest and latest
          pdf.text(`Earliest: ${new Date(stats.min).toLocaleDateString()}`, 20, yPos);
          yPos += 5;
          pdf.text(`Latest: ${new Date(stats.max).toLocaleDateString()}`, 20, yPos);
          yPos += 5;
          const days = Math.ceil((stats.max - stats.min) / (1000 * 60 * 60 * 24));
          pdf.text(`Date Range: ${days} days`, 20, yPos);
          yPos += 8;
        } else {
          // Numeric columns - show all stats
          pdf.text(`Min: ${stats.min.toFixed(2)}`, 20, yPos);
          yPos += 5;
          pdf.text(`Max: ${stats.max.toFixed(2)}`, 20, yPos);
          yPos += 5;
          pdf.text(`Avg: ${stats.avg.toFixed(2)}`, 20, yPos);
          yPos += 5;
          pdf.text(`Sum: ${stats.sum.toFixed(2)}`, 20, yPos);
          yPos += 8;
        }
      });
    }

    // Save the PDF
    pdf.save(options.filename);
  } catch (error) {
    // Make sure to clean up even if there's an error
    if (clone.parentNode) {
      document.body.removeChild(clone);
    }
    throw error;
  }
}

export async function exportInsightsToPDF(
  insights: Array<{
    type: string;
    title: string;
    description: string;
  }>,
  datasetName: string
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Title page
  pdf.setFontSize(24);
  pdf.text(datasetName, 15, 20);
  pdf.setFontSize(14);
  pdf.text('AI Insights Report', 15, 30);
  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 15, 38);

  let yPosition = 55;

  insights.forEach((insight, index) => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    // Type badge
    pdf.setFillColor(200, 200, 200);
    pdf.rect(15, yPosition - 4, 20, 6, 'F');
    pdf.setFontSize(8);
    pdf.text(insight.type.toUpperCase(), 17, yPosition);
    yPosition += 8;

    // Title
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${index + 1}. ${insight.title}`, 15, yPosition);
    yPosition += 8;

    // Description
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const splitDescription = pdf.splitTextToSize(insight.description, pageWidth - 30);
    pdf.text(splitDescription, 15, yPosition);
    yPosition += splitDescription.length * 5 + 10;
  });

  const sanitizedName = sanitizeFilename(datasetName);
  const dateStr = getCurrentDateForFilename();
  pdf.save(`${sanitizedName}-insights-${dateStr}.pdf`);
}
