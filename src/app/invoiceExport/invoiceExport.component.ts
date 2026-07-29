// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { TableExportUtil } from '../shared/tableExportUtil';
import { InvoiceExportService } from './invoiceExport.service';
import {
  InvoiceExportRow,
  GeneralLineItemInvoiceGapRow,
  GeneralLinkedDutyGapRow,
  VerifiedGfbNotCalculatedCounts,
  VerifiedGfbNotCalculatedRow,
} from './invoiceExport.model';

@Component({
  standalone: false,
  selector: 'app-invoice-export',
  templateUrl: './invoiceExport.component.html',
  styleUrls: ['./invoiceExport.component.sass'],
})
export class InvoiceExportComponent implements OnInit {
  fromDateCtrl = new FormControl<Date | null>(null, Validators.required);
  toDateCtrl = new FormControl<Date | null>(null, Validators.required);
  exporting = false;

  constructor(
    private invoiceExportService: InvoiceExportService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const today = moment().utcOffset('+05:30');
    this.fromDateCtrl.setValue(today.clone().subtract(30, 'days').toDate());
    this.toDateCtrl.setValue(today.toDate());
  }

  downloadAllInvoices(): void {
    this.exportInvoices('all');
  }

  downloadDuplicateInvoices(): void {
    this.exportInvoices('duplicates');
  }

  downloadGeneralLineItemInvoiceGap(): void {
    const validationError = this.validateDates();
    if (validationError) {
      this.showNotification('snackbar-warning', validationError);
      return;
    }

    const fromDate = this.formatDate(this.fromDateCtrl.value);
    const toDate = this.formatDate(this.toDateCtrl.value);
    this.exporting = true;
    this.invoiceExportService.getGeneralLineItemInvoiceGaps(fromDate, toDate).subscribe({
      next: (rows) => {
        this.exporting = false;
        if (!rows?.length) {
          this.showNotification(
            'snackbar-warning',
            'No general bills with line-item vs invoice header gaps found for the selected date range.'
          );
          return;
        }
        this.downloadGeneralLineItemGapExcel(rows);
        this.showNotification('snackbar-success', `${rows.length} record(s) exported successfully.`);
      },
      error: (error) => this.handleExportError(error, 'general line-item vs invoice gaps'),
    });
  }

  downloadGeneralLinkedDutyGap(): void {
    const validationError = this.validateDates();
    if (validationError) {
      this.showNotification('snackbar-warning', validationError);
      return;
    }

    const fromDate = this.formatDate(this.fromDateCtrl.value);
    const toDate = this.formatDate(this.toDateCtrl.value);
    this.exporting = true;
    this.invoiceExportService.getGeneralLinkedDutyGaps(fromDate, toDate).subscribe({
      next: (rows) => {
        this.exporting = false;
        if (!rows?.length) {
          this.showNotification(
            'snackbar-warning',
            'No general bills with header vs linked-duty gaps found for the selected date range.'
          );
          return;
        }
        this.downloadGeneralLinkedDutyGapExcel(rows);
        this.showNotification('snackbar-success', `${rows.length} record(s) exported successfully.`);
      },
      error: (error) => this.handleExportError(error, 'general header vs linked-duty gaps'),
    });
  }

  showVerifiedGfbNotCalculatedCount(): void {
    const validationError = this.validateDates();
    if (validationError) {
      this.showNotification('snackbar-warning', validationError);
      return;
    }

    const fromDate = this.formatDate(this.fromDateCtrl.value);
    const toDate = this.formatDate(this.toDateCtrl.value);
    this.exporting = true;
    this.invoiceExportService.getVerifiedGfbNotCalculatedCounts(fromDate, toDate).subscribe({
      next: (counts) => {
        this.exporting = false;
        const parsed = this.normalizeCounts(counts);
        Swal.fire({
          title: 'Verified + GFB — Not Calculated',
          html: `
            <p style="margin-bottom:8px;">Billing pickup date: <strong>${this.formatDisplayDate(fromDate)}</strong> to <strong>${this.formatDisplayDate(toDate)}</strong></p>
            <table style="width:100%;text-align:left;border-collapse:collapse;">
              <tr><td style="padding:6px 0;">Not calculated (Calculate Bill never run)</td><td style="padding:6px 0;text-align:right;"><strong>${parsed.notCalculated}</strong></td></tr>
              <tr><td style="padding:6px 0;">Partial — customer snapshot missing</td><td style="padding:6px 0;text-align:right;"><strong>${parsed.partialMissingCustomer}</strong></td></tr>
              <tr><td style="padding:6px 0;border-top:1px solid #ddd;">Total needing action</td><td style="padding:6px 0;text-align:right;border-top:1px solid #ddd;"><strong>${parsed.totalNeedingAction}</strong></td></tr>
            </table>
          `,
          icon: parsed.totalNeedingAction > 0 ? 'warning' : 'success',
          confirmButtonText: 'Ok',
        });
      },
      error: (error) => {
        this.exporting = false;
        Swal.fire({
          title: 'Failed to load count',
          text: error?.error?.message || error?.message || 'Could not fetch duty counts.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  async downloadVerifiedGfbNotCalculatedList(): Promise<void> {
    const validationError = this.validateDates();
    if (validationError) {
      this.showNotification('snackbar-warning', validationError);
      return;
    }

    const fromDate = this.formatDate(this.fromDateCtrl.value);
    const toDate = this.formatDate(this.toDateCtrl.value);
    this.exporting = true;

    try {
      const rows = await this.fetchAllVerifiedGfbNotCalculatedRows(fromDate, toDate);
      this.exporting = false;

      if (!rows.length) {
        this.showNotification(
          'snackbar-warning',
          'No verified + GFB duties missing calculation for the selected date range.'
        );
        return;
      }

      this.downloadVerifiedGfbExcel(rows);
      this.showNotification(
        'snackbar-success',
        `${rows.length} duty record(s) exported successfully.`
      );
    } catch (error) {
      this.exporting = false;
      Swal.fire({
        title: 'Failed to export duties',
        text: error?.error?.message || error?.message || 'Could not download duty list.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  }

  private async fetchAllVerifiedGfbNotCalculatedRows(
    fromDate: string,
    toDate: string
  ): Promise<VerifiedGfbNotCalculatedRow[]> {
    const pageSize = 500;
    let page = 1;
    let allRows: VerifiedGfbNotCalculatedRow[] = [];
    let totalRows = 0;

    do {
      const report = await firstValueFrom(
        this.invoiceExportService.getVerifiedGfbNotCalculatedReport(fromDate, toDate, page, pageSize)
      );
      const batch = report?.items ?? [];
      totalRows = report?.totalRows ?? batch.length;
      allRows = allRows.concat(batch);
      page += 1;
    } while (allRows.length < totalRows);

    return allRows;
  }

  private normalizeCounts(counts: VerifiedGfbNotCalculatedCounts): VerifiedGfbNotCalculatedCounts {
    return {
      notCalculated: counts?.notCalculated ?? counts?.NotCalculated ?? 0,
      partialMissingCustomer: counts?.partialMissingCustomer ?? counts?.PartialMissingCustomer ?? 0,
      totalNeedingAction: counts?.totalNeedingAction ?? counts?.TotalNeedingAction ?? 0,
    };
  }

  private downloadVerifiedGfbExcel(rows: VerifiedGfbNotCalculatedRow[]): void {
    const exportRows = rows.map((row) => ({
      'DS No.': row.dutySlipID ?? row.DutySlipID,
      'Res. No.': row.reservationID ?? row.ReservationID,
      Customer: row.customerName ?? row.CustomerName ?? '',
      Guest: row.guestName ?? row.GuestName ?? '',
      City: row.city ?? row.City ?? '',
      'Billing Pickup Date': this.formatInvoiceDate(row.pickUpDateForBilling ?? row.PickUpDateForBilling),
      'Pickup Date': this.formatInvoiceDate(row.pickUpDate),
      'Dropoff Date': this.formatInvoiceDate(row.dropOffDate),
      'Calc Status': row.calcStatus ?? row.CalcStatus ?? '',
      'Invoice Calculation ID': row.invoiceCalculationID ?? '',
      'Invoice ID': row.invoiceID ?? '',
    }));
    TableExportUtil.exportToExcel(exportRows, 'Verified-GFB-Not-Calculated');
  }

  private formatDisplayDate(value: string): string {
    const parsed = moment(value, 'YYYY-MM-DD');
    return parsed.isValid() ? parsed.format('DD-MM-YYYY') : value;
  }

  private exportInvoices(mode: 'all' | 'duplicates'): void {
    const validationError = this.validateDates();
    if (validationError) {
      this.showNotification('snackbar-warning', validationError);
      return;
    }

    const fromDate = this.formatDate(this.fromDateCtrl.value);
    const toDate = this.formatDate(this.toDateCtrl.value);
    const request$ =
      mode === 'all'
        ? this.invoiceExportService.getAllInvoices(fromDate, toDate)
        : this.invoiceExportService.getDuplicateInvoices(fromDate, toDate);

    this.exporting = true;
    request$.subscribe({
      next: (rows) => {
        this.exporting = false;
        if (!rows?.length) {
          this.showNotification(
            'snackbar-warning',
            mode === 'all'
              ? 'No invoices found for the selected date range.'
              : 'No duplicate invoices found for the selected date range.'
          );
          return;
        }
        this.downloadExcel(rows, mode === 'all' ? 'All-Invoices' : 'Duplicate-Invoices');
        this.showNotification(
          'snackbar-success',
          `${rows.length} record(s) exported successfully.`
        );
      },
      error: (error) => {
        this.exporting = false;
        this.showNotification(
          'snackbar-danger',
          error?.error?.message || 'Failed to export invoices.'
        );
      },
    });
  }

  private validateDates(): string | null {
    if (!this.fromDateCtrl.value) {
      return 'From Date is required.';
    }
    if (!this.toDateCtrl.value) {
      return 'To Date is required.';
    }
    const from = moment(this.fromDateCtrl.value).startOf('day');
    const to = moment(this.toDateCtrl.value).startOf('day');
    if (from.isAfter(to)) {
      return 'From Date cannot be greater than To Date.';
    }
    return null;
  }

  private formatDate(value: Date): string {
    return moment(value).format('YYYY-MM-DD');
  }

  private downloadGeneralLineItemGapExcel(rows: GeneralLineItemInvoiceGapRow[]): void {
    const exportRows = rows.map((row) => ({
      'Invoice No.': row.invoiceNumberWithPrefix ?? row.InvoiceNumberWithPrefix ?? '',
      'Invoice.TotalAmountAfterDiscout':
        row.totalAmountAfterDiscout ?? row.TotalAmountAfterDiscout ?? 0,
      'InvoiceGeneralLineItems.BaseAmount':
        row.generalLineItemsBaseAmount ?? row.GeneralLineItemsBaseAmount ?? 0,
    }));
    TableExportUtil.exportToExcel(exportRows, 'General-Line-Item-Invoice-Gap');
  }

  private downloadGeneralLinkedDutyGapExcel(rows: GeneralLinkedDutyGapRow[]): void {
    const exportRows = rows.map((row) => {
      const headerAfterGst = row.invoiceTotalAmountAfterGST ?? row.InvoiceTotalAmountAfterGST ?? 0;
      const linkedAfterGst = row.linkedDutyTotalAfterGST ?? row.LinkedDutyTotalAfterGST ?? 0;
      return {
        'Invoice No.': row.invoiceNumberWithPrefix ?? row.InvoiceNumberWithPrefix ?? '',
        'Invoice.InvoiceTotalAmountAfterGST': headerAfterGst,
        'Linked InvoiceCalculation TotalAmountAfterGST': linkedAfterGst,
        Gap: Number((headerAfterGst - linkedAfterGst).toFixed(2)),
        'Linked Calc Count': row.linkedCalcCount ?? row.LinkedCalcCount ?? 0,
      };
    });
    TableExportUtil.exportToExcel(exportRows, 'General-Header-Linked-Duty-Gap');
  }

  private handleExportError(error: any, label: string): void {
    this.exporting = false;
    const status = error?.status;
    const msg = error?.error?.message || error?.message;
    let text = msg || `Failed to export ${label}.`;
    if (status === 404) {
      text =
        'Export API not found on this server (404). Rebuild and restart RententAPI — the Forensic export endpoint is not deployed yet.';
    } else if (status === 0) {
      text = 'Could not reach the API. Check that RententAPI is running and the base URL is correct.';
    }
    this.showNotification('snackbar-danger', text);
  }

  private downloadExcel(rows: InvoiceExportRow[], filePrefix: string): void {
    const exportRows = rows.map((row) => ({
      'Invoice ID': row.invoiceID ?? row.InvoiceID,
      'Invoice Date (DD-MM-YYYY)': this.formatInvoiceDate(row.invoiceDate ?? row.InvoiceDate),
      'Invoice Prefix': row.invoicePrefix ?? row.InvoicePrefix ?? '',
      'Invoice Number': row.invoiceNumber ?? row.InvoiceNumber ?? '',
      'Invoice Number With Prefix':
        row.invoiceNumberWithPrefix ?? row.InvoiceNumberWithPrefix ?? '',
    }));
    TableExportUtil.exportToExcel(exportRows, filePrefix);
  }

  private formatInvoiceDate(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }
    const parsed = moment(value);
    return parsed.isValid() ? parsed.format('DD-MM-YYYY') : String(value);
  }

  private showNotification(panelClass: string, text: string): void {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass,
    });
  }
}
