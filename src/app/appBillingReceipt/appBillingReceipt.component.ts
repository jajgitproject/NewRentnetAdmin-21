// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { AppBillingReceiptService } from './appBillingReceipt.service';
import { AppBillingReceiptRow } from './appBillingReceipt.model';

@Component({
  standalone: false,
  selector: 'app-app-billing-receipt',
  templateUrl: './appBillingReceipt.component.html',
  styleUrls: ['./appBillingReceipt.component.sass'],
})
export class AppBillingReceiptComponent implements OnInit {
  filterForm: FormGroup;
  rows: AppBillingReceiptRow[] = [];
  loading = false;
  downloadingId: number | null = null;

  displayedColumns = [
    'appBillingReceiptID',
    'reservationID',
    'dutySlipID',
    'customerName',
    'customerCode',
    'tripDate',
    'totalAmount',
    'advance',
    'totalPayableAfterAdvance',
    'createdOn',
    'actions',
  ];

  constructor(
    private fb: FormBuilder,
    private appBillingReceiptService: AppBillingReceiptService,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      reservationID: [null],
      fromDate: [null],
      toDate: [null],
      customerName: [''],
      customerCode: [''],
    });
  }

  ngOnInit(): void {
    const today = moment().utcOffset('+05:30');
    this.filterForm.patchValue({
      fromDate: today.clone().subtract(30, 'days').toDate(),
      toDate: today.toDate(),
    });
    this.search();
  }

  search(): void {
    const raw = this.filterForm.getRawValue();
    const reservationRaw = raw.reservationID;
    const reservationID =
      reservationRaw === null || reservationRaw === undefined || reservationRaw === ''
        ? null
        : Number(reservationRaw);

    this.loading = true;
    this.appBillingReceiptService
      .search({
        reservationID: Number.isFinite(reservationID) && reservationID > 0 ? reservationID : null,
        fromDate: raw.fromDate ? moment(raw.fromDate).format('YYYY-MM-DD') : null,
        toDate: raw.toDate ? moment(raw.toDate).format('YYYY-MM-DD') : null,
        customerName: (raw.customerName || '').trim() || null,
        customerCode: (raw.customerCode || '').trim() || null,
        currentPage: 1,
        pageSize: 100,
      })
      .subscribe({
        next: (rows) => {
          this.loading = false;
          this.rows = (rows || []).map((r) => ({
            appBillingReceiptID: r.appBillingReceiptID ?? r.AppBillingReceiptID,
            dutySlipID: r.dutySlipID ?? r.DutySlipID,
            reservationID: r.reservationID ?? r.ReservationID,
            customerID: r.customerID ?? r.CustomerID,
            customerName: r.customerName ?? r.CustomerName,
            customerCode: r.customerCode ?? r.CustomerCode,
            totalAmount: r.totalAmount ?? r.TotalAmount,
            advance: r.advance ?? r.Advance,
            totalPayableAfterAdvance: r.totalPayableAfterAdvance ?? r.TotalPayableAfterAdvance,
            tollParkingAmount: r.tollParkingAmount ?? r.TollParkingAmount,
            interstateTax: r.interstateTax ?? r.InterstateTax,
            tripDate: r.tripDate ?? r.TripDate,
            createdOn: r.createdOn ?? r.CreatedOn,
            invoiceCalculationID: r.invoiceCalculationID ?? r.InvoiceCalculationID,
          }));
        },
        error: (err) => {
          this.loading = false;
          this.rows = [];
          this.showNotification(
            'snackbar-danger',
            err?.error?.message || 'Failed to search app billing receipts.'
          );
        },
      });
  }

  clearFilters(): void {
    const today = moment().utcOffset('+05:30');
    this.filterForm.reset({
      reservationID: null,
      fromDate: today.clone().subtract(30, 'days').toDate(),
      toDate: today.toDate(),
      customerName: '',
      customerCode: '',
    });
    this.search();
  }

  downloadPdf(row: AppBillingReceiptRow): void {
    const id = row.appBillingReceiptID;
    if (!id) {
      return;
    }
    this.downloadingId = id;
    this.appBillingReceiptService.downloadPdf(id).subscribe({
      next: (blob) => {
        this.downloadingId = null;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AppBillingReceipt_${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.downloadingId = null;
        this.showNotification('snackbar-danger', 'Failed to download receipt PDF.');
      },
    });
  }

  formatDate(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }
    const parsed = moment(value);
    return parsed.isValid() ? parsed.format('DD-MM-YYYY') : String(value);
  }

  formatDateTime(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }
    const parsed = moment(value);
    return parsed.isValid() ? parsed.format('DD-MM-YYYY HH:mm') : String(value);
  }

  private showNotification(colorName: string, text: string): void {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: colorName,
    });
  }
}
