// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { InvoiceBillingHistory } from './invoiceBillingHistory.model';
import { InvoiceBillingHistoryService } from './invoiceBillingHistory.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-invoiceBillingHistory',
  templateUrl: './invoiceBillingHistory.component.html',
  styleUrls: ['./invoiceBillingHistory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InvoiceBillingHistoryComponent implements OnInit {
  invoiceBillingHistory: InvoiceBillingHistory[] = [];
  dialogTitle: string;
  invoiceID: any;
  invoiceNumberWithPrefix: any;
  loading = false;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<InvoiceBillingHistoryComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public _generalService: GeneralService,
    public invoiceBillingHistoryService: InvoiceBillingHistoryService,
    private cdr: ChangeDetectorRef
  ) {
    this.dialogTitle = 'Invoice History';
    this.invoiceID = Number(this.data?.invoiceID ?? this.data?.InvoiceID ?? 0);
    this.invoiceNumberWithPrefix =
      this.data?.invoiceNumberWithPrefix ?? this.data?.InvoiceNumberWithPrefix ?? '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.loadData();
  }

  public loadData() {
    if (!this.invoiceID) {
      this.loading = false;
      this.errorMessage = 'Invalid Invoice ID.';
      this.invoiceBillingHistory = [];
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.invoiceBillingHistory = [];
    this.cdr.detectChanges();

    this.invoiceBillingHistoryService.getInvoiceBilling(this.invoiceID).subscribe(
      (data: InvoiceBillingHistory[]) => {
        const rows = Array.isArray(data) ? data : [];
        this.invoiceBillingHistory = rows.map((row: any) => ({
          invoiceHistoryID: row.invoiceHistoryID ?? row.InvoiceHistoryID ?? 0,
          invoiceID: row.invoiceID ?? row.InvoiceID ?? this.invoiceID,
          invoiceNumberWithPrefix:
            row.invoiceNumberWithPrefix ??
            row.InvoiceNumberWithPrefix ??
            this.invoiceNumberWithPrefix,
          action: row.action ?? row.Action ?? null,
          listOfDuties: row.listOfDuties ?? row.ListOfDuties ?? null,
          actionByID: row.actionByID ?? row.ActionByID ?? 0,
          actionBy: row.actionBy ?? row.ActionBy ?? null,
          actionDate: row.actionDate ?? row.ActionDate ?? null,
          actionTime: row.actionTime ?? row.ActionTime ?? null,
          totalCreditNoteAmount:
            row.totalCreditNoteAmount ?? row.TotalCreditNoteAmount ?? null,
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      (error: HttpErrorResponse) => {
        this.invoiceBillingHistory = [];
        this.errorMessage =
          error?.error?.message || error?.message || 'Failed to load invoice history.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  }
}
