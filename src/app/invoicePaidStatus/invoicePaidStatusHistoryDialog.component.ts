// @ts-nocheck
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import { InvoicePaidStatusHistoryRow } from './invoicePaidStatus.model';

@Component({
  standalone: false,
  selector: 'app-invoice-paid-status-history-dialog',
  templateUrl: './invoicePaidStatusHistoryDialog.component.html',
  styleUrls: ['./invoicePaidStatusHistoryDialog.component.sass'],
})
export class InvoicePaidStatusHistoryDialogComponent implements OnInit {
  dialogTitle = 'Invoice History';
  invoiceID: number;
  invoiceNumber: string;
  historyRows: InvoicePaidStatusHistoryRow[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<InvoicePaidStatusHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private generalService: GeneralService,
    private cdr: ChangeDetectorRef
  ) {
    this.invoiceID = Number(data?.invoiceID || data?.InvoiceID || 0);
    this.invoiceNumber =
      data?.invoiceNumber || data?.invoiceNumberWithPrefix || data?.InvoiceNumber || '';
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    if (!this.invoiceID) {
      this.loading = false;
      this.errorMessage = 'Invalid Invoice ID.';
      this.historyRows = [];
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.historyRows = [];
    this.cdr.detectChanges();

    // Use the existing InvoiceBillingHistory API (same table: InvoiceHistory).
    const url = `${this.generalService.BaseURL}invoiceBillingHistory/${this.invoiceID}`;

    this.http
      .get<InvoicePaidStatusHistoryRow[]>(url)
      .pipe(
        timeout(30000),
        catchError((err) => {
          const message =
            typeof err === 'string'
              ? err
              : err?.name === 'TimeoutError'
                ? 'Timed out while loading invoice history.'
                : err?.error?.message || err?.message || 'Failed to load invoice history.';
          this.errorMessage = message;
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((rows) => {
        this.historyRows = Array.isArray(rows) ? rows : [];
        // Normalize PascalCase payloads if API returns them.
        this.historyRows = this.historyRows.map((row: any) => ({
          invoiceHistoryID: row.invoiceHistoryID ?? row.InvoiceHistoryID ?? 0,
          invoiceID: row.invoiceID ?? row.InvoiceID ?? this.invoiceID,
          invoiceNumberWithPrefix:
            row.invoiceNumberWithPrefix ?? row.InvoiceNumberWithPrefix ?? this.invoiceNumber,
          action: row.action ?? row.Action ?? null,
          listOfDuties: row.listOfDuties ?? row.ListOfDuties ?? null,
          actionByID: row.actionByID ?? row.ActionByID ?? 0,
          actionBy: row.actionBy ?? row.ActionBy ?? null,
          actionDate: row.actionDate ?? row.ActionDate ?? null,
          actionTime: row.actionTime ?? row.ActionTime ?? null,
        }));
        this.cdr.detectChanges();
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
