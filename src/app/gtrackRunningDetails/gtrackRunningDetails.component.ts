import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { GeneralService } from '../general/general.service';
import { GtrackFillResult, GtrackRunningDetailsRow } from './gtrackRunningDetails.model';
import { GtrackRunningDetailsQuery, GtrackRunningDetailsService } from './gtrackRunningDetails.service';

interface GroupOption {
  customerGroupID: number;
  customerGroup: string;
}

interface CustomerOption {
  customerID: number;
  customerName: string;
  customerGroupID: number;
}

@Component({
  standalone: false,
  selector: 'app-gtrack-running-details',
  templateUrl: './gtrackRunningDetails.component.html',
  styleUrls: ['./gtrackRunningDetails.component.scss'],
})
export class GtrackRunningDetailsComponent implements OnInit, OnDestroy {
  batchSize = 20;
  runningBatches = 1;
  readonly maxBatchSize = 100;
  readonly maxRunningBatches = 5;

  pickupFrom: Date | null = null;
  pickupTo: Date | null = null;
  dutySlipIds = '';
  dutySlipNumbers = '';
  groupCtrl = new FormControl('');
  customerCtrl = new FormControl('');
  groups: GroupOption[] = [];
  customers: CustomerOption[] = [];
  filteredGroups: Observable<GroupOption[]>;
  filteredCustomers: Observable<CustomerOption[]>;
  selectedGroupId = 0;
  selectedCustomerId = 0;

  loading = false;
  running = false;
  searched = false;
  count = 0;
  rows: GtrackRunningDetailsRow[] = [];
  selectedIds = new Set<number>();
  currentBatch = 0;
  totalBatches = 0;
  processedCount = 0;
  sessionTarget = 0;
  inFlightCount = 0;
  columns = [
    'select',
    'dutySlipId',
    'dutySlipNumber',
    'reservationId',
    'customerGroup',
    'customerName',
    'registrationNumber',
    'pickup',
    'dropOff',
    'reason',
    'result',
  ];

  private runAll = false;
  private runToken = 0;
  private pageLoading = false;
  private morePages = false;
  private queue: number[] = [];
  private pageQueue: GtrackRunningDetailsRow[][] = [];
  private activeIds = new Set<number>();
  private skipIds = new Set<number>();
  private resultsById = new Map<number, string>();
  private afterPickupDate = '';
  private afterPickupTime = '';
  private afterDutySlipId = 0;
  private pageAdvanceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private service: GtrackRunningDetailsService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.filteredGroups = this.groupCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterGroups(value))
    );
    this.filteredCustomers = this.customerCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterCustomers(value))
    );
    this.generalService.GetCustomersGroups().subscribe(data => {
      this.groups = data || [];
      this.groupCtrl.setValue('');
    });
    this.generalService.getCustomers().subscribe(data => {
      this.customers = (data || []).map(item => ({
        customerID: item.customerID,
        customerName: item.customerName,
        customerGroupID: Number((item as { customerGroupID?: number }).customerGroupID) || 0,
      }));
      this.customerCtrl.setValue('');
    });
  }

  ngOnDestroy(): void {
    this.runAll = false;
    this.morePages = false;
    this.clearPageAdvance();
  }

  get queuedBatchCount(): number {
    if (this.totalBatches <= 0) {
      return 0;
    }
    return Math.max(0, this.totalBatches - this.currentBatch);
  }

  get estimatedBatchCount(): number {
    if (this.count <= 0) {
      return 0;
    }
    return Math.ceil(this.count / this.chunkSize());
  }

  get allRunnableSelected(): boolean {
    const runnable = this.rows.filter(row => row.canRun);
    return runnable.length > 0 && runnable.every(row => this.selectedIds.has(row.dutySlipId));
  }

  search(): void {
    if (this.running) {
      return;
    }
    this.loading = true;
    this.selectedIds.clear();
    this.resultsById.clear();
    this.afterPickupDate = '';
    this.afterPickupTime = '';
    this.afterDutySlipId = 0;
    this.batchSize = this.chunkSize();
    this.service.preview(this.query()).subscribe({
      next: result => {
        this.count = result?.count || 0;
        this.rows = this.withStoredResults(result?.rows || []);
        this.searched = true;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Search failed.', 'Close', { duration: 4000 });
      },
    });
  }

  runSelected(): void {
    const ids = this.rows
      .filter(row => row.canRun && this.selectedIds.has(row.dutySlipId))
      .map(row => row.dutySlipId);
    if (ids.length === 0 || this.running) {
      return;
    }

    const size = this.chunkSize();
    this.batchSize = size;
    const concurrency = this.batchConcurrency();
    this.runningBatches = concurrency;
    const batches = this.estimatedBatchCount || 1;
    const runningLabel = concurrency === 1 ? '1 batch will run at a time' : concurrency + ' batches will run at a time';
    Swal.fire({
      title: 'Fill running details?',
      text: `Fill running details for ${this.count} duties in ${batches} batches of ${size}. ${runningLabel}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Run',
    }).then(result => {
      if (!result.isConfirmed) {
        return;
      }
      this.runToken += 1;
      this.runAll = true;
      this.running = true;
      this.queue = ids;
      this.skipIds = new Set<number>(ids);
      this.processedCount = 0;
      this.sessionTarget = this.count;
      this.currentBatch = 0;
      this.totalBatches = batches;
      this.inFlightCount = 0;
      this.pageLoading = false;
      this.pageQueue = [];
      this.activeIds = new Set<number>();
      this.afterPickupDate = '';
      this.afterPickupTime = '';
      this.afterDutySlipId = 0;
      const hasUnselected = this.rows.some(row => row.canRun && !this.skipIds.has(row.dutySlipId));
      this.morePages = hasUnselected || this.rows.length >= size || this.count > this.rows.length;
      if (this.morePages && !hasUnselected && !this.advanceCursor(this.rows)) {
        this.morePages = this.count > this.rows.length;
      }
      this.pump();
    });
  }

  cancelRun(): void {
    this.runAll = false;
    this.morePages = false;
    this.runToken += 1;
    this.queue = [];
    this.pageQueue = [];
    this.clearPageAdvance();
    this.settleIfIdle();
    this.snackBar.open('Cancelled. Batches already running will finish.', 'Close', { duration: 3000 });
  }

  clearFilters(): void {
    if (this.running) {
      return;
    }
    this.pickupFrom = null;
    this.pickupTo = null;
    this.dutySlipIds = '';
    this.dutySlipNumbers = '';
    this.selectedGroupId = 0;
    this.selectedCustomerId = 0;
    this.groupCtrl.setValue('');
    this.customerCtrl.setValue('');
  }

  displayGroup = (group: GroupOption | string): string => {
    if (typeof group === 'string') {
      return group;
    }
    return group && group.customerGroup ? group.customerGroup : '';
  };

  displayCustomer = (customer: CustomerOption | string): string => {
    if (typeof customer === 'string') {
      return customer;
    }
    return customer && customer.customerName ? customer.customerName : '';
  };

  onGroupSelected(group: GroupOption): void {
    this.selectedGroupId = group?.customerGroupID || 0;
    this.groupCtrl.setValue(group?.customerGroup || '');
    if (this.selectedCustomerId) {
      const customer = this.customers.find(item => item.customerID === this.selectedCustomerId);
      if (customer && customer.customerGroupID !== this.selectedGroupId) {
        this.selectedCustomerId = 0;
        this.customerCtrl.setValue('');
      }
    }
  }

  onCustomerSelected(customer: CustomerOption): void {
    this.selectedCustomerId = customer?.customerID || 0;
    this.customerCtrl.setValue(customer?.customerName || '');
  }

  toggle(id: number, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  toggleAll(checked: boolean): void {
    this.selectedIds.clear();
    if (checked) {
      this.rows.filter(row => row.canRun).forEach(row => this.selectedIds.add(row.dutySlipId));
    }
  }

  reasonLabel(reason: string): string {
    if (reason === 'Empty') {
      return 'Empty';
    }
    if (reason === 'InvalidJson') {
      return 'Not valid JSON';
    }
    if (reason === 'Gtrack401') {
      return 'Gtrack fields empty';
    }
    if (reason === 'MissingTimeOrVehicle') {
      return 'Missing drop-off time';
    }
    if (reason === 'Saved') {
      return 'Saved';
    }
    return reason;
  }

  private pump(): void {
    if (!this.runAll) {
      this.settleIfIdle();
      return;
    }

    const limit = this.batchConcurrency();
    while (this.inFlightCount < limit && this.queue.length > 0) {
      const chunk = this.queue.splice(0, this.chunkSize());
      this.startFill(chunk);
    }

    if (this.morePages && !this.pageLoading) {
      this.loadNextBatch();
      return;
    }

    if (this.inFlightCount === 0 && this.queue.length === 0 && !this.pageLoading && !this.morePages) {
      this.finishRun();
    }
  }

  private startFill(chunk: number[]): void {
    if (chunk.length === 0) {
      return;
    }
    const token = this.runToken;
    this.currentBatch += 1;
    this.inFlightCount += 1;
    for (const id of chunk) {
      this.activeIds.add(id);
    }
    this.service.fill(chunk).subscribe({
      next: response => {
        this.inFlightCount = Math.max(0, this.inFlightCount - 1);
        this.releaseChunk(chunk);
        this.applyResults(response?.results || [], chunk);
        this.schedulePageAdvance();
        if (token !== this.runToken || !this.runAll) {
          this.settleIfIdle();
          return;
        }
        this.pump();
      },
      error: () => {
        this.inFlightCount = Math.max(0, this.inFlightCount - 1);
        this.releaseChunk(chunk);
        this.runAll = false;
        this.morePages = false;
        this.queue = [];
        this.pageQueue = [];
        this.snackBar.open('Batch failed. Remaining batches were not started.', 'Close', { duration: 4000 });
        this.settleIfIdle();
      },
    });
  }

  private loadNextBatch(): void {
    if (!this.runAll || this.pageLoading) {
      return;
    }

    const token = this.runToken;
    this.pageLoading = true;
    this.service.preview(this.query()).subscribe({
      next: result => {
        this.pageLoading = false;
        if (token !== this.runToken || !this.runAll) {
          this.settleIfIdle();
          return;
        }
        if (!this.afterDutySlipId) {
          this.count = result?.count || 0;
          this.sessionTarget = this.count;
          this.totalBatches = this.estimatedBatchCount || this.totalBatches;
        }
        const rows = result?.rows || [];
        this.searched = true;
        const nextIds = rows
          .filter(row => row.canRun && !this.skipIds.has(row.dutySlipId))
          .map(row => row.dutySlipId);
        for (const id of nextIds) {
          this.skipIds.add(id);
        }
        if (nextIds.length > 0) {
          this.queue = this.queue.concat(nextIds);
        }
        const pageContinues = rows.length >= this.chunkSize() && this.advanceCursor(rows);
        this.morePages = pageContinues;
        if (rows.length > 0) {
          this.pageQueue.push(rows);
        }
        this.showQueuedPage();
        this.pump();
      },
      error: () => {
        this.pageLoading = false;
        this.runAll = false;
        this.morePages = false;
        this.queue = [];
        this.pageQueue = [];
        this.snackBar.open('Could not load the next batch.', 'Close', { duration: 4000 });
        this.settleIfIdle();
      },
    });
  }

  private advanceCursor(rows: GtrackRunningDetailsRow[]): boolean {
    const last = rows[rows.length - 1];
    if (!last || last.dutySlipId <= 0 || last.dutySlipId === this.afterDutySlipId) {
      return false;
    }
    this.afterPickupDate = last.pickupDateValue || '';
    this.afterPickupTime = last.pickupTimeValue || '00:00:00';
    this.afterDutySlipId = last.dutySlipId;
    return true;
  }

  private settleIfIdle(): void {
    if (this.inFlightCount === 0 && !this.pageLoading) {
      this.running = false;
    }
  }

  private releaseChunk(chunk: number[]): void {
    for (const id of chunk) {
      this.activeIds.delete(id);
    }
  }

  private schedulePageAdvance(): void {
    this.clearPageAdvance();
    this.pageAdvanceTimer = setTimeout(() => {
      this.pageAdvanceTimer = null;
      this.showQueuedPage();
    }, 400);
  }

  private clearPageAdvance(): void {
    if (this.pageAdvanceTimer) {
      clearTimeout(this.pageAdvanceTimer);
      this.pageAdvanceTimer = null;
    }
  }

  private showQueuedPage(): void {
    if (this.pageStillRunning()) {
      return;
    }
    while (this.pageQueue.length > 0 && !this.pageStillRunning()) {
      const next = this.pageQueue.shift();
      if (!next || next.length === 0) {
        continue;
      }
      this.rows = this.withStoredResults(next);
      if (this.pageStillRunning()) {
        return;
      }
    }
  }

  private pageStillRunning(): boolean {
    return this.rows.some(row => this.activeIds.has(row.dutySlipId) || this.queue.indexOf(row.dutySlipId) >= 0);
  }

  private applyResults(results: GtrackFillResult[], chunk: number[]): void {
    const byId = new Map<number, GtrackFillResult>();
    for (const item of results) {
      byId.set(item.dutySlipId, item);
    }
    for (const id of chunk) {
      const item = byId.get(id);
      const status = item?.status || 'Error';
      const message = item?.message || status;
      this.resultsById.set(id, message);
      const row = this.rows.find(entry => entry.dutySlipId === id);
      if (row) {
        row.result = message;
      }
      this.skipIds.add(id);
      if (status === 'Filled') {
        this.selectedIds.delete(id);
      }
      this.processedCount += 1;
    }
  }

  private withStoredResults(rows: GtrackRunningDetailsRow[]): GtrackRunningDetailsRow[] {
    for (const row of rows) {
      const stored = this.resultsById.get(row.dutySlipId);
      if (stored) {
        row.result = stored;
      }
    }
    return rows;
  }

  chunkSize(): number {
    const size = Math.floor(Number(this.batchSize));
    if (!size || size < 1) {
      return 1;
    }
    return Math.min(this.maxBatchSize, size);
  }

  private batchConcurrency(): number {
    const size = Math.floor(Number(this.runningBatches));
    if (!size || size < 1) {
      return 1;
    }
    return Math.min(this.maxRunningBatches, size);
  }

  private finishRun(): void {
    this.runAll = false;
    this.morePages = false;
    this.running = false;
    this.queue = [];
    this.pageQueue = [];
    this.clearPageAdvance();
    this.snackBar.open('Run finished.', 'Close', { duration: 3000 });
  }

  private query(): GtrackRunningDetailsQuery {
    return {
      pickupFrom: this.pickupFrom ? this.toDateString(this.pickupFrom) : undefined,
      pickupTo: this.pickupTo ? this.toDateString(this.pickupTo) : undefined,
      customerGroupId: this.selectedGroupId || undefined,
      customerId: this.selectedCustomerId || undefined,
      dutySlipIds: this.dutySlipIds.trim(),
      dutySlipNumbers: this.dutySlipNumbers.trim(),
      batchSize: this.chunkSize(),
      afterPickupDate: this.afterPickupDate || undefined,
      afterPickupTime: this.afterPickupTime || undefined,
      afterDutySlipId: this.afterDutySlipId || undefined,
    };
  }

  private filterGroups(value: unknown): GroupOption[] {
    const text = this.textOf(value).toLowerCase();
    return this.groups.filter(group => (group.customerGroup || '').toLowerCase().includes(text)).slice(0, 30);
  }

  private filterCustomers(value: unknown): CustomerOption[] {
    const text = this.textOf(value).trim().toLowerCase();
    if (text.length < 3) {
      return [];
    }
    return this.customers
      .filter(customer => !this.selectedGroupId || customer.customerGroupID === this.selectedGroupId)
      .filter(customer => (customer.customerName || '').toLowerCase().includes(text));
  }

  private textOf(value: unknown): string {
    if (value && typeof value === 'object') {
      const group = value as GroupOption;
      const customer = value as CustomerOption;
      return group.customerGroup || customer.customerName || '';
    }
    return (value || '').toString();
  }

  private toDateString(value: Date): string {
    const month = (value.getMonth() + 1).toString().padStart(2, '0');
    const day = value.getDate().toString().padStart(2, '0');
    return value.getFullYear() + '-' + month + '-' + day;
  }
}
