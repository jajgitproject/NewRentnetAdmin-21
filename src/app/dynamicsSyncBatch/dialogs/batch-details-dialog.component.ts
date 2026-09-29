import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DynamicsSyncBatch } from '../dynamicsSyncBatch.model';
import { DynamicsSyncBatchService } from '../dynamicsSyncBatch.service';

export interface BatchDetailsDialogData {
  batchId: number;
  initialBatch?: DynamicsSyncBatch;
  syncSource?: 'invoice' | 'creditNote';
  onBatchLoaded?: (batch: DynamicsSyncBatch) => void;
}

@Component({
  standalone: false,
  selector: 'app-dynamics-sync-batch-details-dialog',
  templateUrl: './batch-details-dialog.component.html',
  styleUrls: ['./batch-details-dialog.component.scss']
})
export class BatchDetailsDialogComponent implements OnInit, OnDestroy {
  selectedBatch: DynamicsSyncBatch | null = null;
  detailLoading = true;
  errorMessage = '';

  itemColumns = [
    'documentType',
    'invoiceID',
    'invoiceNumberWithPrefix',
    'syncStatus',
    'responseCode',
    'responseStatus',
    'syncDate'
  ];

  private pollSub: Subscription | null = null;
  private readonly batchId: number;
  readonly syncSource: 'invoice' | 'creditNote';

  constructor(
    public dialogRef: MatDialogRef<BatchDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: BatchDetailsDialogData,
    private service: DynamicsSyncBatchService,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.batchId = Number(data?.batchId || 0);
    this.syncSource = data?.syncSource === 'creditNote' ? 'creditNote' : 'invoice';
    if (data?.initialBatch) {
      this.selectedBatch = data.initialBatch;
    }
  }

  get isCreditNoteView(): boolean {
    return this.syncSource === 'creditNote';
  }

  get detailDialogTitle(): string {
    return this.isCreditNoteView ? 'Credit Note Sync Details' : 'Invoice Sync Details';
  }

  get lineItemsSectionTitle(): string {
    return this.isCreditNoteView ? 'Credit Note Line Items' : 'Invoice Line Items';
  }

  get lineItemsSectionIcon(): string {
    return this.isCreditNoteView ? 'fas fa-file-invoice-dollar' : 'fas fa-file-invoice';
  }

  get documentIdColumnHeader(): string {
    return this.isCreditNoteView ? 'Credit Note ID' : 'Invoice ID';
  }

  get documentNoColumnHeader(): string {
    return this.isCreditNoteView ? 'Credit Note No.' : 'Invoice No.';
  }

  get noLineItemsMessage(): string {
    return this.isCreditNoteView
      ? 'No credit note items loaded for this batch.'
      : 'No invoice items loaded for this batch.';
  }

  ngOnInit(): void {
    if (this.batchId <= 0) {
      this.showMessage('Invalid batch.');
      return;
    }

    this.loadDetails();

    this.pollSub = timer(10000, 10000).pipe(
      switchMap(() => this.service.getBatch(this.batchId))
    ).subscribe({
      next: (detail) => {
        this.selectedBatch = detail;
        this.data?.onBatchLoaded?.(detail);
        this.changeDetectorRef.markForCheck();
      },
      error: () => undefined
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  refreshDetails(): void {
    this.loadDetails();
  }

  close(): void {
    this.dialogRef.close();
  }

  getStatusClass(status: string): string {
    const value = String(status || '').toLowerCase();
    if (value === 'completed' || value === 'successful') {
      return 'dsb-badge dsb-badge--success';
    }
    if (value === 'processing' || value === 'unprocessed') {
      return 'dsb-badge dsb-badge--info';
    }
    if (value === 'failed' || value === 'completedwitherrors') {
      return 'dsb-badge dsb-badge--warning';
    }
    return 'dsb-badge dsb-badge--muted';
  }

  getStatusIcon(status: string): string {
    const value = String(status || '').toLowerCase();
    if (value === 'completed' || value === 'successful') {
      return 'fas fa-check-circle';
    }
    if (value === 'processing') {
      return 'fas fa-spinner';
    }
    if (value === 'unprocessed') {
      return 'fas fa-clock';
    }
    if (value === 'failed' || value === 'completedwitherrors') {
      return 'fas fa-exclamation-circle';
    }
    return 'fas fa-circle';
  }

  formatBatchStatus(status: string): string {
    const value = String(status || '').trim();
    if (!value) {
      return 'Processing';
    }
    if (value === 'CompletedWithErrors') {
      return 'Completed With Errors';
    }
    return value;
  }

  getProgressPercent(batch: DynamicsSyncBatch): number {
    const total = batch?.numberofItems || 0;
    if (total <= 0) {
      return 0;
    }
    return Math.min(100, Math.round((this.getProcessedCount(batch) / total) * 100));
  }

  getProcessedCount(batch: DynamicsSyncBatch): number {
    return (batch?.numberofSuccessfulItems || 0) + (batch?.numberofFailedItems || 0);
  }

  getPendingCount(batch: DynamicsSyncBatch): number {
    const total = batch?.numberofItems || 0;
    return Math.max(total - this.getProcessedCount(batch), 0);
  }

  formatDateTime(dateValue?: string, timeValue?: string): string {
    if (!dateValue) {
      return '-';
    }
    const datePart = String(dateValue).split('T')[0];
    const timeRaw = timeValue ? String(timeValue) : '';
    const timePart = timeRaw && !timeRaw.startsWith('[object') ? timeRaw.substring(0, 8) : '';
    return timePart ? `${datePart} ${timePart}` : datePart;
  }

  formatResponseCode(item: { responseCode?: string; responseStatus?: string; syncStatus?: string }): string {
    const code = String(item?.responseCode || '').trim();
    const status = String(item?.responseStatus || '').trim();
    const syncStatus = String(item?.syncStatus || '').trim();
    if (status === 'Created' || status === 'AlreadyExists' || (syncStatus === 'Successful' && code === '400')) {
      return '201';
    }
    return code || '-';
  }

  private loadDetails(): void {
    this.detailLoading = true;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();
    this.service.getBatch(this.batchId).subscribe({
      next: (detail) => {
        this.detailLoading = false;
        this.selectedBatch = detail;
        this.data?.onBatchLoaded?.(detail);
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.detailLoading = false;
        this.errorMessage = 'Failed to load batch details.';
        this.showMessage(this.errorMessage);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  private showMessage(text: string): void {
    this.snackBar.open(text, '', { duration: 3500 });
  }
}
