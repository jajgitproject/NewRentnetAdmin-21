// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, timer } from 'rxjs';
import { map, startWith, switchMap, takeWhile } from 'rxjs/operators';
import moment from 'moment';
import Swal from 'sweetalert2';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
import { GeneralService } from '../general/general.service';
import { BulkEInvoiceService } from './bulkEInvoice.service';
import {
  BulkEInvoicePreviewResult,
  BulkEInvoiceProgressRow,
  BulkEInvoiceSearchCriteria,
  BulkUploadJobStatus,
} from './bulkEInvoice.model';

@Component({
  standalone: false,
  selector: 'app-bulk-e-invoice',
  templateUrl: './bulkEInvoice.component.html',
  styleUrls: ['./bulkEInvoice.component.scss'],
})
export class BulkEInvoiceComponent implements OnInit, OnDestroy {
  fromDate: Date | null = null;
  toDate: Date | null = null;
  invoiceNumber = '';
  customer: FormControl = new FormControl('');
  selectedCustomerID: number | null = null;
  customerList: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  readonly fixedBatchSize = 5;

  preview: BulkEInvoicePreviewResult | null = null;
  previewLoading = false;
  jobRunning = false;
  activeJob: BulkUploadJobStatus | null = null;
  progressRows: BulkEInvoiceProgressRow[] = [];
  jobErrors: any[] = [];

  displayedColumns = ['invoiceNumberWithPrefix', 'invoiceDate', 'customerName', 'invoiceType', 'generateIrnInvoiceType'];

  private pollSub: Subscription | null = null;
  private activeJobId: number | null = null;

  constructor(
    private service: BulkEInvoiceService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.toDate = today;
    this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.initCustomers();
  }

  initCustomers(): void {
    this.generalService.GetCustomers().subscribe((data) => {
      this.customerList = data || [];
      this.filteredCustomerOptions = this.customer.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterCustomers(typeof value === 'string' ? value : ''))
      );
    });
  }

  private filterCustomers(value: string): CustomerDropDown[] {
    const filterValue = (value || '').toLowerCase();
    if (!filterValue || filterValue.length < 3) {
      return [];
    }
    return this.customerList.filter((item) =>
      (item.customerName || '').toLowerCase().includes(filterValue)
    );
  }

  onCustomerSelected(customerName: string): void {
    const match = this.customerList.find((item) => item.customerName === customerName);
    this.selectedCustomerID = match?.customerID ?? null;
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  buildCriteria(): BulkEInvoiceSearchCriteria {
    const customerFilters = this.resolveCustomerFilters();
    return {
      fromDate: this.fromDate ? moment(this.fromDate).format('YYYY-MM-DD') : null,
      toDate: this.toDate ? moment(this.toDate).format('YYYY-MM-DD') : null,
      invoiceNumber: this.invoiceNumber?.trim() || null,
      customerID: customerFilters.customerID,
      customerName: customerFilters.customerName,
      maxCandidates: this.fixedBatchSize,
    };
  }

  private resolveCustomerFilters(): { customerID: number | null; customerName: string | null } {
    const customerText = (this.customer.value || '').trim();
    if (!customerText) {
      this.selectedCustomerID = null;
      return { customerID: null, customerName: null };
    }

    const exactMatch = this.customerList.find((item) => item.customerName === customerText);
    if (exactMatch) {
      this.selectedCustomerID = exactMatch.customerID ?? null;
      return { customerID: this.selectedCustomerID, customerName: null };
    }

    this.selectedCustomerID = null;
    return { customerID: null, customerName: customerText };
  }

  previewCandidates(): void {
    if (!this.fromDate || !this.toDate) {
      this.showMessage('From date and to date are required.', 'warning');
      return;
    }
    this.previewLoading = true;
    this.preview = null;
    this.service.preview(this.buildCriteria()).subscribe({
      next: (res) => {
        this.preview = this.normalizePreview(res);
        this.previewLoading = false;
      },
      error: (err) => {
        this.previewLoading = false;
        this.showMessage(this.extractError(err), 'error');
      },
    });
  }

  canStartJob(): boolean {
    return !!this.preview && this.preview.willProcessCount > 0 && !this.jobRunning;
  }

  startJob(): void {
    if (!this.canStartJob()) {
      return;
    }
    const count = this.preview.willProcessCount;
    const estSec = this.preview.estimatedDurationSeconds || count * 2;
    Swal.fire({
      title: 'Start bulk E-Invoice generation?',
      html: `This job will generate IRN for <b>${count}</b> invoice(s) — one batch, fixed size <b>${this.fixedBatchSize}</b>.<br/>Estimated time: ~${Math.ceil(estSec / 60)} min.<br/>You can cancel while the job runs.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Start',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      const performedBy = Number(this.generalService.getUserID());
      this.jobRunning = true;
      this.initProgressFromPreview();
      this.service.startJob(this.buildCriteria(), performedBy).subscribe({
        next: (res) => {
          this.activeJobId = res.jobId;
          this.startPolling(res.jobId);
          this.showMessage(`Job ${res.jobId} started.`, 'success');
        },
        error: (err) => {
          this.jobRunning = false;
          this.showMessage(this.extractError(err), 'error');
        },
      });
    });
  }

  cancelJob(): void {
    if (!this.activeJobId) {
      return;
    }
    this.service.cancelJob(this.activeJobId).subscribe({
      next: () => this.showMessage('Cancel requested.', 'success'),
      error: () => this.showMessage('Cancel request failed.', 'error'),
    });
  }

  private initProgressFromPreview(): void {
    this.progressRows = (this.preview?.invoices || []).map((inv) => ({
      invoiceNumber: inv.invoiceNumberWithPrefix,
      status: 'Pending',
    }));
    this.jobErrors = [];
  }

  private startPolling(jobId: number): void {
    this.stopPolling();
    this.pollSub = timer(0, 2000)
      .pipe(
        switchMap(() => this.service.getJob(jobId)),
        takeWhile((job) => this.isJobRunning(job?.jobStatus), true)
      )
      .subscribe({
        next: (job) => {
          this.activeJob = job;
          this.refreshProgressFromJob(jobId, job);
          if (!this.isJobRunning(job?.jobStatus)) {
            this.jobRunning = false;
            this.loadJobErrors(jobId);
            this.previewCandidates();
          }
        },
        error: () => {
          this.jobRunning = false;
        },
      });
  }

  private refreshProgressFromJob(jobId: number, job: BulkUploadJobStatus): void {
    this.service.getJobErrors(jobId).subscribe({
      next: (errors) => {
        this.jobErrors = errors || [];
        const byFile = new Map<string, string>();
        (errors || []).forEach((e: any) => {
          const name = e.fileName || e.FileName;
          const desc = e.errorDescription || e.ErrorDescription || '';
          if (name) {
            byFile.set(name, desc);
          }
        });
        this.progressRows = this.progressRows.map((row) => {
          const msg = byFile.get(row.invoiceNumber);
          if (!msg) {
            return row;
          }
          if (msg.includes('[OK]')) {
            return { ...row, status: 'Success', message: msg };
          }
          if (msg.includes('[SKIPPED]')) {
            return { ...row, status: 'Skipped', message: msg };
          }
          return { ...row, status: 'Failed', message: msg };
        });
      },
    });
  }

  private loadJobErrors(jobId: number): void {
    this.service.getJobErrors(jobId).subscribe({
      next: (errors) => (this.jobErrors = errors || []),
    });
  }

  private stopPolling(): void {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
      this.pollSub = null;
    }
  }

  private isJobRunning(status?: string): boolean {
    const s = (status || '').toLowerCase();
    return s === 'pending' || s === 'processing';
  }

  getJobStatusLabel(): string {
    return this.activeJob?.jobStatus || (this.jobRunning ? 'Processing' : '—');
  }

  private normalizePreview(res: any): BulkEInvoicePreviewResult {
    return {
      totalMatchedCount: res.totalMatchedCount ?? res.TotalMatchedCount ?? 0,
      candidateCount: res.candidateCount ?? res.CandidateCount ?? 0,
      willProcessCount: res.willProcessCount ?? res.WillProcessCount ?? 0,
      maxPerBatch: res.maxPerBatch ?? res.MaxPerBatch ?? 0,
      estimatedBatchCount: res.estimatedBatchCount ?? res.EstimatedBatchCount ?? 1,
      throttleMilliseconds: res.throttleMilliseconds ?? res.ThrottleMilliseconds ?? 1500,
      estimatedDurationSeconds: res.estimatedDurationSeconds ?? res.EstimatedDurationSeconds ?? 0,
      invoices: (res.invoices ?? res.Invoices ?? []).map((inv: any) => ({
        invoiceID: inv.invoiceID ?? inv.InvoiceID,
        invoiceNumberWithPrefix: inv.invoiceNumberWithPrefix ?? inv.InvoiceNumberWithPrefix,
        invoiceDate: inv.invoiceDate ?? inv.InvoiceDate,
        customerName: inv.customerName ?? inv.CustomerName,
        invoiceType: inv.invoiceType ?? inv.InvoiceType,
        generateIrnInvoiceType: inv.generateIrnInvoiceType ?? inv.GenerateIrnInvoiceType,
      })),
    };
  }

  private extractError(err: any): string {
    return err?.error?.message || err?.message || 'Operation failed.';
  }

  private showMessage(message: string, kind: 'success' | 'error' | 'warning'): void {
    const panelClass = kind === 'success' ? 'snackbar-success' : kind === 'warning' ? 'snackbar-warning' : 'snackbar-danger';
    this.snackBar.open(message, '', { duration: 4000, panelClass: [panelClass], verticalPosition: 'bottom', horizontalPosition: 'center' });
  }
}
