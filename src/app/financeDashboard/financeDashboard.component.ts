// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { forkJoin } from 'rxjs';
import { AuthService } from '../core/service/auth.service';
import { FinanceDashboardService } from './financeDashboard.service';
import { FinanceDashboardDrilldownDialogComponent } from './financeDashboard-drilldown-dialog.component';

@Component({
  standalone: false,
  selector: 'app-finance-dashboard',
  templateUrl: './financeDashboard.component.html',
  styleUrls: ['./financeDashboard.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class FinanceDashboardComponent implements OnInit {
  readonly minFilterDate = new Date(2026, 4, 16);

  loading = false;
  lastRefreshed: Date | null = null;
  employeeID = 0;

  filterDateFrom = new FormControl<Date>(this.defaultFilterDate());
  filterDateTo = new FormControl<Date>(this.defaultFilterDate());
  dataFromLaunchDate = new FormControl<boolean>(false);
  seriesFilter = new FormControl<string | null>(null);
  invoiceTypeFilter = new FormControl<string | null>(null);
  documentTypeFilter = new FormControl<'Invoice' | 'CreditNote'>('Invoice');
  // Series Jump scope: false (default) = gaps checked against all invoices (ActivationStatus ignored),
  // true = only ActivationStatus = 1 invoices are considered.
  seriesJumpActiveOnly = new FormControl<boolean>(false);

  filterOptions: any = { series: [], invoiceTypes: [] };

  summary: any = {};
  invoiceRows: any[] = [];
  creditNoteRows: any[] = [];

  // Wrong Inv Type placed early (after Total) so it is always visible without scrolling.
  invoiceTableColumns = [
    'seriesName', 'minNumber', 'maxNumber', 'totalDocuments',
    'wrongInvoiceTypeCount',
    'generalCount', 'singleDutyCount', 'multipleDutyCount',
    'duplicateCount', 'seriesJumpCount', 'dateViolationCount',
    'nullPrefixCount', 'amountMismatchCount', 'stateGstMismatchCount',
    'missingCustomerGstCount', 'taxMismatchCount', 'invoiceCalculationMismatchCount',
  ];

  creditNoteTableColumns = [
    'seriesName', 'minNumber', 'maxNumber', 'totalDocuments',
    'duplicateCount', 'seriesJumpCount', 'dateViolationCount',
    'nullPrefixCount', 'amountMismatchCount', 'stateGstMismatchCount',
    'missingCustomerGstCount', 'taxMismatchCount',
  ];

  invoiceKpiCards = [
    { key: 'totalInvoices', label: 'Total Invoices', validationCode: 'TotalDocuments', docType: 'Invoice', format: 'number', accent: 'blue', icon: 'receipt_long' },
    { key: 'invoicesWithErrors', label: 'Invoices with Errors', validationCode: 'InvoicesWithErrors', docType: 'Invoice', format: 'number', accent: 'coral', icon: 'error_outline' },
  ];

  creditNoteKpiCards = [
    { key: 'totalCreditNotes', label: 'Total Credit Notes', validationCode: 'TotalDocuments', docType: 'CreditNote', format: 'number', accent: 'teal', icon: 'note_add' },
    { key: 'creditNotesWithErrors', label: 'Credit Notes with Errors', validationCode: 'CreditNotesWithErrors', docType: 'CreditNote', format: 'number', accent: 'amber', icon: 'report_problem' },
  ];

  get activeKpiCards(): any[] {
    return this.isInvoiceView ? this.invoiceKpiCards : this.creditNoteKpiCards;
  }

  private normalizeSummary(summary: any): any {
    if (!summary) return {};
    return {
      totalInvoices: summary.totalInvoices ?? summary.TotalInvoices,
      totalCreditNotes: summary.totalCreditNotes ?? summary.TotalCreditNotes,
      invoicesWithErrors: summary.invoicesWithErrors ?? summary.InvoicesWithErrors,
      creditNotesWithErrors: summary.creditNotesWithErrors ?? summary.CreditNotesWithErrors,
      totalDuplicateInvoices: summary.totalDuplicateInvoices ?? summary.TotalDuplicateInvoices,
      totalSeriesJumps: summary.totalSeriesJumps ?? summary.TotalSeriesJumps,
    };
  }

  private normalizeSeriesRow(row: any): any {
    if (!row) return row;
    const severity = row.severity ?? row.Severity ?? {};
    return {
      ...row,
      seriesName: row.seriesName ?? row.SeriesName,
      minNumber: row.minNumber ?? row.MinNumber,
      maxNumber: row.maxNumber ?? row.MaxNumber,
      totalDocuments: row.totalDocuments ?? row.TotalDocuments,
      generalCount: row.generalCount ?? row.GeneralCount,
      singleDutyCount: row.singleDutyCount ?? row.SingleDutyCount,
      multipleDutyCount: row.multipleDutyCount ?? row.MultipleDutyCount,
      duplicateCount: row.duplicateCount ?? row.DuplicateCount,
      seriesJumpCount: row.seriesJumpCount ?? row.SeriesJumpCount,
      dateViolationCount: row.dateViolationCount ?? row.DateViolationCount,
      nullPrefixCount: row.nullPrefixCount ?? row.NullPrefixCount,
      amountMismatchCount: row.amountMismatchCount ?? row.AmountMismatchCount,
      stateGstMismatchCount: row.stateGstMismatchCount ?? row.StateGstMismatchCount,
      missingCustomerGstCount: row.missingCustomerGstCount ?? row.MissingCustomerGstCount,
      taxMismatchCount: row.taxMismatchCount ?? row.TaxMismatchCount,
      invoiceCalculationMismatchCount: row.invoiceCalculationMismatchCount ?? row.InvoiceCalculationMismatchCount ?? 0,
      wrongInvoiceTypeCount: row.wrongInvoiceTypeCount ?? row.WrongInvoiceTypeCount ?? 0,
      severity: {
        duplicateCount: severity.duplicateCount ?? severity.DuplicateCount,
        seriesJumpCount: severity.seriesJumpCount ?? severity.SeriesJumpCount,
        dateViolationCount: severity.dateViolationCount ?? severity.DateViolationCount,
        nullPrefixCount: severity.nullPrefixCount ?? severity.NullPrefixCount,
        amountMismatchCount: severity.amountMismatchCount ?? severity.AmountMismatchCount,
        stateGstMismatchCount: severity.stateGstMismatchCount ?? severity.StateGstMismatchCount,
        missingCustomerGstCount: severity.missingCustomerGstCount ?? severity.MissingCustomerGstCount,
        taxMismatchCount: severity.taxMismatchCount ?? severity.TaxMismatchCount,
        invoiceCalculationMismatchCount: severity.invoiceCalculationMismatchCount ?? severity.InvoiceCalculationMismatchCount,
        wrongInvoiceTypeCount: severity.wrongInvoiceTypeCount ?? severity.WrongInvoiceTypeCount,
      },
    };
  }

  constructor(
    private service: FinanceDashboardService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeID = this.getCurrentUserId();
    if (this.employeeID <= 0) {
      this.snackBar.open('Unable to resolve logged-in employee. Please sign in again.', 'Close', { duration: 5000 });
      return;
    }
    this.loadDashboardData();
  }

  private defaultFilterDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today >= this.minFilterDate ? today : new Date(this.minFilterDate);
  }

  private getCurrentUserId(): number {
    const emp = this.authService.currentUserValue?.employee as any;
    const id = emp?.EmployeeID ?? emp?.employeeID ?? emp?.UserID ?? emp?.userID ?? 0;
    return Number(id) || 0;
  }

  getFilters(): any {
    const fromRaw = this.filterDateFrom.value;
    const toRaw = this.filterDateTo.value;
    let from = fromRaw && fromRaw < this.minFilterDate ? this.minFilterDate : fromRaw;
    let to = toRaw && toRaw < this.minFilterDate ? this.minFilterDate : toRaw;
    if (from && to && to < from) {
      const tmp = from;
      from = to;
      to = tmp;
    }
    const fromStr = moment(from || this.minFilterDate).format('YYYY-MM-DD');
    const toStr = moment(to || from || this.minFilterDate).format('YYYY-MM-DD');
    return {
      filterDate: toStr,
      filterDateFrom: fromStr,
      filterDateTo: toStr,
      dataFromLaunchDate: !!this.dataFromLaunchDate.value,
      employeeID: this.employeeID,
      seriesPrefix: this.seriesFilter.value,
      invoiceType: this.invoiceTypeFilter.value,
      seriesJumpActiveOnly: !!this.seriesJumpActiveOnly.value,
    };
  }

  toggleSeriesJumpActiveOnly(event: Event): void {
    event.preventDefault();
    this.seriesJumpActiveOnly.setValue(!this.seriesJumpActiveOnly.value);
    this.refresh();
  }

  loadFilterOptions(): void {
    this.service.getFilterOptions(this.getFilters()).subscribe({
      next: (opts) => {
        this.filterOptions = this.normalizeFilterOptions(opts);
      },
      error: (err) => {
        this.snackBar.open(err?.error || 'Failed to load filter options', 'Close', { duration: 4000 });
      },
    });
  }

  private loadDashboardData(): void {
    if (this.employeeID <= 0) return;
    this.loading = true;
    const filters = this.getFilters();
    forkJoin({
      opts: this.service.getFilterOptions(filters),
      dash: this.service.getDashboard(filters),
    }).subscribe({
      next: ({ opts, dash }) => {
        this.filterOptions = this.normalizeFilterOptions(opts);
        this.applyDashboardResponse(dash);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        const msg = typeof err?.error === 'string' ? err.error : err?.message || 'Failed to load dashboard';
        this.snackBar.open(msg, 'Close', { duration: 6000 });
      },
    });
  }

  private normalizeFilterOptions(opts: any): any {
    const mapItem = (item: any) => ({
      id: item?.id ?? item?.ID,
      name: item?.name ?? item?.Name ?? '',
    });
    return {
      series: (opts?.series ?? opts?.Series ?? []).map(mapItem),
      invoiceTypes: opts?.invoiceTypes ?? opts?.InvoiceTypes ?? [],
    };
  }

  onApply(): void {
    if (this.filterDateFrom.value && this.filterDateFrom.value < this.minFilterDate) {
      this.filterDateFrom.setValue(new Date(this.minFilterDate));
    }
    if (this.filterDateTo.value && this.filterDateTo.value < this.minFilterDate) {
      this.filterDateTo.setValue(new Date(this.minFilterDate));
    }
    if (this.filterDateFrom.value && this.filterDateTo.value
        && this.filterDateTo.value < this.filterDateFrom.value) {
      const from = this.filterDateFrom.value;
      this.filterDateFrom.setValue(this.filterDateTo.value);
      this.filterDateTo.setValue(from);
    }
    this.loadDashboardData();
  }

  refresh(): void {
    if (this.employeeID <= 0) return;
    this.loading = true;
    this.service.getDashboard(this.getFilters()).subscribe({
      next: (res) => {
        this.applyDashboardResponse(res);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        const msg = typeof err?.error === 'string' ? err.error : err?.message || 'Failed to load dashboard';
        this.snackBar.open(msg, 'Close', { duration: 6000 });
      },
    });
  }

  private applyDashboardResponse(res: any): void {
    const rawSummary = res?.summary ?? res?.Summary ?? {};
    this.summary = this.normalizeSummary(rawSummary);
    const invoiceSeries = res?.invoiceSeries ?? res?.InvoiceSeries ?? [];
    const creditSeries = res?.creditNoteSeries ?? res?.CreditNoteSeries ?? [];
    this.invoiceRows = invoiceSeries.map((row: any) => this.normalizeSeriesRow(row));
    this.creditNoteRows = creditSeries.map((row: any) => this.normalizeSeriesRow(row));
    const seriesError = res?.invoiceSeriesError ?? res?.InvoiceSeriesError;
    if (seriesError) {
      this.snackBar.open(`Invoice series query failed: ${seriesError}`, 'Close', { duration: 12000 });
    }
    this.lastRefreshed = new Date();
  }

  severityClass(row: any, field: string): string {
    return row?.severity?.[field] ? 'fd-cell--' + row.severity[field] : 'fd-cell--green';
  }

  openDrillDown(documentType: string, validationCode: string, seriesName: string | null, title: string): void {
    if (!validationCode) return;
    this.dialog.open(FinanceDashboardDrilldownDialogComponent, {
      width: '95vw',
      maxWidth: '1200px',
      data: { filters: this.getFilters(), documentType, validationCode, seriesName, title },
    });
  }

  openKpiDrillDown(card: any): void {
    if (!card.validationCode) return;
    this.openDrillDown(card.docType || 'Invoice', card.validationCode, null, card.label);
  }

  openCellDrillDown(row: any, documentType: string, validationCode: string, label: string): void {
    this.openDrillDown(documentType, validationCode, row.seriesName, `${label} — ${row.seriesName}`);
  }

  formatKpi(card: any): string {
    const val = this.summary[card.key];
    return val != null ? String(val) : '—';
  }

  isKpiClickable(card: any): boolean {
    return !!card.validationCode && Number(this.summary[card.key]) > 0;
  }

  errorColumnHeader(label: string, field: string, documentType: 'Invoice' | 'CreditNote' = 'Invoice'): string {
    const rows = documentType === 'Invoice' ? this.invoiceRows : this.creditNoteRows;
    const total = (rows || []).reduce((sum, row) => sum + (Number(row?.[field]) || 0), 0);
    return `${label}(${total})`;
  }

  get isInvoiceView(): boolean {
    return this.documentTypeFilter.value === 'Invoice';
  }

  get isDateFilterDisabled(): boolean {
    return !!this.dataFromLaunchDate.value;
  }
}
