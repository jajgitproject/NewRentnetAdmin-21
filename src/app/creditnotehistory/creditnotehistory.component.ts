// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CreditNoteHistory } from './creditnotehistory.model';
import { CreditNoteHistoryService } from './creditnotehistory.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  standalone: false,
  selector: 'app-creditnotehistory',
  templateUrl: './creditnotehistory.component.html',
  styleUrls: ['./creditnotehistory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CreditNoteHistoryComponent implements OnInit {
  dialogTitle: string;
  dataSource: MatTableDataSource<CreditNoteHistory>;
  creditNoteID: number;
  creditNoteHistoryDataSource: any[] = [];
  noDataFound: boolean = false;
  loading = false;
  selectedLifeCycleStatus: string = 'all';
  lifeCycleStatuses: string[] = [];
  PageNumber: number = 0;
  @Input() invoiceID: number;
  invoiceNumberWithPrefix: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  InvoiceCreditNoteHistoryID: string;
  
  constructor(
    public dialogRef: MatDialogRef<CreditNoteHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public creditNoteHistoryService: CreditNoteHistoryService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.dialogTitle = 'Credit Note History';
    this.creditNoteID = Number(
      data?.creditNoteID
      ?? data?.invoiceCreditNoteID
      ?? data?.InvoiceCreditNoteID
      ?? 0
    );
    this.invoiceID = Number(data?.invoiceID ?? data?.InvoiceID ?? 0);
    this.invoiceNumberWithPrefix =
      data?.invoiceNumberWithPrefix
      || data?.creditNoteNumberWithPrefix
      || data?.CreditNoteNumberWithPrefix
      || '';
    this.selectedLifeCycleStatus = data?.preSelectedStatus || 'all';
    this.dataSource = new MatTableDataSource<CreditNoteHistory>([]);
  }

  ngOnInit() {
    this.getCreditNoteHistoryData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public getCreditNoteHistoryData() {
    // Credit Note Home: require InvoiceCreditNoteID.
    // Invoice Home: fall back to InvoiceID (all CNs under that invoice).
    if (this.creditNoteID > 0) {
      this.loadByCreditNoteId();
      return;
    }

    if (this.invoiceID > 0) {
      this.loadByInvoiceId();
      return;
    }

    this.creditNoteHistoryDataSource = [];
    this.dataSource.data = [];
    this.noDataFound = true;
    this.cdr.detectChanges();
  }

  private loadByCreditNoteId() {
    this.loading = true;
    this.noDataFound = false;
    this.creditNoteHistoryService.getCreditNoteHistoryByCreditNoteId(this.creditNoteID).subscribe(
      (data: CreditNoteHistory[]) => {
        this.applyRows(data);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching credit note history by InvoiceCreditNoteID:', error);
        this.applyRows([]);
      }
    );
  }

  private loadByInvoiceId() {
    this.loading = true;
    this.noDataFound = false;
    this.creditNoteHistoryService.getCreditNoteHistory(this.invoiceID).subscribe(
      (data: CreditNoteHistory[]) => {
        this.applyRows(data);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching credit note history by InvoiceID:', error);
        this.applyRows([]);
      }
    );
  }

  private applyRows(data: CreditNoteHistory[]) {
    const rows = Array.isArray(data) ? data : [];
    this.creditNoteHistoryDataSource = rows.map((row: any) => ({
      invoiceCreditNoteHistoryID: row.invoiceCreditNoteHistoryID ?? row.InvoiceCreditNoteHistoryID ?? 0,
      invoiceCreditNoteID: row.invoiceCreditNoteID ?? row.InvoiceCreditNoteID ?? 0,
      invoiceID: row.invoiceID ?? row.InvoiceID ?? 0,
      amount: row.amount ?? row.Amount ?? 0,
      action: row.action ?? row.Action ?? null,
      actionValue: row.actionValue ?? row.ActionValue ?? null,
      actionByID: row.actionByID ?? row.ActionByID ?? 0,
      actionByName: row.actionByName ?? row.ActionByName ?? null,
      actionDate: row.actionDate ?? row.ActionDate ?? null,
      actionTime: row.actionTime ?? row.ActionTime ?? null,
    }));
    this.dataSource.data = this.creditNoteHistoryDataSource;
    this.noDataFound = this.creditNoteHistoryDataSource.length === 0;
    this.loading = false;
    this.cdr.detectChanges();
  }

  onLifeCycleStatusChange(): void {
    this.getCreditNoteHistoryData();
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'badge-success';
      case 'REJECTED':
        return 'badge-danger';
      case 'PENDING_APPROVAL':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }
}
