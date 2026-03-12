import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <aside class="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div class="p-6 flex items-center gap-3">
        <div class="w-10 h-10 bg-[#0066CC] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0066CC]/20">
          <mat-icon>picture_as_pdf</mat-icon>
        </div>
        <span class="text-xl font-bold tracking-tight">PDF Master</span>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-1">
        <button 
          (click)="navigate.emit('home')"
          class="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group"
        >
          <mat-icon class="text-gray-400 group-hover:text-[#0066CC]">home</mat-icon>
          <span class="font-medium">Home</span>
        </button>
        
        <button 
          (click)="navigate.emit('tools')"
          class="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group"
        >
          <mat-icon class="text-gray-400 group-hover:text-[#0066CC]">apps</mat-icon>
          <span class="font-medium">All Tools</span>
        </button>

        <div class="pt-6 pb-2 px-4">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Files</span>
        </div>
        
        <div class="px-4 py-8 text-center">
          <mat-icon class="text-gray-200 text-4xl mb-2">folder_open</mat-icon>
          <p class="text-xs text-gray-400">No recent files</p>
        </div>
      </nav>

      <div class="p-4 border-t border-gray-100">
        <div class="bg-gray-50 rounded-2xl p-4">
          <p class="text-xs font-semibold text-gray-500 mb-1">PRO PLAN</p>
          <p class="text-sm text-gray-700 mb-3">Get unlimited access to all PDF tools.</p>
          <button class="w-full py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Sidebar {
  @Output() navigate = new EventEmitter<string>();
}
