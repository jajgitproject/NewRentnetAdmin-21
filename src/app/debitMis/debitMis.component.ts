// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DebitMisService } from './debitMis.service';
import { DebitMisRow } from './debitMis.model';
import { DebitService } from '../debit/debit.service';
import { formatDate } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-debit-mis',
  templateUrl: './debitMis.component.html',
  styleUrls: ['./debitMis.component.sass'],
})
export class DebitMisComponent implements OnInit {
  displayedColumns = [
    'debitDate',
    'debitID',
    'source',
    'incidenceID',
    'location',
    'supplierName',
    'supplierType',
    'driverName',
    'driverMobileNo',
    'carRegistrationNo',
    'debitType',
    'amount',
    'narration',
    'createdBy',
    'createdOn',
    'debitStatus',
  ];

  columnTitles: Record<string, string> = {
    debitDate: 'Date',
    debitID: 'Debit Ref. No.',
    source: 'Source',
    incidenceID: 'Incident ID',
    location: 'Location',
    supplierName: 'Supplier Name',
    supplierType: 'Supplier Type',
    driverName: 'Driver Name',
    driverMobileNo: 'Driver Mobile No.',
    carRegistrationNo: 'Car Reg. No.',
    debitType: 'Debit Type',
    amount: 'Debit Amount',
    narration: 'Narration',
    createdBy: 'Created By',
    createdOn: 'Created On',
    debitStatus: 'Debit Status',
  };

  /** Columns rendered via *ngFor (excludes static debitDate column). */
  get tableColumns(): string[] {
    return this.displayedColumns.filter((c) => c !== 'debitDate');
  }

  rows: DebitMisRow[] = [];
  totalAmount = 0;
  totalCount = 0;
  pageNumber = 0;
  readonly pageSize = 50;
  sortColumn = 'DebitID';
  sortDirection = 'Descending';
  loading = false;
  exporting = false;
  hasSearched = false;

  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  filterLocationName = '';
  filterSupplierName = '';
  filterDriverName = '';
  filterDebitTypeID = 0;
  filterSource = 'All';
  filterStatus = 'Active';
  filterRegistrationNumber = '';
  filterDriverMobile = '';
  filterIncidenceID: number | null = null;

  debitTypeOptions: any[] = [];
  supplierOptions: any[] = [];
  driverOptions: any[] = [];

  constructor(
    private debitMisService: DebitMisService,
    private debitService: DebitService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDebitTypes();
  }

  loadDebitTypes(): void {
    this.debitService.getAllDebitTypesForMIS().subscribe((list) => {
      this.debitTypeOptions = Array.isArray(list) ? list : [];
    });
  }

  debitTypeLabel(dt: any): string {
    const name = dt?.debitType || dt?.DebitType || '';
    const scope = dt?.debitTypeFor || dt?.DebitTypeFor || '';
    return scope ? `${name} (${scope})` : name;
  }

  onSupplierPrefix(prefix: string): void {
    const p = (prefix || '').trim();
    if (p.length < 2) {
      this.supplierOptions = [];
      return;
    }
    this.debitService.searchSuppliers(p).subscribe((data) => {
      this.supplierOptions = Array.isArray(data) ? data : [];
    });
  }

  onDriverPrefix(prefix: string): void {
    const p = (prefix || '').trim();
    if (p.length < 2) {
      this.driverOptions = [];
      return;
    }
    this.debitService.searchDrivers(p).subscribe((data) => {
      this.driverOptions = Array.isArray(data) ? data : [];
    });
  }

  buildCriteria() {
    return {
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      locationName: (this.filterLocationName || '').trim() || null,
      supplierName: (this.filterSupplierName || '').trim() || null,
      driverName: (this.filterDriverName || '').trim() || null,
      debitTypeID: this.filterDebitTypeID > 0 ? this.filterDebitTypeID : 0,
      source: this.filterSource === 'All' ? null : this.filterSource,
      status: this.filterStatus === 'All' ? null : this.filterStatus,
      registrationNumber: (this.filterRegistrationNumber || '').trim() || null,
      driverMobileNo: (this.filterDriverMobile || '').trim() || null,
      incidenceID: this.filterIncidenceID > 0 ? this.filterIncidenceID : 0,
      pageNumber: this.pageNumber,
      orderByColumn: this.sortColumn,
      order: this.sortDirection,
    };
  }

  search(): void {
    this.hasSearched = true;
    this.loading = true;
    this.debitMisService.search(this.buildCriteria()).subscribe(
      (res) => {
        const list = res?.rows || res?.Rows || [];
        this.rows = list.map((r) => new DebitMisRow(r));
        this.totalAmount = Number(res?.totalAmount ?? res?.TotalAmount ?? 0);
        this.totalCount = Number(res?.totalCount ?? res?.TotalCount ?? 0);
        this.loading = false;
      },
      () => {
        this.rows = [];
        this.totalAmount = 0;
        this.totalCount = 0;
        this.loading = false;
        this.showSnack('Debit MIS search failed.', 'snackbar-danger');
      }
    );
  }

  resetFilters(): void {
    this.dateFrom = null;
    this.dateTo = null;
    this.filterLocationName = '';
    this.filterSupplierName = '';
    this.filterDriverName = '';
    this.filterDebitTypeID = 0;
    this.filterSource = 'All';
    this.filterStatus = 'Active';
    this.filterRegistrationNumber = '';
    this.filterDriverMobile = '';
    this.filterIncidenceID = null;
    this.pageNumber = 0;
    this.hasSearched = false;
    this.rows = [];
    this.totalAmount = 0;
    this.totalCount = 0;
  }

  exportExcel(): void {
    this.exporting = true;
    const criteria = { ...this.buildCriteria(), pageNumber: 0 };
    this.debitMisService.exportExcel(criteria).subscribe(
      (response) => {
        const blob = response.body;
        const disposition = response.headers.get('content-disposition') || '';
        const match = disposition.match(/filename=\"?([^\";]+)/i);
        const fileName = match?.[1] || `DebitMIS_${formatDate(new Date(), 'yyyyMMdd_HHmmss', 'en-GB')}.csv`;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
        this.exporting = false;
        this.showSnack('Export downloaded (Excel-compatible CSV).', 'snackbar-success');
      },
      () => {
        this.exporting = false;
        this.showSnack('Export failed.', 'snackbar-danger');
      }
    );
  }

  previousPage(): void {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.search();
    }
  }

  nextPage(): void {
    if (this.rows.length >= this.pageSize) {
      this.pageNumber++;
      this.search();
    }
  }

  onSort(event: any): void {
    if (!event?.active) {
      return;
    }
    const map: Record<string, string> = {
      debitDate: 'Date',
      debitID: 'DebitID',
      amount: 'Amount',
      location: 'Location',
      supplierName: 'SupplierName',
      driverName: 'DriverName',
      debitType: 'DebitType',
    };
    this.sortColumn = map[event.active] || 'DebitID';
    this.sortDirection = event.direction === 'asc' ? 'Ascending' : 'Descending';
    this.search();
  }

  formatDateCell(value: any): string {
    if (value == null || value === '') {
      return '';
    }
    const text = String(value).trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
      return text;
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
      const parts = text.substring(0, 10).split('-');
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) {
      return text;
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  cellText(row: DebitMisRow, col: string): string {
    if (col === 'debitDate') {
      const v = row?.debitDate ?? row?.dateString ?? this.formatDateCell(row?.date);
      return (v && String(v).trim()) || '—';
    }
    if (col === 'amount') {
      return row?.amount != null ? Number(row.amount).toFixed(2) : '—';
    }
    if (col === 'debitStatus') {
      return row?.debitStatus || '—';
    }
    if (col === 'narration') {
      return this.truncateText(row?.narration, 35);
    }
    if (col === 'createdOn') {
      return row?.createdOn || '—';
    }
    const val = row?.[col];
    return val != null && val !== '' ? String(val) : '—';
  }

  truncateText(value: string, maxLen = 35): string {
    const text = (value || '').trim();
    if (!text) {
      return '—';
    }
    if (text.length <= maxLen) {
      return text;
    }
    return text.substring(0, maxLen) + '…';
  }

  showSnack(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass,
    });
  }
}