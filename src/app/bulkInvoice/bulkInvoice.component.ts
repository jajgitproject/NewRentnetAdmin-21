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
import { BulkInvoiceService } from './bulkInvoice.service';
import { BulkInvoiceCandidateRow, BulkInvoicePreviewResult, BulkInvoiceRun } from './bulkInvoice.model';

@Component({
  standalone: false,
  selector: 'app-bulk-invoice',
  templateUrl: './bulkInvoice.component.html',
  styleUrls: ['./bulkInvoice.component.scss'],
})
export class BulkInvoiceComponent implements OnInit, OnDestroy {
  selectedTabIndex = 0;
  mode = 'Shadow';
  maxDuties = 25;
  maxDutiesLimit = 100;
  batchSize = 25;
  allowManual = true;
  nightEnabled = false;

  searchDutySlipIds = '';
  searchReservationIds = '';
  searchPickupDate: Date | null = null;
  searchRunStatus = 'NotRun';
  customerCtrl = new FormControl('');
  customerList: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]> = of([]);
  selectedCustomerID = 0;

  preview: BulkInvoicePreviewResult | null = null;
  previewLoading = false;
  selectedDutySlipIds: number[] = [];
  jobRunning = false;
  activeRun: BulkInvoiceRun | null = null;
  recentRuns: BulkInvoiceRun[] = [];
  recentRunsError = '';
  recentRunsLoading = false;
  recentDateFrom: Date | null = null;
  recentDateTo: Date | null = null;

  currentBatch = 0;
  totalBatches = 0;
  sessionProcessedCount = 0;
  sessionTargetCount = 0;

  displayedColumns = [
    'dutySlipID',
    'reservationID',
    'pickupDate',
    'customerName',
    'invoicePrefix',
    'invoiceNumber',
    'itemStatus',
    'errorMessage',
  ];
  previewColumns = ['select', 'dutySlipID', 'reservationID', 'pickupDate', 'customerName', 'invoicePrefix', 'lastStatus'];
  recentColumns = ['bulkInvoiceRunId', 'batchDate', 'mode', 'triggerSource', 'jobStatus', 'createdCount', 'actions'];

  getCustomerDisplayLabel = getCustomerDisplayLabel;
  getCustomerDisplayValue = getCustomerDisplayValue;

  private pollSub: Subscription | null = null;
  private activeRunId: number | null = null;
  private runAllBatches = false;
  private sessionExcludeIds: number[] = [];
  private nextBatchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private service: BulkInvoiceService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.service.getLimits().subscribe({
      next: (limits) => {
        this.mode = limits.defaultMode || 'Shadow';
        this.maxDuties = limits.defaultMaxDuties || 25;
        this.maxDutiesLimit = limits.maxDutiesLimit || 100;
        this.batchSize = limits.batchSize || 25;
        this.allowManual = limits.allowManual !== false;
        this.nightEnabled = limits.nightEnabled === true;
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
    const size = this.preview?.batchSize || this.batchSize || 25;
    if (willProcess <= 0) {
      return 0;
    }
    return Math.max(1, Math.ceil(willProcess / size));
  }

  get selectedCount(): number {
    return this.selectedDutySlipIds.length;
  }

  get allPreviewSelected(): boolean {
    const duties = this.preview?.duties || [];
    return duties.length > 0 && duties.every((row) => this.isRowSelected(row.dutySlipID));
  }

  get somePreviewSelected(): boolean {
    const duties = this.preview?.duties || [];
    const selected = duties.filter((row) => this.isRowSelected(row.dutySlipID)).length;
    return selected > 0 && selected < duties.length;
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

  isRowSelected(dutySlipID: number): boolean {
    return this.selectedDutySlipIds.indexOf(Number(dutySlipID)) >= 0;
  }

  setRowSelected(dutySlipID: number, checked: boolean): void {
    const id = Number(dutySlipID);
    if (checked) {
      if (this.selectedDutySlipIds.indexOf(id) < 0) {
        this.selectedDutySlipIds = this.selectedDutySlipIds.concat(id);
      }
      return;
    }
    this.selectedDutySlipIds = this.selectedDutySlipIds.filter((value) => value !== id);
  }

  toggleAllPreview(checked: boolean): void {
    if (!checked) {
      this.selectedDutySlipIds = [];
      return;
    }
    this.selectedDutySlipIds = (this.preview?.duties || []).map((row) => Number(row.dutySlipID));
  }

  customerLabel(row: BulkInvoiceCandidateRow): string {
    if (row.tallyIntegrationCode) {
      return `${row.customerName || ''} (${row.tallyIntegrationCode})`;
    }
    return row.customerName || '';
  }

  clearSearch(): void {
    this.searchDutySlipIds = '';
    this.searchReservationIds = '';
    this.searchPickupDate = null;
    this.searchRunStatus = 'NotRun';
    this.customerCtrl.setValue('');
    this.selectedCustomerID = 0;
    this.preview = null;
    this.selectedDutySlipIds = [];
    this.resetBatchSession();
  }

  previewCandidates(): void {
    this.resetBatchSession();
    this.previewFromSearch(this.maxDuties, true);
  }

  canStartJob(): boolean {
    return this.allowManual && !this.jobRunning && !this.previewLoading && this.selectedCount > 0;
  }

  startJob(): void {
    if (!this.canStartJob()) {
      return;
    }

    const selectedIds = this.selectedDutySlipIds.slice();
    const willProcess = this.preview?.willProcessCount || selectedIds.length;
    const batches = this.estimatedBatchCount || 1;
    const action = this.mode === 'Create' ? 'Create invoices' : 'Shadow (no invoices)';
    Swal.fire({
      title: this.mode === 'Create' ? 'Create invoices?' : 'Run Shadow?',
      text: `${action} for ${willProcess} duties in ${batches} batch${batches === 1 ? '' : 'es'} of ${this.batchSize}. GSTN / orphan / prefix skips leave the tag on.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.mode === 'Create' ? 'Create invoices' : 'Run Shadow',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.runAllBatches = true;
      this.sessionExcludeIds = [];
      this.sessionProcessedCount = 0;
      this.sessionTargetCount = willProcess;
      this.currentBatch = 1;
      this.totalBatches = batches;
      this.startBatch(selectedIds);
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

  formatTrigger(source: string): string {
    return (source || '').toLowerCase() === 'night' ? 'Night' : 'Day';
  }

  lastStatusText(row: BulkInvoiceCandidateRow): string {
    return row.lastItemStatus || 'Not run';
  }

  lastStatusDetail(row: BulkInvoiceCandidateRow): string {
    if (row.lastErrorMessage) {
      return row.lastErrorMessage;
    }
    if (row.lastBatchDate) {
      return `Run ${row.lastBulkInvoiceRunId || ''}`.trim();
    }
    return '';
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
    this.rememberProcessedDuties(finished);
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

    const remaining = this.sessionTargetCount - this.sessionProcessedCount;
    if (remaining <= 0) {
      this.finishBatchSession();
      return;
    }

    this.snackBar.open(
      `Batch ${this.currentBatch} of ${this.totalBatches} finished. Starting next batch…`,
      '',
      { duration: 2500 }
    );
    this.clearNextBatchTimer();
    this.nextBatchTimer = setTimeout(() => this.previewAndStartNextBatch(remaining), 1500);
  }

  private previewAndStartNextBatch(remaining: number): void {
    if (!this.runAllBatches) {
      this.finishBatchSession();
      return;
    }

    this.previewFromSearch(remaining, false, (duties) => {
      if (!duties.length) {
        this.finishBatchSession();
        return;
      }
      this.currentBatch += 1;
      this.startBatch(duties.map((row) => Number(row.dutySlipID)));
    });
  }

  private startBatch(selectedIds: number[]): void {
    this.jobRunning = true;
    this.sessionExcludeIds = this.mergeIds(this.sessionExcludeIds, selectedIds);
    this.service.startJob(this.batchSize, this.generalService.getUserID(), selectedIds, this.mode).subscribe({
      next: (started) => {
        this.activeRunId = started.bulkInvoiceRunId ?? (started as any).BulkInvoiceRunId;
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

  private previewFromSearch(
    maxDuties: number,
    isManual: boolean,
    onSuccess?: (duties: BulkInvoiceCandidateRow[]) => void
  ): void {
    if (isManual) {
      this.syncCustomerFromInput();
    }
    this.previewLoading = true;
    this.service
      .preview({
        maxDuties,
        mode: this.mode,
        dutySlipIds: (this.searchDutySlipIds || '').trim(),
        reservationIds: (this.searchReservationIds || '').trim(),
        pickupDate: this.formatDate(this.searchPickupDate),
        customerId: this.selectedCustomerID,
        runStatus: this.searchRunStatus || 'NotRun',
        excludeDutySlipIds: this.sessionExcludeIds.join(','),
      })
      .subscribe({
        next: (result) => {
          const duties = this.asArray(result.duties ?? (result as any).Duties).map((row: any) =>
            this.normalizePreviewRow(row)
          );
          this.preview = {
            totalMatchedCount: result.totalMatchedCount ?? (result as any).TotalMatchedCount ?? 0,
            willProcessCount: result.willProcessCount ?? (result as any).WillProcessCount ?? 0,
            maxDuties: result.maxDuties ?? (result as any).MaxDuties ?? maxDuties,
            batchSize: result.batchSize ?? (result as any).BatchSize ?? this.batchSize,
            estimatedBatchCount: result.estimatedBatchCount ?? (result as any).EstimatedBatchCount ?? 0,
            mode: result.mode ?? (result as any).Mode ?? this.mode,
            duties,
          };
          this.selectedDutySlipIds = duties.map((row) => Number(row.dutySlipID));
          this.previewLoading = false;
          if (onSuccess) {
            onSuccess(duties);
          }
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

  private rememberProcessedDuties(run: BulkInvoiceRun | null): void {
    const ids = (run?.items || []).map((item) => Number(item.dutySlipID)).filter((id) => id > 0);
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
    this.preview = null;
    this.selectedDutySlipIds = [];
    this.sessionExcludeIds = [];
    this.clearNextBatchTimer();
  }

  private resetBatchSession(): void {
    this.runAllBatches = false;
    this.sessionExcludeIds = [];
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

  private normalizePreviewRow(row: any): BulkInvoiceCandidateRow {
    return {
      dutySlipID: row.dutySlipID ?? row.DutySlipID,
      dutySlipForBillingID: row.dutySlipForBillingID ?? row.DutySlipForBillingID,
      reservationID: row.reservationID ?? row.ReservationID,
      pickupDate: row.pickupDate ?? row.PickupDate,
      customerName: row.customerName ?? row.CustomerName,
      tallyIntegrationCode: row.tallyIntegrationCode ?? row.TallyIntegrationCode,
      invoicePrefix: row.invoicePrefix ?? row.InvoicePrefix,
      lastItemStatus: row.lastItemStatus ?? row.LastItemStatus,
      lastErrorMessage: row.lastErrorMessage ?? row.LastErrorMessage,
      lastBulkInvoiceRunId: row.lastBulkInvoiceRunId ?? row.LastBulkInvoiceRunId,
      lastBatchDate: row.lastBatchDate ?? row.LastBatchDate,
      lastMode: row.lastMode ?? row.LastMode,
    };
  }

  private normalizeRun(run: any): BulkInvoiceRun {
    const items = this.asArray(run.items ?? run.Items).map((item: any) => ({
      bulkInvoiceRunItemId: item.bulkInvoiceRunItemId ?? item.BulkInvoiceRunItemId,
      bulkInvoiceRunId: item.bulkInvoiceRunId ?? item.BulkInvoiceRunId,
      dutySlipID: item.dutySlipID ?? item.DutySlipID,
      reservationID: item.reservationID ?? item.ReservationID,
      pickupDate: item.pickupDate ?? item.PickupDate,
      customerName: item.customerName ?? item.CustomerName,
      invoicePrefix: item.invoicePrefix ?? item.InvoicePrefix,
      invoiceNumberWithPrefix: item.invoiceNumberWithPrefix ?? item.InvoiceNumberWithPrefix,
      itemStatus: item.itemStatus ?? item.ItemStatus,
      errorMessage: item.errorMessage ?? item.ErrorMessage,
    }));
    return {
      bulkInvoiceRunId: run.bulkInvoiceRunId ?? run.BulkInvoiceRunId,
      batchDate: run.batchDate ?? run.BatchDate,
      mode: run.mode ?? run.Mode,
      triggerSource: run.triggerSource ?? run.TriggerSource,
      jobStatus: run.jobStatus ?? run.JobStatus,
      maxDuties: run.maxDuties ?? run.MaxDuties,
      scannedCount: run.scannedCount ?? run.ScannedCount,
      createdCount: run.createdCount ?? run.CreatedCount,
      alreadyInvoicedCount: run.alreadyInvoicedCount ?? run.AlreadyInvoicedCount,
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
