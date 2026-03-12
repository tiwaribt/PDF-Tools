import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-tool-grid',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (tool of tools; track tool.id) {
        <button 
          (click)="selectTool.emit(tool.id)"
          class="tool-card text-left w-full"
        >
          <div 
            [style.background-color]="tool.color"
            class="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-black/5"
          >
            <mat-icon>{{ tool.icon }}</mat-icon>
          </div>
          <h3 class="text-lg font-bold mb-1">{{ tool.name }}</h3>
          <p class="text-sm text-gray-500 leading-relaxed">{{ tool.description }}</p>
          
          <div class="mt-6 flex items-center text-[#0066CC] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Open Tool</span>
            <mat-icon class="text-sm ml-1">chevron_right</mat-icon>
          </div>
        </button>
      }
    </div>
  `
})
export class ToolGrid {
  @Output() selectTool = new EventEmitter<string>();

  tools: Tool[] = [
    {
      id: 'merge',
      name: 'Merge PDF',
      description: 'Combine multiple PDF files into one single document in seconds.',
      icon: 'call_merge',
      color: '#FF4B4B'
    },
    {
      id: 'split',
      name: 'Split PDF',
      description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
      icon: 'call_split',
      color: '#4B7BFF'
    },
    {
      id: 'sign',
      name: 'Sign PDF',
      description: 'Sign a document or request signatures. Add your signature to a PDF.',
      icon: 'draw',
      color: '#FFB800'
    },
    {
      id: 'compress',
      name: 'Compress PDF',
      description: 'Reduce the size of your PDF without losing quality for easier sharing.',
      icon: 'compress',
      color: '#00C2FF'
    },
    {
      id: 'convert',
      name: 'Convert PDF',
      description: 'Convert images and other formats to PDF or export PDF to other formats.',
      icon: 'transform',
      color: '#8E4BFF'
    },
    {
      id: 'edit',
      name: 'Edit PDF',
      description: 'Add text, shapes, comments and highlights to a PDF file.',
      icon: 'edit',
      color: '#FF4B91'
    }
  ];
}
