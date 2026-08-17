import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
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
export class CdpBookingRequestComponent implements OnInit, OnDestroy {
  readonly pageSize = 20;
  readonly statusOptions = ['Requested', 'Pending', 'Confirmed', 'Approved', 'Accepted', 'Cancelled', 'Rejected'];
  readonly reservationSourceOptions = ['CDP', 'B2B Customer App'];
  readonly confirmationOptions = [
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'NotConfirmed', label: 'Not Confirmed' }
  ];

  columnDefinitions = [
    { key: 'bookingNo', label: 'Booking No.', visible: true },
    { key: 'customerGroup', label: 'Customer Group', visible: true },
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
  hasSearched = false;

  searchPickupFromDate: Date | null = null;
  searchPickupToDate: Date | null = null;
  searchBookingFromDate: Date | null = null;
  searchBookingToDate: Date | null = null;
  searchStatus = '';
  searchReservationSource = '';
  searchBookingNo = '';
  searchConfirmation = '';
  customerGroupCtrl = new FormControl('');
  customerNameCtrl = new FormControl('');
  customerGroupOptions: any[] = [];
  customerNameOptions: any[] = [];
  readonly displayCustomerNameFn = (value: string) => this.displayCustomerName(value);
  pageNumber = 0;
  sortColumn = 'PickupDate';
  sortDirection: 'Ascending' | 'Descending' = 'Descending';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private cdpBookingRequestService: CdpBookingRequestService,
    private clossingOneService: ClossingOneService,
    private snackBar: MatSnackBar,
    private router: Router,
    public generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.setupCustomerGroupAutocomplete();
    this.setupCustomerNameAutocomplete();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get visibleColumns(): string[] {
    return [...this.columnDefinitions.filter(col => col.visible).map(col => col.key), 'actions'];
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchPickupFromDate) count++;
    if (this.searchPickupToDate) count++;
    if (this.searchBookingFromDate) count++;
    if (this.searchBookingToDate) count++;
    if (this.searchStatus?.trim()) count++;
    if (this.searchReservationSource?.trim()) count++;
    if (this.searchBookingNo?.trim()) count++;
    if (this.getCustomerGroupFilterValue()) count++;
    if (this.getCustomerNameFilterValue()) count++;
    if (this.searchConfirmation?.trim()) count++;
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
    this.searchBookingFromDate = null;
    this.searchBookingToDate = null;
    this.searchStatus = '';
    this.searchReservationSource = '';
    this.searchBookingNo = '';
    this.searchConfirmation = '';
    this.customerGroupCtrl.setValue('');
    this.customerNameCtrl.setValue('');
    this.customerGroupOptions = [];
    this.customerNameOptions = [];
    this.pageNumber = 0;
    this.hasSearched = false;
    this.dataSource = [];
    this.totalCount = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

  getCustomerGroupOptionValue(option: any): string {
    return (option?.customerGroup ?? option?.CustomerGroup ?? '').toString();
  }

  getCustomerOptionLabel(option: any): string {
    const name = (option?.customerName ?? option?.CustomerName ?? '').toString().trim();
    const tally = this.getTallyText(option);
    return tally ? `${name} ## ${tally}` : name;
  }

  getCustomerOptionValue(option: any): string {
    const name = (option?.customerName ?? option?.CustomerName ?? '').toString().trim();
    const tally = this.getTallyText(option);
    return tally ? `${name}##${tally}` : name;
  }

  displayCustomerName(value: string): string {
    if (!value) {
      return '';
    }
    const parts = value.toString().split('##');
    const name = (parts[0] || '').trim();
    const tally = (parts[1] || '').trim();
    return tally ? `${name} ## ${tally}` : name;
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
    const { bookingFromDate, bookingToDate } = this.getFormattedBookingSearchDates();
    const status = this.searchStatus?.trim() ? this.searchStatus.trim() : null;
    const reservationSource = this.searchReservationSource?.trim() ? this.searchReservationSource.trim() : null;
    const bookingNo = this.searchBookingNo?.trim() ? this.searchBookingNo.trim() : null;
    const customerGroup = this.getCustomerGroupFilterValue();
    const customerName = this.getCustomerNameFilterValue();
    const confirmation = this.searchConfirmation?.trim() ? this.searchConfirmation.trim() : null;

    this.isLoading = true;
    this.cdpBookingRequestService.getTableData(
      fromDate,
      toDate,
      bookingFromDate,
      bookingToDate,
      status,
      reservationSource,
      bookingNo,
      customerGroup,
      customerName,
      confirmation,
      this.pageNumber,
      this.mapSortColumn(this.sortColumn),
      this.sortDirection
    ).subscribe({
      next: (response) => {
        this.dataSource = response.items ?? [];
        this.totalCount = response.totalCount ?? 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.dataSource = [];
        this.totalCount = 0;
        this.isLoading = false;
        const detail = this.extractErrorDetail(err);
        this.showNotification(
          'snackbar-danger',
          detail ? `Failed to load CDP booking requests: ${detail}` : 'Failed to load CDP booking requests.',
          'top',
          'center'
        );
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

  private setupCustomerGroupAutocomplete(): void {
    this.customerGroupCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const term = (value ?? '').toString().trim();
        if (term.length < this.generalService.lengthToCheck) {
          this.customerGroupOptions = [];
          return of([]);
        }
        return this.generalService.GetCustomerGroupDropDownForControlPanel(term).pipe(
          catchError(() => of([]))
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe((list) => {
      this.customerGroupOptions = Array.isArray(list) ? list : [];
    });
  }

  private setupCustomerNameAutocomplete(): void {
    this.customerNameCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const raw = (value ?? '').toString().trim();
        const term = raw.split('##')[0].trim();
        if (term.length < this.generalService.lengthToCheck) {
          this.customerNameOptions = [];
          return of([]);
        }
        return this.generalService.getCustomerPrefix(term).pipe(
          catchError(() => of([]))
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe((list) => {
      this.customerNameOptions = Array.isArray(list) ? list : [];
    });
  }

  private getCustomerGroupFilterValue(): string | null {
    const value = (this.customerGroupCtrl.value ?? '').toString().trim();
    return value || null;
  }

  private getCustomerNameFilterValue(): string | null {
    const value = (this.customerNameCtrl.value ?? '').toString().trim();
    return value || null;
  }

  private getTallyText(option: any): string {
    const tally = option?.tallyCustomerID ?? option?.TallyCustomerID;
    if (tally === null || tally === undefined || tally === '' || tally === 0 || tally === '0') {
      return '';
    }
    return String(tally);
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

  private getFormattedBookingSearchDates(): { bookingFromDate: string; bookingToDate: string } {
    return {
      bookingFromDate: this.formatSearchDate(this.searchBookingFromDate),
      bookingToDate: this.formatSearchDate(this.searchBookingToDate)
    };
  }

  private extractErrorDetail(err: unknown): string {
    if (typeof err === 'string' && err.trim()) {
      const text = err.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const match = text.match(/([A-Za-z.]+Exception:[^.]{0,180})/);
      if (match) {
        return match[1].trim();
      }
      return text.slice(0, 180);
    }
    if (err && typeof err === 'object' && 'message' in err) {
      return String((err as { message?: unknown }).message ?? '').slice(0, 180);
    }
    return '';
  }

  private formatSearchDate(value: Date | null): string {
    if (!value) {
      return '';
    }

    const parsed = moment(value);
    if (!parsed.isValid()) {
      return '';
    }

    return parsed.format('YYYY-MM-DD');
  }

  private mapSortColumn(column: string): string {
    switch (column) {
      case 'bookingNo':
        return 'ReservationID';
      case 'customerGroup':
        return 'CustomerGroup';
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
