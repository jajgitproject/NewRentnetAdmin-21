// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { TableExportUtil } from '../shared/tableExportUtil';
import { InvoiceExportService } from './invoiceExport.service';
import { InvoiceExportRow } from './invoiceExport.model';

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
