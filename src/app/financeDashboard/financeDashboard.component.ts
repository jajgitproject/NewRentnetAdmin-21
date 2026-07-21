// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
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
  documentTypeFilter = new FormControl<'Invoice' | 'CreditNote'>('Invoice');
  // Series Jump scope: false (default) = gaps checked against all invoices (ActivationStatus ignored),
  // true = only ActivationStatus = 1 invoices are considered.
  seriesJumpActiveOnly = new FormControl<boolean>(false);

  summary: any = {};
  invoiceRows: any[] = [];
  creditNoteRows: any[] = [];

  // Wrong Inv Type sits after Multiple Duty, before Duplicate.
  // Gen vs Duties (Yellow) after Invoice Calc — link-only General header vs linked calcs.
  invoiceTableColumns = [
    'seriesName', 'totalDocuments',
    'generalCount', 'singleDutyCount', 'multipleDutyCount',
    'wrongInvoiceTypeCount',
    'duplicateCount', 'seriesJumpCount', 'dateViolationCount',
    'nullPrefixCount', 'prefixMismatchCount', 'amountMismatchCount', 'stateGstMismatchCount',
    'missingCustomerGstCount', 'taxMismatchCount', 'invoiceCalculationMismatchCount',
    'generalLinkAmountGapCount',
  ];

  creditNoteTableColumns = [
    'seriesName', 'totalDocuments',
    'duplicateCount', 'seriesJumpCount', 'dateViolationCount',
    'nullPrefixCount', 'prefixMismatchCount', 'amountMismatchCount', 'stateGstMismatchCount',
    'missingCustomerGstCount', 'taxMismatchCount',
    'printGstSourceDriftCount', 'cnTaxProfileMismatchCount', 'cnAmountCeilingCount',
    'multiCreditNoteCount', 'orphanInvoiceLinkCount', 'cnIrnConsistencyCount',
    'percentageAmountMismatchCount',
  ];

  invoiceKpiRow1 = [
    { key: 'totalInvoices', label: 'Total Invoices', validationCode: 'TotalDocuments', docType: 'Invoice', format: 'number', accent: 'blue', icon: 'receipt_long' },
    { key: 'invoiceRevenueExGst', label: 'Invoice Revenue (ex-GST)', validationCode: null, docType: 'Invoice', format: 'currency', accent: 'teal', icon: 'payments' },
    { key: 'totalGst', label: 'Total GST', validationCode: null, docType: 'Invoice', format: 'currency', accent: 'amber', icon: 'account_balance' },
    { key: 'invoiceRevenueIncGst', label: 'Invoice Revenue (inc-GST)', validationCode: null, docType: 'Invoice', format: 'currency', accent: 'blue', icon: 'currency_rupee' },
  ];

  invoiceKpiRow2 = [
    { key: 'invoicesWithErrors', label: 'Invoices with Errors', validationCode: 'InvoicesWithErrors', docType: 'Invoice', format: 'number', accent: 'coral', icon: 'error_outline' },
    { key: 'totalDuplicateInvoices', label: 'Total Duplicate Invoices', validationCode: 'DuplicateNumbers', docType: 'Invoice', format: 'number', accent: 'coral', icon: 'content_copy' },
    { key: 'totalSeriesJumps', label: 'Total Invoice Series Jumps', validationCode: 'SeriesJump', docType: 'Invoice', format: 'number', accent: 'amber', icon: 'trending_flat' },
    { key: 'invoicesWithIrn', label: 'Invoices with IRN', validationCode: 'InvoicesWithIrn', docType: 'Invoice', format: 'number', accent: 'teal', icon: 'verified' },
    { key: 'invoicesWithoutIrn', label: 'Invoices without IRN', validationCode: 'InvoicesWithoutIrn', docType: 'Invoice', format: 'number', accent: 'amber', icon: 'unpublished' },
  ];

  invoiceKpiRow3 = [
    { key: 'unbilledDuties', label: 'Unbilled Duties', validationCode: null, docType: 'Invoice', format: 'number', accent: 'coral', icon: 'assignment_late' },
    { key: 'pendingRevenue', label: 'Pending Revenue', validationCode: null, docType: 'Invoice', format: 'currency', accent: 'teal', icon: 'pending_actions' },
    { key: 'lowestDutySlipUnbilled', label: 'Lowest Duty Slip Unbilled', validationCode: null, docType: 'Invoice', format: 'lowestUnbilled', accent: 'amber', icon: 'event_busy' },
  ];

  get invoiceKpiCards(): any[] {
    return [...this.invoiceKpiRow1, ...this.invoiceKpiRow2, ...this.invoiceKpiRow3];
  }

  creditNoteKpiCards = [
    { key: 'totalCreditNotes', label: 'Total Credit Notes', validationCode: 'TotalDocuments', docType: 'CreditNote', format: 'number', accent: 'teal', icon: 'note_add' },
    { key: 'creditNoteAmount', label: 'CN Amount (gross)', validationCode: null, docType: 'CreditNote', format: 'currency', accent: 'blue', icon: 'payments' },
    { key: 'creditNoteGst', label: 'CN GST', validationCode: null, docType: 'CreditNote', format: 'currency', accent: 'amber', icon: 'account_balance' },
    { key: 'creditNotesWithErrors', label: 'Credit Notes with Errors', validationCode: 'CreditNotesWithErrors', docType: 'CreditNote', format: 'number', accent: 'amber', icon: 'report_problem' },
    { key: 'pendingCreditNotes', label: 'Pending Credit Notes', validationCode: 'PendingCreditNotes', docType: 'CreditNote', format: 'number', accent: 'coral', icon: 'hourglass_empty' },
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
      invoiceRevenueExGst: summary.invoiceRevenueExGst ?? summary.InvoiceRevenueExGst ?? summary.invoiceAmount ?? summary.InvoiceAmount,
      invoiceRevenueIncGst: summary.invoiceRevenueIncGst ?? summary.InvoiceRevenueIncGst,
      totalGst: summary.totalGst ?? summary.TotalGst,
      creditNoteAmount: summary.creditNoteAmount ?? summary.CreditNoteAmount,
      creditNoteGst: summary.creditNoteGst ?? summary.CreditNoteGst,
      pendingCreditNotes: summary.pendingCreditNotes ?? summary.PendingCreditNotes,
      invoicesWithIrn: summary.invoicesWithIrn ?? summary.InvoicesWithIrn,
      invoicesWithoutIrn: summary.invoicesWithoutIrn ?? summary.InvoicesWithoutIrn,
      unbilledDuties: summary.unbilledDuties ?? summary.UnbilledDuties,
      pendingRevenue: summary.pendingRevenue ?? summary.PendingRevenue,
      lowestDutySlipUnbilled: summary.lowestDutySlipUnbilled ?? summary.LowestDutySlipUnbilled,
      lowestUnbilledDutySlipCount: summary.lowestUnbilledDutySlipCount ?? summary.LowestUnbilledDutySlipCount,
      lowestUnbilledReservationID: summary.lowestUnbilledReservationID ?? summary.LowestUnbilledReservationID,
      lowestUnbilledDutySlipID: summary.lowestUnbilledDutySlipID ?? summary.LowestUnbilledDutySlipID,
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
      prefixMismatchCount: row.prefixMismatchCount ?? row.PrefixMismatchCount ?? 0,
      amountMismatchCount: row.amountMismatchCount ?? row.AmountMismatchCount,
      stateGstMismatchCount: row.stateGstMismatchCount ?? row.StateGstMismatchCount,
      missingCustomerGstCount: row.missingCustomerGstCount ?? row.MissingCustomerGstCount,
      taxMismatchCount: row.taxMismatchCount ?? row.TaxMismatchCount,
      invoiceCalculationMismatchCount: row.invoiceCalculationMismatchCount ?? row.InvoiceCalculationMismatchCount ?? 0,
      wrongInvoiceTypeCount: row.wrongInvoiceTypeCount ?? row.WrongInvoiceTypeCount ?? 0,
      generalLinkAmountGapCount: row.generalLinkAmountGapCount ?? row.GeneralLinkAmountGapCount ?? 0,
      printGstSourceDriftCount: row.printGstSourceDriftCount ?? row.PrintGstSourceDriftCount ?? 0,
      cnTaxProfileMismatchCount: row.cnTaxProfileMismatchCount ?? row.CnTaxProfileMismatchCount ?? 0,
      cnAmountCeilingCount: row.cnAmountCeilingCount ?? row.CnAmountCeilingCount ?? 0,
      multiCreditNoteCount: row.multiCreditNoteCount ?? row.MultiCreditNoteCount ?? 0,
      orphanInvoiceLinkCount: row.orphanInvoiceLinkCount ?? row.OrphanInvoiceLinkCount ?? 0,
      cnIrnConsistencyCount: row.cnIrnConsistencyCount ?? row.CnIrnConsistencyCount ?? 0,
      percentageAmountMismatchCount: row.percentageAmountMismatchCount ?? row.PercentageAmountMismatchCount ?? 0,
      severity: {
        duplicateCount: severity.duplicateCount ?? severity.DuplicateCount,
        seriesJumpCount: severity.seriesJumpCount ?? severity.SeriesJumpCount,
        dateViolationCount: severity.dateViolationCount ?? severity.DateViolationCount,
        nullPrefixCount: severity.nullPrefixCount ?? severity.NullPrefixCount,
        prefixMismatchCount: severity.prefixMismatchCount ?? severity.PrefixMismatchCount,
        amountMismatchCount: severity.amountMismatchCount ?? severity.AmountMismatchCount,
        stateGstMismatchCount: severity.stateGstMismatchCount ?? severity.StateGstMismatchCount,
        missingCustomerGstCount: severity.missingCustomerGstCount ?? severity.MissingCustomerGstCount,
        taxMismatchCount: severity.taxMismatchCount ?? severity.TaxMismatchCount,
        invoiceCalculationMismatchCount: severity.invoiceCalculationMismatchCount ?? severity.InvoiceCalculationMismatchCount,
        wrongInvoiceTypeCount: severity.wrongInvoiceTypeCount ?? severity.WrongInvoiceTypeCount,
        generalLinkAmountGapCount: severity.generalLinkAmountGapCount ?? severity.GeneralLinkAmountGapCount,
        printGstSourceDriftCount: severity.printGstSourceDriftCount ?? severity.PrintGstSourceDriftCount,
        cnTaxProfileMismatchCount: severity.cnTaxProfileMismatchCount ?? severity.CnTaxProfileMismatchCount,
        cnAmountCeilingCount: severity.cnAmountCeilingCount ?? severity.CnAmountCeilingCount,
        multiCreditNoteCount: severity.multiCreditNoteCount ?? severity.MultiCreditNoteCount,
        orphanInvoiceLinkCount: severity.orphanInvoiceLinkCount ?? severity.OrphanInvoiceLinkCount,
        cnIrnConsistencyCount: severity.cnIrnConsistencyCount ?? severity.CnIrnConsistencyCount,
        percentageAmountMismatchCount: severity.percentageAmountMismatchCount ?? severity.PercentageAmountMismatchCount,
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
      seriesPrefix: null,
      invoiceType: null,
      seriesJumpActiveOnly: !!this.seriesJumpActiveOnly.value,
    };
  }

  toggleSeriesJumpActiveOnly(event: Event): void {
    event.preventDefault();
    this.seriesJumpActiveOnly.setValue(!this.seriesJumpActiveOnly.value);
    this.refresh();
  }

  private loadDashboardData(): void {
    if (this.employeeID <= 0) return;
    this.loading = true;
    this.service.getDashboard(this.getFilters()).subscribe({
      next: (dash) => {
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
    if (card.format === 'lowestUnbilled') {
      return this.formatLowestUnbilledCountAndDate();
    }

    const val = this.summary[card.key];
    if (val == null || val === '') return '—';
    if (card.format === 'currency') {
      const num = Number(val);
      if (Number.isNaN(num)) return '—';
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    }
    if (card.format === 'date') {
      const d = moment(val);
      return d.isValid() ? d.format('DD/MM/YYYY') : '—';
    }
    return String(val);
  }

  formatLowestUnbilledCountAndDate(): string {
    const count = Number(this.summary.lowestUnbilledDutySlipCount);
    const countStr = Number.isFinite(count)
      ? new Intl.NumberFormat('en-IN').format(count)
      : '—';
    if (!count) return countStr;

    const d = moment(this.summary.lowestDutySlipUnbilled);
    const datePart = d.isValid() ? d.format('DD/MM/YYYY') : '—';
    return `${countStr}  —  ${datePart}`;
  }

  formatUnbilledIds(): string {
    const resId = this.summary.lowestUnbilledReservationID ?? '—';
    const dsId = this.summary.lowestUnbilledDutySlipID ?? '—';
    return `ReservationID ${resId} · DutySlipID ${dsId}`;
  }

  isKpiClickable(card: any): boolean {
    if (!card.validationCode) return false;
    return Number(this.summary[card.key]) > 0;
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
