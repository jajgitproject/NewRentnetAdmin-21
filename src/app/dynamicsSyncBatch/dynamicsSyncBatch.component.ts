import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BatchDetailsDialogComponent } from './dialogs/batch-details-dialog.component';
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

  /** Where "New Sync" should return: invoice vs credit note send page. */
  syncSource: 'invoice' | 'creditNote' = 'invoice';

  private pollSub: Subscription | null = null;
  private detailsDialogRef: MatDialogRef<BatchDetailsDialogComponent> | null = null;

  constructor(
    private service: DynamicsSyncBatchService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.applySyncSourceFromQuery(this.route.snapshot.queryParamMap.get('syncSource'));
    this.loadBatches();
    this.startPolling();

    const batchId = Number(this.route.snapshot.queryParamMap.get('batchId') || 0);
    if (batchId > 0) {
      this.openDetails({ dynamicsSyncBatchID: batchId } as DynamicsSyncBatch);
    }

    this.route.queryParamMap.subscribe((params) => {
      const previous = this.syncSource;
      this.applySyncSourceFromQuery(params.get('syncSource'));
      if (previous !== this.syncSource) {
        this.loadBatches();
        this.startPolling();
      }
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  loadBatches(): void {
    this.loading = true;
    this.service.listBatches(50, this.syncSource).subscribe({
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
    const batchId = batch.dynamicsSyncBatchID;
    if (!batchId) {
      return;
    }

    if (this.detailsDialogRef) {
      this.detailsDialogRef.close();
    }

    this.detailsDialogRef = this.dialog.open(BatchDetailsDialogComponent, {
      width: '960px',
      maxWidth: '95vw',
      maxHeight: '92vh',
      panelClass: 'dsb-batch-details-dialog-panel',
      autoFocus: false,
      data: {
        batchId,
        initialBatch: batch,
        syncSource: this.syncSource,
        onBatchLoaded: (detail: DynamicsSyncBatch) => this.applySyncSourceFromBatch(detail)
      }
    });

    this.detailsDialogRef.afterClosed().subscribe(() => {
      this.detailsDialogRef = null;
    });
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

  formatDateTime(dateValue?: string, timeValue?: string): string {
    if (!dateValue) {
      return '-';
    }
    const datePart = String(dateValue).split('T')[0];
    const timeRaw = timeValue ? String(timeValue) : '';
    const timePart = timeRaw && !timeRaw.startsWith('[object') ? timeRaw.substring(0, 8) : '';
    return timePart ? `${datePart} ${timePart}` : datePart;
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

  get isCreditNoteView(): boolean {
    return this.syncSource === 'creditNote';
  }

  get monitorTitle(): string {
    return this.isCreditNoteView ? 'Credit Note Batch Monitor' : 'Invoice Batch Monitor';
  }

  get monitorSubtitle(): string {
    if (this.isCreditNoteView) {
      return 'Track RentNet → Dynamics credit note sync batches in real time. Processing continues on the server even if you leave this page.';
    }
    return 'Track RentNet → Dynamics invoice sync batches in real time. Processing continues on the server even if you leave this page.';
  }

  get batchesSectionTitle(): string {
    return this.isCreditNoteView ? 'Credit Note Sync Batches' : 'Invoice Sync Batches';
  }

  get itemsColumnHeader(): string {
    return this.isCreditNoteView ? 'Credit Notes' : 'Invoices';
  }

  get syncedItemsStatLabel(): string {
    return this.isCreditNoteView ? 'Synced Credit Notes' : 'Synced Invoices';
  }

  get emptyStateDescription(): string {
    if (this.isCreditNoteView) {
      return 'Start a credit note batch from Send Credit Notes To Dynamics to monitor progress here.';
    }
    return 'Start an invoice batch from Send Invoices To Dynamics to monitor progress here.';
  }

  private startPolling(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = timer(0, 10000).pipe(
      switchMap(() => this.service.listBatches(50, this.syncSource))
    ).subscribe({
      next: (batches) => {
        this.batches = batches || [];
      },
      error: () => undefined
    });
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
