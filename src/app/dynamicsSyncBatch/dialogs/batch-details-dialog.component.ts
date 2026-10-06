import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InvoiceSyncDetailsDialogComponent } from '../../sendDataToDynamics/dialogs/invoice-sync-details-dialog.component';
import {
  DynamicsRequestPayloadDialogComponent
} from '../../sendDataToDynamics/dialogs/dynamics-request-payload-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  applyCreatedSyncPresentation,
  DynamicsSyncBatch,
  DynamicsSyncItem,
  findCustomerSegmentConfigurationMessage
} from '../dynamicsSyncBatch.model';
import { openCustomerSegmentErrorDialog } from './customer-segment-error-dialog.component';
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
    'requestJson',
    'responseCode',
    'responseStatus',
    'response',
    'syncDate'
  ];

  private pollSub: Subscription | null = null;
  private pollIntervalMs = 10000;
  private customerSegmentErrorShown = false;
  private readonly batchId: number;
  readonly syncSource: 'invoice' | 'creditNote';
  readonly transientSyncProcessingMessage =
    'The process is currently being synced. Please do not consider this the final response. Please wait 2–3 seconds. The system will provide the final status shortly.';

  constructor(
    public dialogRef: MatDialogRef<BatchDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: BatchDetailsDialogData,
    private service: DynamicsSyncBatchService,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog
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

  /** Shown while the batch is still running or has pending line items. */
  get showSyncProcessingNotice(): boolean {
    return this.isBatchStillSettling(this.selectedBatch);
  }

  /** Stronger flash when a row briefly shows E-Invoicing Y/N bad request before retry. */
  get syncProcessingNoticeFlashing(): boolean {
    if (!this.isBatchStillSettling(this.selectedBatch)) {
      return false;
    }
    return (this.selectedBatch?.items || []).some((item) => this.isEInvoicingYnTransientItem(item));
  }

  ngOnInit(): void {
    if (this.batchId <= 0) {
      this.showMessage('Invalid batch.');
      return;
    }

    this.loadDetails();
    this.startBatchPolling();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
    this.setSyncBackdropBlur(false);
  }

  refreshDetails(): void {
    this.loadDetails();
  }

  close(): void {
    this.dialogRef.close();
  }

  openLineItemSyncDetails(item: DynamicsSyncItem): void {
    if (!item) {
      return;
    }

    if (this.isCreditNoteView) {
      const invoiceCreditNoteId = Number(item.invoiceID || 0);
      if (!invoiceCreditNoteId) {
        return;
      }

      this.dialog.open(InvoiceSyncDetailsDialogComponent, {
        width: '520px',
        maxWidth: '520px',
        maxHeight: '90vh',
        panelClass: 'sdd-invoice-sync-details-panel',
        autoFocus: false,
        data: {
          documentKind: 'creditNote',
          title: 'Credit Note & Dynamics Sync Details',
          invoiceCreditNoteId,
          row: {
            invoiceCreditNoteID: invoiceCreditNoteId,
            creditNoteNumberWithPrefix: item.invoiceNumberWithPrefix,
            creditNoteSyncStatus: item.syncStatus,
            syncDate: item.syncDate,
            syncTime: item.syncTime,
            dynamicsResponse: item.response,
            dynamicsResponseCode: item.responseCode,
            dynamicsResponseStatus: item.responseStatus,
            dynamicsResponseDate: item.responseDate,
            dynamicsResponseTime: item.responseTime
          }
        }
      });
      return;
    }

    const invoiceId = Number(item.invoiceID || 0);
    if (!invoiceId) {
      return;
    }

    this.dialog.open(InvoiceSyncDetailsDialogComponent, {
      width: '520px',
      maxWidth: '520px',
      maxHeight: '90vh',
      panelClass: 'sdd-invoice-sync-details-panel',
      autoFocus: false,
      data: {
        documentKind: 'invoice',
        invoiceId,
        row: {
          invoiceID: invoiceId,
          invoiceNumberWithPrefix: item.invoiceNumberWithPrefix,
          invoiceSyncStatus: item.syncStatus,
          syncDate: item.syncDate,
          syncTime: item.syncTime,
          dynamicsResponse: item.response,
          dynamicsResponseCode: item.responseCode,
          dynamicsResponseStatus: item.responseStatus,
          dynamicsResponseDate: item.responseDate,
          dynamicsResponseTime: item.responseTime
        }
      }
    });
  }

  openRequestPayloadDialog(item: DynamicsSyncItem, event?: MouseEvent): void {
    event?.stopPropagation();
    event?.preventDefault();

    this.dialog.open(DynamicsRequestPayloadDialogComponent, {
      width: '720px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'sdd-dynamics-request-payload-panel',
      autoFocus: false,
      data: {
        title: 'Request JSON',
        requestPayload: item?.requestPayload
      }
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

  formatResponseCode(item: DynamicsSyncItem): string {
    return applyCreatedSyncPresentation({ ...item }).responseCode || '-';
  }

  formatResponseStatus(item: DynamicsSyncItem): string {
    const status = applyCreatedSyncPresentation({ ...item }).responseStatus || '-';
    if (String(status).includes('is not configured with Customer Segment')) {
      return '—';
    }
    return status;
  }

  formatResponseBody(response?: string): string {
    const raw = String(response ?? '').trim();
    if (raw.includes('is not configured with Customer Segment')) {
      return '—';
    }
    if (!raw) {
      return '-';
    }
    if (!raw.startsWith('{') && !raw.startsWith('[')) {
      return raw;
    }
    try {
      const parsed = JSON.parse(raw);
      const messages = this.extractErrorMessagesFromJson(parsed);
      return messages.length ? messages.join(' | ') : '-';
    } catch {
      return raw;
    }
  }

  getResponseTooltip(item: DynamicsSyncItem): string {
    const display = this.formatResponseBody(item?.response);
    return display === '-' ? '' : display;
  }

  private extractErrorMessagesFromJson(data: unknown): string[] {
    const messages: string[] = [];
    const add = (value: unknown) => {
      if (value === null || value === undefined) {
        return;
      }
      const text = String(value).trim();
      if (text) {
        messages.push(text);
      }
    };

    if (data === null || data === undefined) {
      return messages;
    }
    if (typeof data === 'string') {
      add(data);
      return messages;
    }
    if (Array.isArray(data)) {
      data.forEach((entry) => {
        this.extractErrorMessagesFromJson(entry).forEach((msg) => messages.push(msg));
      });
      return [...new Set(messages)];
    }
    if (typeof data !== 'object') {
      return messages;
    }

    const record = data as Record<string, unknown>;
    const errorNode = record.error ?? record.Error;
    if (typeof errorNode === 'string') {
      add(errorNode);
    } else if (errorNode && typeof errorNode === 'object') {
      const err = errorNode as Record<string, unknown>;
      add(err.message ?? err.Message);
      add(err.error_description ?? err.ErrorDescription);
      const inner = err.innererror ?? err.InnerError;
      if (inner && typeof inner === 'object') {
        const innerRecord = inner as Record<string, unknown>;
        add(innerRecord.message ?? innerRecord.Message);
      }
    }

    const details = record.details ?? record.Details;
    if (Array.isArray(details)) {
      details.forEach((detail) => {
        if (detail && typeof detail === 'object') {
          const row = detail as Record<string, unknown>;
          add(row.message ?? row.Message);
        }
      });
    }

    const errors = record.errors ?? record.Errors;
    if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
      Object.values(errors as Record<string, unknown>).forEach((value) => {
        if (Array.isArray(value)) {
          value.forEach((part) => add(part));
        } else {
          add(value);
        }
      });
    }

    return [...new Set(messages)];
  }

  isBatchStillSettling(batch: DynamicsSyncBatch | null): boolean {
    if (!batch) {
      return this.detailLoading;
    }
    const status = String(batch.batchStatus || '').trim().toLowerCase();
    if (status === 'processing') {
      return true;
    }
    if (this.getPendingCount(batch) > 0) {
      return true;
    }
    return (batch.items || []).some((item) => {
      const sync = String(item.syncStatus || '').trim().toLowerCase();
      return sync === 'processing' || sync === 'unprocessed';
    });
  }

  private isEInvoicingYnTransientItem(item: DynamicsSyncItem): boolean {
    if (!item || !this.isBadRequestSyncItem(item)) {
      return false;
    }
    const haystack = [
      item.response,
      item.responseStatus,
      this.formatResponseBody(item.response)
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes('e-invoicing') || haystack.includes('einvoicing');
  }

  private isBadRequestSyncItem(item: DynamicsSyncItem): boolean {
    const syncStatus = String(item.syncStatus || '').trim().toLowerCase();
    if (syncStatus === 'successful') {
      return false;
    }
    const code = String(item.responseCode || '').trim();
    const statusKey = String(item.responseStatus || '').replace(/\s+/g, '').toLowerCase();
    const statusText = String(item.responseStatus || '').toLowerCase();
    return (
      code === '400'
      || statusKey === 'badrequest'
      || statusKey.includes('400')
      || statusText.includes('bad request')
    );
  }

  private startBatchPolling(): void {
    this.pollSub?.unsubscribe();
    this.pollIntervalMs = this.showSyncProcessingNotice ? 3000 : 10000;
    this.pollSub = timer(this.pollIntervalMs, this.pollIntervalMs)
      .pipe(switchMap(() => this.service.getBatch(this.batchId)))
      .subscribe({
        next: (detail) => {
          this.selectedBatch = detail;
          this.data?.onBatchLoaded?.(detail);
          this.reconcileBatchPollingInterval();
          this.applySyncProcessingUiState();
          this.tryShowCustomerSegmentErrorPopup(detail);
          this.changeDetectorRef.markForCheck();
        },
        error: () => undefined
      });
  }

  private reconcileBatchPollingInterval(): void {
    const desiredMs = this.showSyncProcessingNotice ? 3000 : 10000;
    if (desiredMs === this.pollIntervalMs) {
      return;
    }
    this.startBatchPolling();
  }

  private applySyncProcessingUiState(): void {
    this.setSyncBackdropBlur(this.showSyncProcessingNotice);
  }

  private setSyncBackdropBlur(active: boolean): void {
    const backdrop = this.getDialogBackdropElement();
    if (!backdrop) {
      return;
    }
    backdrop.classList.toggle('dsb-sync-processing-backdrop', active);
  }

  private getDialogBackdropElement(): HTMLElement | null {
    const overlayRef = this.getDialogOverlayRef();
    return overlayRef?.backdropElement ?? null;
  }

  private getDialogOverlayRef(): OverlayRef | null {
    const ref = this.dialogRef as MatDialogRef<BatchDetailsDialogComponent> & {
      _overlayRef?: OverlayRef;
      overlayRef?: OverlayRef;
    };
    return ref._overlayRef ?? ref.overlayRef ?? null;
  }

  private loadDetails(): void {
    this.detailLoading = true;
    this.errorMessage = '';
    this.applySyncProcessingUiState();
    this.changeDetectorRef.markForCheck();
    this.service.getBatch(this.batchId).subscribe({
      next: (detail) => {
        this.detailLoading = false;
        this.selectedBatch = detail;
        this.data?.onBatchLoaded?.(detail);
        this.reconcileBatchPollingInterval();
        this.applySyncProcessingUiState();
        this.tryShowCustomerSegmentErrorPopup(detail);
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

  private tryShowCustomerSegmentErrorPopup(batch: DynamicsSyncBatch | null): void {
    if (this.customerSegmentErrorShown || !batch) {
      return;
    }
    const message = findCustomerSegmentConfigurationMessage(batch);
    if (!message) {
      return;
    }
    this.customerSegmentErrorShown = true;
    openCustomerSegmentErrorDialog(this.dialog, message);
  }

  private showMessage(text: string): void {
    this.snackBar.open(text, '', { duration: 3500 });
  }
}
