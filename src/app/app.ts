import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Sidebar } from './sidebar';
import { ToolGrid } from './tool-grid';
import { PdfViewer } from './pdf-viewer';
import { PdfService } from './pdf.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatIconModule, Sidebar, ToolGrid, PdfViewer],
  template: `
    <div class="flex h-screen bg-[#F5F5F7]">
      <app-sidebar (navigate)="onNavigate($event)"></app-sidebar>

      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between z-10">
          <div class="flex items-center gap-4">
            <h1 class="text-lg font-bold text-gray-800">{{ currentViewTitle() }}</h1>
            @if (activeTool()) {
              <div class="flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#0066CC] rounded-full text-xs font-bold uppercase tracking-wider">
                <mat-icon class="text-sm">bolt</mat-icon>
                Active Tool
              </div>
            }
          </div>

          <div class="flex items-center gap-4">
            <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <mat-icon>search</mat-icon>
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <mat-icon>notifications</mat-icon>
            </button>
            <div class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </header>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto p-8">
          
          <!-- Home View -->
          @if (view() === 'home') {
            <div class="max-w-6xl mx-auto space-y-12">
              <section>
                <div class="mb-8">
                  <h2 class="text-3xl font-extrabold tracking-tight mb-2">Welcome back, User</h2>
                  <p class="text-gray-500">What would you like to do with your PDF today?</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div class="w-12 h-12 bg-blue-50 text-[#0066CC] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0066CC] group-hover:text-white transition-colors">
                      <mat-icon>add</mat-icon>
                    </div>
                    <h3 class="font-bold mb-1">Create PDF</h3>
                    <p class="text-sm text-gray-500">Start from a blank page or template.</p>
                  </div>
                  <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div class="w-12 h-12 bg-red-50 text-[#FF4B4B] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FF4B4B] group-hover:text-white transition-colors">
                      <mat-icon>upload</mat-icon>
                    </div>
                    <h3 class="font-bold mb-1">Upload File</h3>
                    <p class="text-sm text-gray-500">Import a PDF from your computer.</p>
                  </div>
                  <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div class="w-12 h-12 bg-amber-50 text-[#FFB800] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FFB800] group-hover:text-white transition-colors">
                      <mat-icon>star</mat-icon>
                    </div>
                    <h3 class="font-bold mb-1">Favorites</h3>
                    <p class="text-sm text-gray-500">Access your most used documents.</p>
                  </div>
                </div>
              </section>

              <section>
                <div class="flex items-center justify-between mb-8">
                  <h2 class="text-2xl font-bold tracking-tight">Popular Tools</h2>
                  <button (click)="onNavigate('tools')" class="text-[#0066CC] font-semibold text-sm hover:underline">View All</button>
                </div>
                <app-tool-grid (selectTool)="onSelectTool($event)"></app-tool-grid>
              </section>
            </div>
          }

          <!-- Tools View -->
          @if (view() === 'tools') {
            <div class="max-w-6xl mx-auto">
              <div class="mb-12">
                <h2 class="text-3xl font-extrabold tracking-tight mb-2">All PDF Tools</h2>
                <p class="text-gray-500">Everything you need to manage your PDF documents in one place.</p>
              </div>
              <app-tool-grid (selectTool)="onSelectTool($event)"></app-tool-grid>
            </div>
          }

          <!-- Tool Execution View -->
          @if (view() === 'tool-exec') {
            <div class="max-w-4xl mx-auto">
              <div class="flex items-center gap-4 mb-8">
                <button (click)="onNavigate('tools')" class="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <mat-icon>arrow_back</mat-icon>
                </button>
                <h2 class="text-3xl font-extrabold tracking-tight">{{ activeToolName() }}</h2>
              </div>

              <!-- Generic Tool Interface -->
              <div class="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
                <div 
                  [style.background-color]="activeToolColor()"
                  class="w-20 h-20 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-black/5"
                >
                  <mat-icon class="text-4xl">{{ activeToolIcon() }}</mat-icon>
                </div>
                
                <h3 class="text-xl font-bold mb-2">Select PDF files</h3>
                <p class="text-gray-500 mb-8 max-w-md mx-auto">Upload the files you want to {{ activeToolName().toLowerCase() }}. You can also drag and drop them here.</p>
                
                <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" [multiple]="activeTool() === 'merge'" accept=".pdf">
                <button (click)="fileInput.click()" class="btn-primary py-4 px-8 text-lg mx-auto">
                  Select PDF files
                </button>
                
                <div class="mt-8 flex items-center justify-center gap-6 text-gray-400">
                  <div class="flex items-center gap-2">
                    <mat-icon class="text-sm">lock</mat-icon>
                    <span class="text-xs font-medium uppercase tracking-widest">Secure</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <mat-icon class="text-sm">cloud_done</mat-icon>
                    <span class="text-xs font-medium uppercase tracking-widest">Cloud Processing</span>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- PDF Processing / Result View -->
          @if (view() === 'result') {
            <div class="h-full flex flex-col">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                  <button (click)="onNavigate('tools')" class="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <mat-icon>arrow_back</mat-icon>
                  </button>
                  <h2 class="text-2xl font-bold tracking-tight">Preview & Save</h2>
                </div>
                <div class="flex items-center gap-3">
                  <button (click)="onDownload()" class="btn-primary">
                    <mat-icon>download</mat-icon>
                    Download PDF
                  </button>
                  <button class="btn-secondary">
                    <mat-icon>share</mat-icon>
                    Share
                  </button>
                </div>
              </div>
              
              <div class="flex-1 min-h-0">
                <app-pdf-viewer 
                  [pdfData]="processedPdfData()!"
                  (download)="onDownload()"
                ></app-pdf-viewer>
              </div>
            </div>
          }

        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class App {
  private pdfService = inject(PdfService);
  view = signal<'home' | 'tools' | 'tool-exec' | 'result'>('home');
  activeTool = signal<string | null>(null);
  processedPdfData = signal<Uint8Array | null>(null);

  currentViewTitle() {
    switch(this.view()) {
      case 'home': return 'Dashboard';
      case 'tools': return 'Tools';
      case 'tool-exec': return 'Tool Processor';
      case 'result': return 'Result';
      default: return 'PDF Master';
    }
  }

  activeToolName() {
    const tools: Record<string, string> = {
      merge: 'Merge PDF',
      split: 'Split PDF',
      sign: 'Sign PDF',
      compress: 'Compress PDF',
      convert: 'Convert PDF',
      edit: 'Edit PDF'
    };
    return tools[this.activeTool() || ''] || '';
  }

  activeToolIcon() {
    const icons: Record<string, string> = {
      merge: 'call_merge',
      split: 'call_split',
      sign: 'draw',
      compress: 'compress',
      convert: 'transform',
      edit: 'edit'
    };
    return icons[this.activeTool() || ''] || 'apps';
  }

  activeToolColor() {
    const colors: Record<string, string> = {
      merge: '#FF4B4B',
      split: '#4B7BFF',
      sign: '#FFB800',
      compress: '#00C2FF',
      convert: '#8E4BFF',
      edit: '#FF4B91'
    };
    return colors[this.activeTool() || ''] || '#0066CC';
  }

  onNavigate(view: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.view.set(view as any);
    if (view !== 'tool-exec') this.activeTool.set(null);
  }

  onSelectTool(toolId: string) {
    this.activeTool.set(toolId);
    this.view.set('tool-exec');
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []) as File[];
    if (files.length === 0) return;

    try {
      let result: Uint8Array | null = null;
      
      if (this.activeTool() === 'merge') {
        result = await this.pdfService.mergePdfs(files);
      } else if (this.activeTool() === 'split') {
        const splitResults = await this.pdfService.splitPdf(files[0], [{ start: 1, end: 1 }]);
        result = splitResults[0];
      } else {
        const buffer = await files[0].arrayBuffer();
        result = new Uint8Array(buffer);
      }

      if (result) {
        this.processedPdfData.set(result);
        this.view.set('result');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
    }
  }

  onDownload() {
    const data = this.processedPdfData();
    if (data) {
      this.pdfService.downloadPdf(data, `processed_${Date.now()}.pdf`);
    }
  }
}
