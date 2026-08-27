// @ts-nocheck
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import moment from 'moment';
import { extractExportErrorMessage } from './export-job.helper';
import { StoredMisExportsService } from './stored-mis-exports.service';

@Component({
  selector: 'app-stored-mis-exports',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="stored-mis-exports" *ngIf="loaded">
      <div class="stored-mis-exports-title">Stored exports ({{ storedFileCount }}/{{ storedFileLimit }})</div>
      <p class="stored-mis-exports-hint" *ngIf="storedFileCount >= storedFileLimit">
        Delete one file before starting another export.
      </p>
      <p class="stored-mis-exports-empty" *ngIf="!files.length">No stored CSV files yet.</p>
      <div class="stored-mis-exports-row" *ngFor="let file of files">
        <div class="stored-mis-exports-meta">
          <strong>{{ file.jobTypeLabel || file.JobTypeLabel || file.jobType || file.JobType }}</strong>
          <span>{{ file.fileName || file.FileName }}</span>
          <span>{{ file.rowsExported || file.RowsExported || 0 }} rows</span>
          <span *ngIf="file.completedOn || file.CompletedOn">{{ formatDate(file.completedOn || file.CompletedOn) }}</span>
        </div>
        <div class="stored-mis-exports-actions">
          <button mat-stroked-button type="button" (click)="download(file)" [disabled]="busy">Download</button>
          <button mat-stroked-button color="warn" type="button" (click)="remove(file)" [disabled]="busy">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stored-mis-exports { margin-top: 16px; padding: 12px; border: 1px solid #e0e0e0; border-radius: 6px; background: #fafafa; }
    .stored-mis-exports-title { font-weight: 600; margin-bottom: 8px; }
    .stored-mis-exports-hint, .stored-mis-exports-empty { margin: 0 0 8px; font-size: 13px; color: #5f6368; }
    .stored-mis-exports-row { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; padding: 8px 0; border-top: 1px solid #eee; }
    .stored-mis-exports-meta { display: flex; flex-direction: column; font-size: 13px; }
    .stored-mis-exports-actions { display: flex; gap: 8px; align-items: center; }
  `]
})
export class StoredMisExportsComponent implements OnInit {
  @Output() changed = new EventEmitter<void>();
  files: any[] = [];
  storedFileCount = 0;
  storedFileLimit = 5;
  loaded = false;
  busy = false;

  constructor(
    private storedMisExportsService: StoredMisExportsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.storedMisExportsService.listStored().subscribe(
      (result: any) => {
        this.files = result?.files ?? result?.Files ?? [];
        this.storedFileCount = result?.storedFileCount ?? result?.StoredFileCount ?? this.files.length;
        this.storedFileLimit = result?.storedFileLimit ?? result?.StoredFileLimit ?? 5;
        this.loaded = true;
      },
      () => {
        this.loaded = true;
      }
    );
  }

  formatDate(value: any) {
    if (!value) {
      return '';
    }
    return moment(value).format('DD MMM YYYY HH:mm');
  }

  async download(file: any) {
    const jobId = file?.jobId ?? file?.JobId;
    if (!jobId || this.busy) {
      return;
    }
    this.busy = true;
    this.storedMisExportsService.download(jobId).subscribe(
      async (blob: Blob) => {
        this.busy = false;
        if (!blob || blob.size === 0) {
          this.snackBar.open('Export file is empty or unavailable.', 'Close', { duration: 4000 });
          return;
        }
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file?.fileName || file?.FileName || `MIS_${jobId}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.refresh();
        this.changed.emit();
      },
      async (error) => {
        this.busy = false;
        this.snackBar.open(await extractExportErrorMessage(error, 'Download failed.'), 'Close', { duration: 4000 });
      }
    );
  }

  async remove(file: any) {
    const jobId = file?.jobId ?? file?.JobId;
    if (!jobId || this.busy) {
      return;
    }
    this.busy = true;
    this.storedMisExportsService.delete(jobId).subscribe(
      () => {
        this.busy = false;
        this.snackBar.open('Stored export deleted.', 'Close', { duration: 3000 });
        this.refresh();
        this.changed.emit();
      },
      async (error) => {
        this.busy = false;
        this.snackBar.open(await extractExportErrorMessage(error, 'Delete failed.'), 'Close', { duration: 4000 });
      }
    );
  }
}
