import { Injectable, signal } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

export interface PdfFile {
  name: string;
  data: Uint8Array;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  currentPdf = signal<PdfFile | null>(null);
  
  async mergePdfs(files: File[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    return await mergedPdf.save();
  }

  async splitPdf(file: File, ranges: { start: number; end: number }[]): Promise<Uint8Array[]> {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const results: Uint8Array[] = [];

    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      const indices = Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start - 1 + i);
      const copiedPages = await newPdf.copyPages(pdf, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));
      results.push(await newPdf.save());
    }
    return results;
  }

  async addSignature(pdfBytes: Uint8Array, signatureImageBytes: string, x: number, y: number, pageIndex: number): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    const page = pdfDoc.getPage(pageIndex);
    
    const { width, height } = signatureImage.scale(0.5);
    page.drawImage(signatureImage, {
      x,
      y,
      width,
      height,
    });
    
    return await pdfDoc.save();
  }

  downloadPdf(bytes: Uint8Array, filename: string) {
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
