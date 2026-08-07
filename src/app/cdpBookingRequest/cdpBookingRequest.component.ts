import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { ClossingOneService } from '../clossingOne/clossingOne.service';
import { CdpBookingRequestService } from './cdpBookingRequest.service';
import { CdpBookingRequest } from './cdpBookingRequest.model';

@Component({
  standalone: false,
  selector: 'app-cdpBookingRequest',
  templateUrl: './cdpBookingRequest.component.html',
  styleUrls: ['./cdpBookingRequest.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CdpBookingRequestComponent implements OnInit {
  readonly pageSize = 20;
  readonly statusOptions = ['Requested', 'Pending', 'Confirmed', 'Approved', 'Accepted', 'Cancelled', 'Rejected'];
  readonly bookingTypeOptions = [
    { value: '', label: 'All' },
    { value: 'CDP Booking', label: 'CDP Booking' },
    { value: 'B2B App Booking', label: 'B2B App Booking' }
  ];

  columnDefinitions = [
    { key: 'bookingNo', label: 'Booking No.', visible: true },
    { key: 'customerName', label: 'Customer Name', visible: true },
    { key: 'pickupDateTime', label: 'Pickup Date Time', visible: true },
    { key: 'reservationCreatedOn', label: 'Booking Date Time', visible: true },
    { key: 'bookingTypeLabel', label: 'Booking Type', visible: true },
    { key: 'reservationStatus', label: 'Status', visible: true }
  ];

  dataSource: CdpBookingRequest[] = [];
  totalCount = 0;
  filtersCollapsed = false;
  isLoading = false;

  searchPickupFromDate: Date | null = new Date();
  searchPickupToDate: Date | null = new Date();
  searchStatus = '';
  searchBookingType = '';
  pageNumber = 0;
  sortColumn = 'PickupDate';
  sortDirection: 'Ascending' | 'Descending' = 'Descending';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private cdpBookingRequestService: CdpBookingRequestService,
    private clossingOneService: ClossingOneService,
    private snackBar: MatSnackBar,
    private router: Router,
    public generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.setDefaultPickupDates();
    this.loadData();
  }

  get visibleColumns(): string[] {
    return [...this.columnDefinitions.filter(col => col.visible).map(col => col.key), 'actions'];
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchPickupFromDate) count++;
    if (this.searchPickupToDate) count++;
    if (this.searchStatus?.trim()) count++;
    if (this.searchBookingType?.trim()) count++;
    return count;
  }

  toggleFilters(): void {
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  toggleColumn(columnKey: string): void {
    const column = this.columnDefinitions.find(col => col.key === columnKey);
    if (column) {
      column.visible = !column.visible;
    }
  }

  setColumnVisible(columnKey: string, visible: boolean): void {
    const column = this.columnDefinitions.find(col => col.key === columnKey);
    if (column) {
      column.visible = visible;
    }
  }

  searchData(): void {
    this.pageNumber = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadData();
  }

  refresh(): void {
    this.setDefaultPickupDates();
    this.searchStatus = '';
    this.searchBookingType = '';
    this.pageNumber = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadData();
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.loadData();
  }

  onSortChange(sort: Sort): void {
    this.sortColumn = sort.active || 'PickupDate';
    this.sortDirection = sort.direction === 'asc' ? 'Ascending' : 'Descending';
    this.loadData();
  }

  loadData(): void {
    const { fromDate, toDate } = this.getFormattedSearchDates();
    const status = this.searchStatus?.trim() ? this.searchStatus.trim() : null;
    const bookingType = this.searchBookingType?.trim() ? this.searchBookingType.trim() : null;

    this.isLoading = true;
    this.cdpBookingRequestService.getTableData(
      fromDate,
      toDate,
      status,
      bookingType,
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
        this.showNotification('snackbar-danger', 'Failed to load CDP booking requests.', 'top', 'center');
      }
    });
  }

  openConfigure(row: CdpBookingRequest): void {
    if (!row?.reservationID) {
      return;
    }

    this.clossingOneService.getVerifyDutydata(row.reservationID).subscribe({
      next: (statusData) => {
        const status = this.parseVerifyDutyStatus(statusData);
        this.openBookingScreenWithStatus(row, status);
      },
      error: () => {
        this.openBookingScreenWithStatus(row, '');
      }
    });
  }

  private parseVerifyDutyStatus(statusData: unknown): string {
    if (typeof statusData === 'string') {
      return statusData;
    }
    if (statusData && typeof statusData === 'object') {
      const data = statusData as { status?: unknown };
      if (typeof data.status === 'string') {
        return data.status;
      }
      if (data.status && typeof data.status === 'object') {
        const nested = data.status as { status?: unknown };
        if (typeof nested.status === 'string') {
          return nested.status;
        }
      }
    }
    return '';
  }

  private openBookingScreenWithStatus(row: CdpBookingRequest, status: string): void {
    const encryptedCustomerID = encodeURIComponent(this.generalService.encrypt(String(row.customerID ?? 0)));
    const encryptedCustomerName = encodeURIComponent(this.generalService.encrypt(row.customerName ?? ''));
    const encryptedReservationGroupID = encodeURIComponent(this.generalService.encrypt(String(row.reservationGroupID ?? 0)));
    const encryptedReservationID = encodeURIComponent(this.generalService.encrypt(String(row.reservationID)));
    const encryptedCustomerGroupID = encodeURIComponent(this.generalService.encrypt(String(row.customerGroupID ?? 0)));
    const encryptedAllotmentStatus = encodeURIComponent(this.generalService.encrypt(row.allotmentStatus ?? ''));
    const encryptedAction = encodeURIComponent(this.generalService.encrypt('edit'));
    const encryptedLocationOutDate = encodeURIComponent(
      this.generalService.encrypt(row.locationOutDate != null ? String(row.locationOutDate) : '')
    );

    const queryParams: Record<string, string> = {
      reservationID: encryptedReservationID,
      reservationGroupID: encryptedReservationGroupID,
      customerGroupID: encryptedCustomerGroupID,
      customerID: encryptedCustomerID,
      customerName: encryptedCustomerName,
      allotmentStatus: encryptedAllotmentStatus,
      action: encryptedAction,
      locationOutDate: encryptedLocationOutDate
    };

    if (status) {
      queryParams.status = encodeURIComponent(this.generalService.encrypt(status));
    }

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/bookingScreen'], { queryParams })
    );
    window.open(this.generalService.buildAppWindowUrl(url), '_blank');
  }

  formatBookingNo(row: CdpBookingRequest): string {
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
    if (dateValue) {
      parts.push(moment(dateValue).format('DD/MM/YYYY'));
    }
    if (timeValue) {
      parts.push(moment(timeValue).format('h:mm A'));
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

  private setDefaultPickupDates(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.searchPickupFromDate = new Date(today);
    this.searchPickupToDate = new Date(today);
  }

  private getFormattedSearchDates(): { fromDate: string; toDate: string } {
    if (!this.searchPickupFromDate || !this.searchPickupToDate) {
      this.setDefaultPickupDates();
    }

    const fromDate = moment(this.searchPickupFromDate).format('YYYY-MM-DD');
    const toDate = moment(this.searchPickupToDate).format('YYYY-MM-DD');
    return { fromDate, toDate };
  }

  private mapSortColumn(column: string): string {
    switch (column) {
      case 'bookingNo':
        return 'ReservationID';
      case 'pickupDateTime':
        return 'PickupDate';
      case 'bookingTypeLabel':
        return 'ReservationSource';
      default:
        return column || 'PickupDate';
    }
  }

  private showNotification(colorName: string, text: string, placementFrom: string, placementAlign: string): void {
    this.snackBar.open(text, '', {
      duration: 2500,
      verticalPosition: placementFrom as any,
      horizontalPosition: placementAlign as any,
      panelClass: colorName
    });
  }
}
