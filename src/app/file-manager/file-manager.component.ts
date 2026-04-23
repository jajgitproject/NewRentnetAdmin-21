// @ts-nocheck
import {
  Component,
  OnInit,
  inject,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FileManagerService } from './core/file-manager.service';
import { FileElement, StorageInfo } from './core/file-manager.model';
import { FileUploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DatePipe,
    DecimalPipe,
    BreadcrumbComponent,
    MatDialogModule,
  ],
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
})
export class FileManagerComponent implements OnInit {
  private fileService = inject(FileManagerService);
  private dialog = inject(MatDialog);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  public files: FileElement[] = [];
  public storageInfo: StorageInfo | null = null;
  public currentPath: FileElement[] = [];
  public currentParentId: string | null = null;
  public viewMode: 'grid' | 'list' = 'grid';

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput.nativeElement.focus();
    }
  }

  private _searchQuery: string = '';
  public get searchQuery(): string {
    return this._searchQuery;
  }
  public set searchQuery(value: string) {
    this._searchQuery = value;
    this.updateDisplayFiles();
  }
  public filter: 'all' | 'recent' | 'starred' | 'trash' = 'all';

  breadscrums = [
    {
      title: 'File Manager',
      items: ['Apps'],
      active: 'File Manager',
    },
  ];

  ngOnInit(): void {
    this.fileService.files$.subscribe(() => {
      this.updateDisplayFiles();
    });
    this.fileService.storageInfo$.subscribe(
      (info) => (this.storageInfo = info)
    );
  }

  updateDisplayFiles(): void {
    let filtered: FileElement[];

    if (this.filter === 'starred') {
      filtered = this.fileService.getStarredFiles();
    } else if (this.filter === 'recent') {
      filtered = this.fileService.getRecentFiles();
    } else if (this.filter === 'trash') {
      filtered = this.fileService.getTrashFiles();
    } else {
      filtered = this.fileService.getFilesByParent(this.currentParentId);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((f) => f.name.toLowerCase().includes(query));
    }

    this.files = filtered;
  }

  navigateToFolder(folder: FileElement | null): void {
    if (folder) {
      if (folder.type !== 'folder') return;
      this.currentParentId = folder.id;
      this.currentPath.push(folder);
    } else {
      this.currentParentId = null;
      this.currentPath = [];
    }
    this.updateDisplayFiles();
  }

  navigateBack(index: number): void {
    if (index === -1) {
      this.navigateToFolder(null);
    } else {
      const folder = this.currentPath[index];
      this.currentPath = this.currentPath.slice(0, index + 1);
      this.currentParentId = folder.id;
      this.updateDisplayFiles();
    }
  }

  toggleStar(event: Event, file: FileElement): void {
    event.stopPropagation();
    this.fileService.toggleStar(file.id);
  }

  deleteFile(event: Event, file: FileElement): void {
    event.stopPropagation();
    this.fileService.deleteFile(file.id);
    this.updateDisplayFiles();
  }

  getFileIcon(file: FileElement): string {
    if (file.type === 'folder') return 'folder';
    switch (file.extension) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'image';
      case 'docx':
        return 'description';
      case 'xlsx':
        return 'table_chart';
      case 'zip':
        return 'folder_zip';
      default:
        return 'insert_drive_file';
    }
  }

  getIconColor(file: FileElement): string {
    if (file.type === 'folder') return file.color || '#64748b';
    switch (file.extension) {
      case 'pdf':
        return '#ef4444';
      case 'png':
      case 'jpg':
        return '#06b6d4';
      case 'docx':
        return '#3b82f6';
      case 'xlsx':
        return '#10b981';
      case 'zip':
        return '#f59e0b';
      default:
        return '#94a3b8';
    }
  }

  setFilter(filter: 'all' | 'recent' | 'starred' | 'trash'): void {
    this.filter = filter;
    // For specific filters like starred, we ignore the parentId
    if (filter === 'starred') {
      // I need a service method for this
    }
    this.updateDisplayFiles();
  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(FileUploadDialogComponent, {
      width: '550px',
      maxWidth: '95vw',
      data: { currentFolder: this.currentParentId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh or show success
      }
    });
  }
}

