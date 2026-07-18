// @ts-nocheck
import { ChangeDetectorRef, Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FinanceDashboardService } from './financeDashboard.service';

@Component({
  standalone: false,
  selector: 'app-finance-dashboard-drilldown-dialog',
  templateUrl: './financeDashboard-drilldown-dialog.component.html',
  styleUrls: ['./financeDashboard-drilldown-dialog.component.scss'],
})
export class FinanceDashboardDrilldownDialogComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  totalRecords = 0;
  loading = false;
  pageIndex = 0;
  pageSize = 25;

  constructor(
    public dialogRef: MatDialogRef<FinanceDashboardDrilldownDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: FinanceDashboardService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.isInvoiceDrillDown()
      ? ['invoiceID', 'customerID', 'invoiceCalculationID', 'irnStatus', 'documentNumber', 'invoiceType', 'date', 'customer', 'branch', 'amount', 'user', 'errorDescription']
      : ['documentNumber', 'invoiceType', 'irnStatus', 'date', 'customer', 'branch', 'amount', 'user', 'errorDescription'];
    this.load();
  }

  private isInvoiceDrillDown(): boolean {
    return String(this.data?.documentType || '').toLowerCase() === 'invoice';
  }

  load(): void {
    this.loading = true;
    this.service
      .getDrillDown(
        this.data.filters,
        this.data.documentType,
        this.data.validationCode,
        this.data.seriesName,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe({
        next: (res) => {
          const rows = res?.rows ?? res?.Rows ?? [];
          this.dataSource.data = rows.map((r) => this.normalizeRow(r));
          this.totalRecords = res?.totalRecords ?? res?.TotalRecords ?? 0;
          this.loading = false;
          this.ngZone.run(() => this.cdr.detectChanges());
        },
        error: () => {
          this.dataSource.data = [];
          this.totalRecords = 0;
          this.loading = false;
          this.ngZone.run(() => this.cdr.detectChanges());
        },
      });
  }

  private normalizeRow(row: any): any {
    return {
      invoiceID: row?.invoiceID ?? row?.InvoiceID ?? row?.documentID ?? row?.DocumentID,
      customerID: row?.customerID ?? row?.CustomerID,
      invoiceCalculationID: row?.invoiceCalculationID ?? row?.InvoiceCalculationID,
      irnStatus: row?.irnStatus ?? row?.IrnStatus,
      documentNumber: row?.documentNumber ?? row?.DocumentNumber,
      invoiceType: row?.invoiceType ?? row?.InvoiceType,
      date: row?.date ?? row?.Date,
      customer: row?.customer ?? row?.Customer,
      branch: row?.branch ?? row?.Branch,
      amount: row?.amount ?? row?.Amount,
      user: row?.user ?? row?.User,
      errorDescription: row?.errorDescription ?? row?.ErrorDescription,
    };
  }

  formatInvoiceType(value: string | null | undefined): string {
    if (!value) return '—';
    switch (value) {
      case 'InvoiceGeneral':
        return 'General';
      case 'InvoiceSingleDuty':
        return 'Single Duty';
      case 'InvoiceMultyDuty':
      case 'InvoiceMultiDuty':
        return 'Multiple Duty';
      case 'Credit Note':
        return 'Credit Note';
      default:
        return value;
    }
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  close(): void {
    this.dialogRef.close();
  }
}
