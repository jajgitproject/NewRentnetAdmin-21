import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { KamAddressCorrectionDialogComponent } from './dialogs/kam-address-correction-dialog/kam-address-correction-dialog.component';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { KamAddressCorrectionService } from './kamAddressCorrection.service';
import { KamAddressCorrection } from './kamAddressCorrection.model';

@Component({
  standalone: false,
  selector: 'app-kam-address-correction',
  templateUrl: './kamAddressCorrection.component.html',
  styleUrls: ['./kamAddressCorrection.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class KamAddressCorrectionComponent implements OnInit {
  readonly pageSize = 20;

  columnDefinitions = [
    { key: 'bookingNo', label: 'Booking No.', visible: true },
    { key: 'customerGroup', label: 'Customer Group', visible: true },
    { key: 'customerName', label: 'Customer Name', visible: true },
    { key: 'pickupDateTime', label: 'Pickup Date Time', visible: true },
    { key: 'pickupAddress', label: 'Pickup Geo Location', visible: true },
    { key: 'pickupAddressDetails', label: 'Pickup Address Details', visible: true },
    { key: 'reservationStatus', label: 'Status', visible: true }
  ];

  dataSource: KamAddressCorrection[] = [];
  totalCount = 0;
  filtersCollapsed = false;
  isLoading = false;
  hasSearched = false;

  searchPickupFromDate: Date | null = null;
  searchPickupToDate: Date | null = null;
  searchBookingNo = '';
  searchCustomerGroup = '';
  searchCustomerName = '';

  pageNumber = 0;
  sortColumn = 'PickupDate';
  sortDirection: 'Ascending' | 'Descending' = 'Ascending';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private kamAddressCorrectionService: KamAddressCorrectionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.searchData();
  }

  get visibleColumns(): string[] {
    return [...this.columnDefinitions.filter((col) => col.visible).map((col) => col.key), 'actions'];
  }

  toggleFilters(): void {
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  toggleColumn(columnKey: string): void {
    const column = this.columnDefinitions.find((col) => col.key === columnKey);
    if (column) {
      column.visible = !column.visible;
    }
  }

  setColumnVisible(columnKey: string, visible: boolean): void {
    const column = this.columnDefinitions.find((col) => col.key === columnKey);
    if (column) {
      column.visible = visible;
    }
  }

  searchData(): void {
    this.hasSearched = true;
    this.pageNumber = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadData();
  }

  refresh(): void {
    this.searchPickupFromDate = null;
    this.searchPickupToDate = null;
    this.searchBookingNo = '';
    this.searchCustomerGroup = '';
    this.searchCustomerName = '';
    this.pageNumber = 0;
    this.searchData();
  }

  reloadSearchedData(): void {
    if (!this.hasSearched) {
      return;
    }
    this.loadData();
  }

  onPageChange(event: PageEvent): void {
    if (!this.hasSearched) {
      return;
    }
    this.pageNumber = event.pageIndex;
    this.loadData();
  }

  onSortChange(sort: Sort): void {
    if (!this.hasSearched) {
      return;
    }
    this.sortColumn = sort.active || 'PickupDate';
    this.sortDirection = sort.direction === 'asc' ? 'Ascending' : 'Descending';
    this.loadData();
  }

  loadData(): void {
    const { fromDate, toDate } = this.getFormattedSearchDates();
    const bookingNo = this.searchBookingNo?.trim() || null;
    const customerGroup = this.searchCustomerGroup?.trim() || null;
    const customerName = this.searchCustomerName?.trim() || null;

    this.isLoading = true;
    this.kamAddressCorrectionService.getTableData(
      fromDate,
      toDate,
      bookingNo,
      customerGroup,
      customerName,
      this.pageNumber,
      this.mapSortColumn(this.sortColumn),
      this.sortDirection
    ).subscribe({
      next: (response) => {
        this.dataSource = response.items ?? [];
        this.totalCount = response.totalCount ?? 0;
        this.isLoading = false;
      },
      error: () => {
        this.dataSource = [];
        this.totalCount = 0;
        this.isLoading = false;
        this.showNotification('Failed to load reservations pending address correction.', 'snackbar-danger');
      }
    });
  }

  openCorrect(row: KamAddressCorrection): void {
    if (!row?.reservationID) {
      return;
    }

    const dialogRef = this.dialog.open(KamAddressCorrectionDialogComponent, {
      panelClass: 'kam-address-correction-dialog-panel',
      width: '1200px',
      maxWidth: '96vw',
      autoFocus: false,
      disableClose: false,
      data: { row }
    });

    dialogRef.afterClosed().subscribe((saved) => {
      if (saved && this.hasSearched) {
        this.loadData();
      }
    });
  }

  formatBookingNo(row: KamAddressCorrection): string {
    if (!row?.reservationID) {
      return 'N/A';
    }
    const groupPrefix = row.reservationGroupID ? `${row.reservationGroupID}.` : '';
    return `${groupPrefix}${row.reservationID}`;
  }

  formatDateTime(dateValue: any, timeValue?: any): string {
    if (!dateValue && !timeValue) {
      return 'N/A';
    }

    const parts: string[] = [];
    const datePart = moment(dateValue);
    if (dateValue && datePart.isValid()) {
      parts.push(datePart.format('DD/MM/YYYY'));
    }

    const timePart = moment(timeValue, [moment.ISO_8601, 'HH:mm:ss', 'HH:mm:ss.SSS', 'HH:mm'], true);
    const fallbackTime = moment(timeValue);
    const resolvedTime = timePart.isValid() ? timePart : fallbackTime;
    if (timeValue && resolvedTime.isValid()) {
      parts.push(resolvedTime.format('h:mm A'));
    }
    return parts.join(' ').trim() || 'N/A';
  }

  getStatusClass(status: string): string {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'requested' || normalized === 'pending') {
      return 'br-status-requested';
    }
    if (normalized === 'approved' || normalized === 'confirmed' || normalized === 'accepted') {
      return 'br-status-confirmed';
    }
    if (normalized === 'rejected' || normalized === 'cancelled' || normalized === 'cancel') {
      return 'br-status-rejected';
    }
    return 'br-status-neutral';
  }

  private getFormattedSearchDates(): { fromDate: string; toDate: string } {
    return {
      fromDate: this.formatSearchDate(this.searchPickupFromDate),
      toDate: this.formatSearchDate(this.searchPickupToDate)
    };
  }

  private formatSearchDate(value: Date | null): string {
    if (!value) {
      return '';
    }
    const m = moment(value);
    return m.isValid() ? m.format('YYYY-MM-DD') : '';
  }

  private mapSortColumn(column: string): string {
    const map: Record<string, string> = {
      bookingNo: 'ReservationID',
      pickupDateTime: 'PickupDate',
      customerName: 'CustomerName',
      customerGroup: 'CustomerGroup',
      reservationStatus: 'ReservationStatus'
    };
    return map[column] || column || 'PickupDate';
  }

  private showNotification(message: string, panelClass: string): void {
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [panelClass]
    });
  }
}
