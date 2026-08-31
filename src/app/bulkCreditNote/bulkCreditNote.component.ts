import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, Subscription, timer } from 'rxjs';
import { map, startWith, switchMap, takeWhile } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { GeneralService } from '../general/general.service';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
import {
  getCustomerDisplayLabel,
  getCustomerDisplayValue,
  getCustomerIdValue,
  getCustomerNameFromAutocomplete,
  getCustomerTallyId,
  resolveCustomerFromAutocomplete,
} from '../shared/customer-autocomplete.util';
import { BulkCreditNoteService } from './bulkCreditNote.service';
import { BulkCreditNoteCandidateRow, BulkCreditNotePreviewResult, BulkCreditNoteRun } from './bulkCreditNote.model';

@Component({
  standalone: false,
  selector: 'app-bulk-credit-note',
  templateUrl: './bulkCreditNote.component.html',
  styleUrls: ['./bulkCreditNote.component.scss'],
})
export class BulkCreditNoteComponent implements OnInit, OnDestroy {
  selectedTabIndex = 0;
  maxInvoices = 50;
  maxInvoicesLimit = 200;
  batchSize = 50;
  allowManual = true;

  fromDate: Date | null = null;
  toDate: Date | null = null;
  invoiceNumber = '';
  reason = '';
  customerCtrl = new FormControl('');
  customerList: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]> = of([]);
  selectedCustomerID = 0;

  preview: BulkCreditNotePreviewResult | null = null;
  previewLoading = false;
  selectedInvoiceIds: number[] = [];
  jobRunning = false;
  activeRun: BulkCreditNoteRun | null = null;
  recentRuns: BulkCreditNoteRun[] = [];
  recentRunsError = '';
  recentRunsLoading = false;
  recentDateFrom: Date | null = null;
  recentDateTo: Date | null = null;

  currentBatch = 0;
  totalBatches = 0;
  sessionProcessedCount = 0;
  sessionTargetCount = 0;

  displayedColumns = ['invoiceNumberWithPrefix', 'customerName', 'creditNoteNumber', 'itemStatus', 'errorMessage'];
  previewColumns = [
    'select',
    'invoiceNumberWithPrefix',
    'invoiceDate',
    'customerName',
    'invoiceTotalAmountAfterGST',
    'pendingAmount',
    'branchName',
  ];
  recentColumns = ['bulkCreditNoteRunId', 'batchDate', 'jobStatus', 'createdCount', 'actions'];

  getCustomerDisplayLabel = getCustomerDisplayLabel;
  getCustomerDisplayValue = getCustomerDisplayValue;

  private pollSub: Subscription | null = null;
  private activeRunId: number | null = null;
  private runAllBatches = false;
  private sessionExcludeIds: number[] = [];
  private sessionPendingIds: number[] = [];
  private nextBatchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private service: BulkCreditNoteService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.toDate = today;
    this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.service.getLimits().subscribe({
      next: (limits) => {
        this.maxInvoices = limits.defaultMaxInvoices || 50;
        this.maxInvoicesLimit = limits.maxInvoicesLimit || 200;
        this.batchSize = limits.batchSize || 50;
        this.allowManual = limits.allowManual !== false;
      },
      error: () => undefined,
    });
    this.loadCustomers();
    this.loadRecentRuns();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
    this.clearNextBatchTimer();
    this.runAllBatches = false;
  }

  get estimatedBatchCount(): number {
    const willProcess = this.preview?.willProcessCount || 0;
    const size = this.preview?.batchSize || this.batchSize || 50;
    if (willProcess <= 0) {
      return 0;
    }
    return Math.max(1, Math.ceil(willProcess / size));
  }

  get selectedCount(): number {
    return this.selectedInvoiceIds.length;
  }

  get allPreviewSelected(): boolean {
    const invoices = this.preview?.invoices || [];
    return invoices.length > 0 && invoices.every((row) => this.isRowSelected(row.invoiceID));
  }

  get somePreviewSelected(): boolean {
    const invoices = this.preview?.invoices || [];
    const selected = invoices.filter((row) => this.isRowSelected(row.invoiceID)).length;
    return selected > 0 && selected < invoices.length;
  }

  displayCustomer = (value: string): string => {
    const selected = resolveCustomerFromAutocomplete(value, this.customerList);
    if (!selected) {
      return getCustomerNameFromAutocomplete(value);
    }
    const tally = getCustomerTallyId(selected);
    return tally ? `${selected.customerName} (${tally})` : selected.customerName || '';
  };

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    if (index === 1) {
      this.loadRecentRuns();
    }
  }

  onCustomerSelected(value: string): void {
    const selected = resolveCustomerFromAutocomplete(value, this.customerList);
    this.selectedCustomerID = selected?.customerID > 0 ? selected.customerID : 0;
  }

  isRowSelected(invoiceID: number): boolean {
    return this.selectedInvoiceIds.indexOf(Number(invoiceID)) >= 0;
  }

  setRowSelected(invoiceID: number, checked: boolean): void {
    const id = Number(invoiceID);
    if (checked) {
      if (this.selectedInvoiceIds.indexOf(id) < 0) {
        this.selectedInvoiceIds = this.selectedInvoiceIds.concat(id);
      }
      return;
    }
    this.selectedInvoiceIds = this.selectedInvoiceIds.filter((value) => value !== id);
  }

  toggleAllPreview(checked: boolean): void {
    if (!checked) {
      this.selectedInvoiceIds = [];
      return;
    }
    this.selectedInvoiceIds = (this.preview?.invoices || []).map((row) => Number(row.invoiceID));
  }

  customerLabel(row: BulkCreditNoteCandidateRow): string {
    if (row.tallyIntegrationCode) {
      return `${row.customerName || ''} (${row.tallyIntegrationCode})`;
    }
    return row.customerName || '';
  }

  clearSearch(): void {
    const today = new Date();
    this.toDate = today;
    this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.invoiceNumber = '';
    this.reason = '';
    this.customerCtrl.setValue('');
    this.selectedCustomerID = 0;
    this.preview = null;
    this.selectedInvoiceIds = [];
    this.resetBatchSession();
  }

  previewCandidates(): void {
    this.resetBatchSession();
    this.previewFromSearch(this.maxInvoices, true);
  }

  canStartJob(): boolean {
    return (
      this.allowManual &&
      !this.jobRunning &&
      !this.previewLoading &&
      this.selectedCount > 0 &&
      !!(this.reason || '').trim()
    );
  }

  startJob(): void {
    if (!this.canStartJob()) {
      if (!(this.reason || '').trim()) {
        Swal.fire({ title: 'Reason is required.', icon: 'warning' });
      }
      return;
    }

    const selectedIds = this.selectedInvoiceIds.slice();
    const size = this.batchSize || 50;
    const batches = Math.max(1, Math.ceil(selectedIds.length / size));
    Swal.fire({
      title: 'Generate credit notes?',
      text: `Create and approve credit notes for ${selectedIds.length} invoice${
        selectedIds.length === 1 ? '' : 's'
      } (full amount, rebill Yes)${batches > 1 ? ` in ${batches} batches of ${size}` : ''}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Generate',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.runAllBatches = true;
      this.sessionExcludeIds = [];
      this.sessionPendingIds = selectedIds.slice();
      this.sessionProcessedCount = 0;
      this.sessionTargetCount = selectedIds.length;
      this.currentBatch = 1;
      this.totalBatches = batches;
      this.startNextSelectedBatch();
    });
  }

  cancelJob(): void {
    this.runAllBatches = false;
    this.clearNextBatchTimer();
    if (this.activeRunId == null) {
      return;
    }
    this.service.cancelJob(this.activeRunId).subscribe({
      next: () => this.snackBar.open('Cancel requested.', '', { duration: 2500 }),
      error: (err) =>
        Swal.fire({
          title: this.readError(err, 'Cancel failed.'),
          icon: 'error',
        }),
    });
  }

  downloadCsv(runId?: number): void {
    const id = runId ?? this.activeRunId;
    if (id == null) {
      return;
    }
    window.open(this.service.downloadCsvUrl(id), '_blank');
  }

  openRun(runId: number): void {
    this.service.getRun(runId).subscribe({
      next: (run) => {
        this.activeRunId = runId;
        this.activeRun = this.normalizeRun(run);
        this.jobRunning = this.isActiveStatus(this.activeRun.jobStatus);
        if (this.jobRunning) {
          this.pollRun();
        }
      },
      error: (err) =>
        Swal.fire({
          title: this.readError(err, 'Could not open run.'),
          icon: 'error',
        }),
    });
  }

  loadRecentRuns(): void {
    this.recentRunsLoading = true;
    this.recentRunsError = '';
    this.service
      .listRuns(10, this.formatDate(this.recentDateFrom), this.formatDate(this.recentDateTo))
      .subscribe({
        next: (payload) => {
          const rows = this.asArray(payload?.runs ?? payload?.Runs ?? payload);
          this.recentRuns = rows.map((run) => this.normalizeRun(run));
          this.recentRunsLoading = false;
        },
        error: (err) => {
          this.recentRuns = [];
          this.recentRunsLoading = false;
          this.recentRunsError = this.readError(err, 'Could not load recent runs.');
        },
      });
  }

  clearRecentDateFilter(): void {
    this.recentDateFrom = null;
    this.recentDateTo = null;
    this.loadRecentRuns();
  }

  private loadCustomers(): void {
    this.generalService.getCustomers().subscribe({
      next: (data) => {
        this.customerList = data || [];
        this.filteredCustomerOptions = this.customerCtrl.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterCustomers(value || ''))
        );
      },
      error: () => undefined,
    });
  }

  private filterCustomers(value: string): CustomerDropDown[] {
    const raw = (value || '').toLowerCase();
    const name = getCustomerNameFromAutocomplete(value).toLowerCase();
    if (!raw || raw.length < 2) {
      return [];
    }
    return (this.customerList || []).filter((row) => {
      const customerName = (row.customerName || '').toLowerCase();
      const tally = getCustomerTallyId(row).toLowerCase();
      const customerId = getCustomerIdValue(row).toLowerCase();
      return (
        customerName.includes(name) ||
        customerName.includes(raw) ||
        tally.includes(raw) ||
        customerId.includes(raw) ||
        getCustomerDisplayLabel(row).toLowerCase().includes(raw)
      );
    });
  }

  private syncCustomerFromInput(): void {
    const typed = this.customerCtrl.value;
    if (!typed) {
      this.selectedCustomerID = 0;
      return;
    }
    const resolved = resolveCustomerFromAutocomplete(typed, this.customerList);
    this.selectedCustomerID = resolved?.customerID > 0 ? resolved.customerID : this.selectedCustomerID;
  }

  private formatDate(value: Date | null): string {
    if (!value) {
      return '';
    }
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private onJobFinished(): void {
    const finished = this.activeRun;
    const status = (finished?.jobStatus || '').toLowerCase();
    this.rememberProcessedInvoices(finished);
    this.sessionProcessedCount += Number(finished?.scannedCount || 0);
    this.loadRecentRuns();

    if (!this.runAllBatches) {
      this.finishBatchSession();
      return;
    }

    if (status === 'failed' || status === 'cancelled') {
      this.runAllBatches = false;
      this.jobRunning = false;
      this.snackBar.open('Batch failed or cancelled. Remaining batches were not started.', '', { duration: 4000 });
      return;
    }

    if (!this.sessionPendingIds.length) {
      this.finishBatchSession();
      this.snackBar.open('All selected invoices processed.', '', { duration: 3000 });
      return;
    }

    this.currentBatch += 1;
    this.nextBatchTimer = setTimeout(() => {
      this.startNextSelectedBatch();
    }, 1500);
  }

  private takeNextBatchIds(): number[] {
    const size = this.batchSize || 50;
    const next = this.sessionPendingIds.slice(0, size);
    this.sessionPendingIds = this.sessionPendingIds.slice(size);
    return next;
  }

  private startNextSelectedBatch(): void {
    const ids = this.takeNextBatchIds();
    if (!ids.length) {
      this.finishBatchSession();
      return;
    }
    this.startBatch(ids);
  }

  private startBatch(selectedIds: number[]): void {
    this.jobRunning = true;
    this.sessionExcludeIds = this.mergeIds(this.sessionExcludeIds, selectedIds);
    this.service
      .startJob(this.batchSize, this.generalService.getUserID(), selectedIds, (this.reason || '').trim())
      .subscribe({
        next: (started) => {
          this.activeRunId = started.bulkCreditNoteRunId ?? (started as any).BulkCreditNoteRunId;
          this.snackBar.open(`Batch ${this.currentBatch} of ${this.totalBatches} started (job ${this.activeRunId}).`, '', {
            duration: 3000,
          });
          this.loadRecentRuns();
          this.pollRun();
        },
        error: (err) => {
          this.runAllBatches = false;
          this.jobRunning = false;
          Swal.fire({
            title: this.readError(err, 'Could not start job.'),
            icon: 'error',
          });
        },
      });
  }

  private previewFromSearch(maxInvoices: number, isManual: boolean): void {
    if (isManual) {
      this.syncCustomerFromInput();
    }
    this.previewLoading = true;
    this.service
      .preview({
        maxInvoices,
        customerId: this.selectedCustomerID,
        invoiceNumber: (this.invoiceNumber || '').trim(),
        fromDate: this.formatDate(this.fromDate),
        toDate: this.formatDate(this.toDate),
        excludeInvoiceIds: this.sessionExcludeIds.join(','),
      })
      .subscribe({
        next: (result) => {
          const invoices = this.asArray(result.invoices ?? (result as any).Invoices).map((row: any) =>
            this.normalizePreviewRow(row)
          );
          this.preview = {
            totalMatchedCount: result.totalMatchedCount ?? (result as any).TotalMatchedCount ?? 0,
            willProcessCount: result.willProcessCount ?? (result as any).WillProcessCount ?? 0,
            maxInvoices: result.maxInvoices ?? (result as any).MaxInvoices ?? maxInvoices,
            batchSize: result.batchSize ?? (result as any).BatchSize ?? this.batchSize,
            estimatedBatchCount: result.estimatedBatchCount ?? (result as any).EstimatedBatchCount ?? 0,
            invoices,
          };
          this.selectedInvoiceIds = invoices.map((row) => Number(row.invoiceID));
          this.previewLoading = false;
        },
        error: (err) => {
          this.previewLoading = false;
          this.runAllBatches = false;
          this.jobRunning = false;
          Swal.fire({
            title: this.readError(err, 'Preview failed.'),
            icon: 'error',
          });
        },
      });
  }

  private rememberProcessedInvoices(run: BulkCreditNoteRun | null): void {
    const ids = (run?.items || []).map((item) => Number(item.invoiceID)).filter((id) => id > 0);
    this.sessionExcludeIds = this.mergeIds(this.sessionExcludeIds, ids);
  }

  private mergeIds(current: number[], extra: number[]): number[] {
    const seen: { [key: number]: boolean } = {};
    const merged: number[] = [];
    current.concat(extra).forEach((id) => {
      const value = Number(id);
      if (value > 0 && !seen[value]) {
        seen[value] = true;
        merged.push(value);
      }
    });
    return merged;
  }

  private finishBatchSession(): void {
    this.runAllBatches = false;
    this.jobRunning = false;
    this.clearNextBatchTimer();
  }

  private resetBatchSession(): void {
    this.runAllBatches = false;
    this.sessionExcludeIds = [];
    this.sessionPendingIds = [];
    this.sessionProcessedCount = 0;
    this.sessionTargetCount = 0;
    this.currentBatch = 0;
    this.totalBatches = 0;
    this.clearNextBatchTimer();
  }

  private clearNextBatchTimer(): void {
    if (this.nextBatchTimer) {
      clearTimeout(this.nextBatchTimer);
      this.nextBatchTimer = null;
    }
  }

  private pollRun(): void {
    this.pollSub?.unsubscribe();
    if (this.activeRunId == null) {
      return;
    }

    this.pollSub = timer(0, 2500)
      .pipe(
        switchMap(() => this.service.getRun(this.activeRunId as number)),
        takeWhile((run) => this.isActiveStatus(this.normalizeRun(run).jobStatus), true)
      )
      .subscribe({
        next: (run) => {
          this.activeRun = this.normalizeRun(run);
          if (!this.isActiveStatus(this.activeRun.jobStatus)) {
            this.onJobFinished();
          }
        },
        error: () => {
          this.runAllBatches = false;
          this.jobRunning = false;
        },
      });
  }

  private normalizePreviewRow(row: any): BulkCreditNoteCandidateRow {
    return {
      invoiceID: row.invoiceID ?? row.InvoiceID,
      invoiceNumberWithPrefix: row.invoiceNumberWithPrefix ?? row.InvoiceNumberWithPrefix,
      invoiceDate: row.invoiceDate ?? row.InvoiceDate,
      customerID: row.customerID ?? row.CustomerID,
      customerName: row.customerName ?? row.CustomerName,
      tallyIntegrationCode: row.tallyIntegrationCode ?? row.TallyIntegrationCode,
      branchID: row.branchID ?? row.BranchID,
      branchName: row.branchName ?? row.BranchName,
      invoiceTotalAmountAfterGST: row.invoiceTotalAmountAfterGST ?? row.InvoiceTotalAmountAfterGST,
      pendingAmount: row.pendingAmount ?? row.PendingAmount,
      irn: row.irn ?? row.IRN,
    };
  }

  private normalizeRun(run: any): BulkCreditNoteRun {
    const items = this.asArray(run.items ?? run.Items).map((item: any) => ({
      bulkCreditNoteRunItemId: item.bulkCreditNoteRunItemId ?? item.BulkCreditNoteRunItemId,
      bulkCreditNoteRunId: item.bulkCreditNoteRunId ?? item.BulkCreditNoteRunId,
      invoiceID: item.invoiceID ?? item.InvoiceID,
      invoiceNumberWithPrefix: item.invoiceNumberWithPrefix ?? item.InvoiceNumberWithPrefix,
      customerName: item.customerName ?? item.CustomerName,
      invoiceCreditNoteID: item.invoiceCreditNoteID ?? item.InvoiceCreditNoteID,
      creditNoteNumber: item.creditNoteNumber ?? item.CreditNoteNumber,
      itemStatus: item.itemStatus ?? item.ItemStatus,
      errorMessage: item.errorMessage ?? item.ErrorMessage,
    }));
    return {
      bulkCreditNoteRunId: run.bulkCreditNoteRunId ?? run.BulkCreditNoteRunId,
      batchDate: run.batchDate ?? run.BatchDate,
      mode: run.mode ?? run.Mode,
      triggerSource: run.triggerSource ?? run.TriggerSource,
      jobStatus: run.jobStatus ?? run.JobStatus,
      maxInvoices: run.maxInvoices ?? run.MaxInvoices,
      reason: run.reason ?? run.Reason,
      scannedCount: run.scannedCount ?? run.ScannedCount,
      createdCount: run.createdCount ?? run.CreatedCount,
      skippedCount: run.skippedCount ?? run.SkippedCount,
      failedCount: run.failedCount ?? run.FailedCount,
      createdBy: run.createdBy ?? run.CreatedBy,
      errorMessage: run.errorMessage ?? run.ErrorMessage,
      items,
    };
  }

  private asArray(payload: any): any[] {
    if (Array.isArray(payload)) {
      return payload;
    }
    if (Array.isArray(payload?.$values)) {
      return payload.$values;
    }
    if (Array.isArray(payload?.Values)) {
      return payload.Values;
    }
    return [];
  }

  private isActiveStatus(status: string): boolean {
    const value = (status || '').toLowerCase();
    return value === 'pending' || value === 'processing';
  }

  private readError(err: any, fallback: string): string {
    if (typeof err === 'string' && err.trim()) {
      return err;
    }
    return err?.error?.message || err?.error?.Message || err?.message || fallback;
  }
}
