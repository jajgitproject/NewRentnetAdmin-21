import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DynamicsSyncBatch, DynamicsSyncItem } from './dynamicsSyncBatch.model';
import { DynamicsSyncBatchService } from './dynamicsSyncBatch.service';

@Component({
  standalone: false,
  selector: 'app-dynamics-sync-batch',
  templateUrl: './dynamicsSyncBatch.component.html',
  styleUrls: ['./dynamicsSyncBatch.component.scss']
})
export class DynamicsSyncBatchComponent implements OnInit, OnDestroy {
  batches: DynamicsSyncBatch[] = [];
  loading = false;
  selectedBatch: DynamicsSyncBatch | null = null;
  detailLoading = false;
  showDetails = false;

  batchColumns = [
    'dynamicsSyncBatchID',
    'startDate',
    'batchCreatedByName',
    'numberofItems',
    'progress',
    'numberofSuccessfulItems',
    'numberofFailedItems',
    'batchStatus',
    'actions'
  ];

  itemColumns = [
    'documentType',
    'invoiceID',
    'invoiceNumberWithPrefix',
    'syncStatus',
    'responseCode',
    'responseStatus',
    'syncDate'
  ];

  /** Where "New Sync" should return: invoice vs credit note send page. */
  syncSource: 'invoice' | 'creditNote' = 'invoice';

  private pollSub: Subscription | null = null;

  constructor(
    private service: DynamicsSyncBatchService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.applySyncSourceFromQuery(this.route.snapshot.queryParamMap.get('syncSource'));
    this.route.queryParamMap.subscribe((params) => {
      this.applySyncSourceFromQuery(params.get('syncSource'));
    });

    this.loadBatches();
    const batchId = Number(this.route.snapshot.queryParamMap.get('batchId') || 0);
    if (batchId > 0) {
      this.openDetails({ dynamicsSyncBatchID: batchId } as DynamicsSyncBatch);
    }

    this.pollSub = timer(0, 10000).pipe(
      switchMap(() => this.service.listBatches(50))
    ).subscribe({
      next: (batches) => {
        this.batches = batches || [];
        if (this.showDetails && this.selectedBatch) {
          this.service.getBatch(this.selectedBatch.dynamicsSyncBatchID).subscribe({
            next: (detail) => {
              this.selectedBatch = detail;
            },
            error: () => undefined
          });
        }
      },
      error: () => undefined
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  loadBatches(): void {
    this.loading = true;
    this.service.listBatches(50).subscribe({
      next: (batches) => {
        this.loading = false;
        this.batches = batches || [];
      },
      error: () => {
        this.loading = false;
        this.showMessage('Failed to load batches.');
      }
    });
  }

  openDetails(batch: DynamicsSyncBatch): void {
    this.showDetails = true;
    this.detailLoading = true;
    this.service.getBatch(batch.dynamicsSyncBatchID).subscribe({
      next: (detail) => {
        this.detailLoading = false;
        this.selectedBatch = detail;
        this.applySyncSourceFromBatch(detail);
      },
      error: () => {
        this.detailLoading = false;
        this.showMessage('Failed to load batch details.');
      }
    });
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedBatch = null;
  }

  refreshDetails(): void {
    if (!this.selectedBatch) {
      return;
    }
    this.openDetails(this.selectedBatch);
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

  getActiveBatchCount(): number {
    return (this.batches || []).filter((b) => {
      const status = String(b.batchStatus || '').toLowerCase();
      return status === 'processing' || !b.endDate;
    }).length;
  }

  getTotalSuccessCount(): number {
    return (this.batches || []).reduce((sum, b) => sum + (b.numberofSuccessfulItems || 0), 0);
  }

  getTotalFailedCount(): number {
    return (this.batches || []).reduce((sum, b) => sum + (b.numberofFailedItems || 0), 0);
  }

  getProgressPercent(batch: DynamicsSyncBatch): number {
    const total = batch?.numberofItems || 0;
    if (total <= 0) {
      return 0;
    }
    return Math.min(100, Math.round((this.getProcessedCount(batch) / total) * 100));
  }

  isBatchSelected(batch: DynamicsSyncBatch): boolean {
    return this.showDetails
      && this.selectedBatch?.dynamicsSyncBatchID === batch?.dynamicsSyncBatchID;
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

  trackItem(_index: number, item: DynamicsSyncItem): number {
    return item.dynamicsSyncID;
  }

  get newSyncRoute(): string {
    return this.syncSource === 'creditNote'
      ? '/sendCreditNotesToDynamics'
      : '/sendDataToDynamics';
  }

  get newSyncLabel(): string {
    return this.syncSource === 'creditNote'
      ? 'Send Credit Notes To Dynamics'
      : 'Send Invoices To Dynamics';
  }

  private applySyncSourceFromQuery(value: string | null): void {
    if (value === 'creditNote') {
      this.syncSource = 'creditNote';
    } else if (value === 'invoice') {
      this.syncSource = 'invoice';
    }
  }

  private applySyncSourceFromBatch(batch: DynamicsSyncBatch | null): void {
    const items = batch?.items || [];
    if (!items.length) {
      return;
    }
    const creditNoteCount = items.filter((item) =>
      String(item.documentType || '').toLowerCase() === 'creditnote').length;
    if (creditNoteCount === items.length) {
      this.syncSource = 'creditNote';
    } else if (creditNoteCount === 0) {
      this.syncSource = 'invoice';
    }
  }

  private showMessage(text: string): void {
    this.snackBar.open(text, '', { duration: 3500 });
  }
}
