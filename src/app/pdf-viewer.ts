import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex flex-col h-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
      <!-- Toolbar -->
      <div class="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button (click)="prevPage()" [disabled]="currentPage === 1" class="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <span class="text-sm font-medium">{{ currentPage }} / {{ totalPages }}</span>
          <button (click)="nextPage()" [disabled]="currentPage === totalPages" class="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
        
        <div class="flex items-center gap-2">
          <button (click)="zoomOut()" class="p-1 hover:bg-gray-100 rounded">
            <mat-icon>zoom_out</mat-icon>
          </button>
          <span class="text-sm font-medium">{{ (scale * 100).toFixed(0) }}%</span>
          <button (click)="zoomIn()" class="p-1 hover:bg-gray-100 rounded">
            <mat-icon>zoom_in</mat-icon>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button (click)="download.emit()" class="btn-secondary py-1 px-3 text-xs">
            <mat-icon class="text-sm">download</mat-icon>
            Download
          </button>
        </div>
      </div>

      <!-- Canvas Container -->
      <div class="flex-1 overflow-auto p-8 flex justify-center items-start" #container>
        <div class="relative shadow-2xl bg-white">
          <canvas #pdfCanvas></canvas>
          @if (isSigning) {
            <div 
              class="absolute inset-0 cursor-crosshair z-10"
              (mousedown)="startDrawing($event)"
              (mousemove)="draw($event)"
              (mouseup)="stopDrawing()"
            ></div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    canvas { display: block; }
  `]
})
export class PdfViewer implements AfterViewInit, OnDestroy {
  @Input() pdfData?: Uint8Array;
  @Input() isSigning = false;
  @Output() download = new EventEmitter<void>();
  @Output() signatureAdded = new EventEmitter<{ x: number, y: number, page: number, image: string }>();

  @ViewChild('pdfCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pdfjsLib: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pdfDoc: any;
  currentPage = 1;
  totalPages = 0;
  scale = 1.0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private renderTask: any;

  private platformId = inject(PLATFORM_ID);

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.pdfjsLib = await import('pdfjs-dist');
      this.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${this.pdfjsLib.version}/pdf.worker.min.js`;
      
      if (this.pdfData) {
        this.loadPdf();
      }
    }
  }

  ngOnDestroy() {
    if (this.renderTask) {
      this.renderTask.cancel();
    }
  }

  async loadPdf() {
    if (!this.pdfData || !this.pdfjsLib) return;
    
    try {
      const loadingTask = this.pdfjsLib.getDocument({ data: this.pdfData });
      this.pdfDoc = await loadingTask.promise;
      this.totalPages = this.pdfDoc.numPages;
      this.renderPage();
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }

  async renderPage() {
    if (!this.pdfDoc) return;

    if (this.renderTask) {
      this.renderTask.cancel();
    }

    const page = await this.pdfDoc.getPage(this.currentPage);
    const viewport = page.getViewport({ scale: this.scale });
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d')!;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    this.renderTask = page.render(renderContext);
    await this.renderTask.promise;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.renderPage();
    }
  }

  zoomIn() {
    this.scale += 0.2;
    this.renderPage();
  }

  zoomOut() {
    if (this.scale > 0.4) {
      this.scale -= 0.2;
      this.renderPage();
    }
  }

  // Signature drawing logic (simplified for demo)
  private drawing = false;
  private signaturePath: { x: number, y: number }[] = [];

  startDrawing(event: MouseEvent) {
    this.drawing = true;
    this.signaturePath = [];
    this.addPoint(event);
  }

  draw(event: MouseEvent) {
    if (!this.drawing) return;
    this.addPoint(event);
    // In a real app, we'd draw on a temporary canvas overlay
  }

  stopDrawing() {
    if (!this.drawing) return;
    this.drawing = false;
    
    // For this demo, we'll just emit a fixed signature at the click location
    // In a real app, we'd convert the drawing path to a PNG
  }

  private addPoint(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.signaturePath.push({ x, y });
  }
}
