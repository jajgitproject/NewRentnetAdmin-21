// @ts-nocheck
import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

interface Document {
  title: string;
  type: string;
  size: number;
  icon: string;
  iconClass: string;
  textClass: string;
}

@Component({
  standalone: false,
    selector: 'app-document-list',
    imports: [NgClass],
    templateUrl: './document-list.component.html',
    styleUrl: './document-list.component.scss'
})
export class DocumentListComponent {
  @Input() documents: Document[] = [];

  onDelete(document: Document) {
    // Handle document deletion
  }

  onDownload(document: Document) {
    // Handle document download
  }
}


