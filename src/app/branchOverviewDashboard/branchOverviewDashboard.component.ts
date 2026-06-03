// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Observable, Subject, Subscription, merge, of, timer } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import moment from 'moment';
import { AuthService } from '../core/service/auth.service';
import { BranchOverviewDashboardService } from './branchOverviewDashboard.service';

interface BranchOption {
  branchID: number;
  branchName: string;
}

interface CustomerOption {
  customerID: number;
  customerName: string;
}

interface LocationOption {
  organizationalEntityID: number;
  organizationalEntityName: string;
}

interface DutyTypeOption {
  packageTypeID: number;
  packageType: string;
}

@Component({
  standalone: false,
  selector: 'app-branch-overview-dashboard',
  templateUrl: './branchOverviewDashboard.component.html',
  styleUrls: ['./branchOverviewDashboard.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class BranchOverviewDashboardComponent implements OnInit, OnDestroy {
  branchID: number | null = null;
  branchName = '';
  showAllLocation = false;
  branches: BranchOption[] = [];
  showBranchSelector = false;
  noBranchAssigned = false;

  displayDateRange = '';
  filterDateFrom = new FormControl<Date>(new Date());
  filterDateTo = new FormControl<Date>(new Date());

  branchFilter = new FormControl<number | null>(null);
  branchInput = new FormControl<string>('');
  filteredBranches: Observable<BranchOption[]> = of([]);

  locationFilter = new FormControl<number | string>('all');
  locationInput = new FormControl<string>('All Locations');
  filteredLocations: Observable<LocationOption[]> = of([]);
  locations: LocationOption[] = [];

  customerFilter = new FormControl<number | string>('all');
  customerInput = new FormControl<string>('All Customers');
  filteredCustomers: Observable<CustomerOption[]> = of([]);
  customers: CustomerOption[] = [];

  dutyTypeFilter = new FormControl<number | string>('all');
  dutyTypeInput = new FormControl<string>('All Duty Types');
  filteredDutyTypes: Observable<DutyTypeOption[]> = of([]);
  dutyTypes: DutyTypeOption[] = [];

  dateRangeError = '';
  dateToMax: Date | null = null;
  dateFromMin: Date | null = null;

  detailsVisible = false;
  detailsTitle = '';
  detailsMetricKey = '';
  detailsLoading = false;
  reservationHeaderInfo: any[] = [];
  totalHeaderRecords = 0;
  detailsPageIndex = 0;
  detailsPageSize = 25;
  readonly detailsPageSizeOptions = [10, 25, 50, 100];

  totalBooking = 0;
  cancelled = 0;
  tnc = 0;
  totalAllotted = 0;
  lateAllotted = 0;
  totalOwned = 0;
  totalSupplier = 0;
  lateDispatch = 0;
  notVerified = 0;
  totalDispute = 0;

  supplierDonutSeries = [0, 0, 0];
  supplierDonutLabels = ['Dedicated', 'VDP', 'On Call'];
  supplierDonutColors = ['#7c4dff', '#2196f3', '#ff9800'];
  supplierChartKey = 0;

  donutChart = { type: 'donut', height: 165, width: 150, toolbar: { show: false }, fontFamily: 'inherit' };
  donutPlotOptions = {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          name: { show: true },
          value: { show: true },
          total: { show: true, label: 'Supplier', formatter: () => String(this.totalSupplier) },
        },
      },
    },
  };
  donutLegend = { show: false };
  donutDataLabels = { enabled: false };

  private refreshSub: Subscription;
  private readonly autocompleteRefresh$ = new Subject<void>();

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private dashboardService: BranchOverviewDashboardService
  ) {}

  ngOnInit(): void {
    this.initAutocompleteStreams();
    this.setupDateConstraints();
    this.updateDisplayDateRange();
    this.initBranchFromLogin();
    this.loadDutyTypes();
    this.refreshSub = timer(30000, 30000).subscribe(() => this.onAutoRefresh());
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  initBranchFromLogin(): void {
    const emp = this.authService.currentUserValue?.employee;
    if (!emp) {
      this.noBranchAssigned = true;
      this.branchName = 'No branch assigned';
      return;
    }

    this.showAllLocation = !!(emp.ShowAllLocation ?? emp.showAllLocation);
    const userID = this.getCurrentUserId();
    if (userID) {
      this.loadBranchesFromApi(userID, emp);
      return;
    }

    this.applyBranchesFromLogin(emp);
  }

  private loadBranchesFromApi(userID: number, emp: any): void {
    this.dashboardService.getBranches(userID).subscribe(
      (res) => {
        const arr = this.toArray(res);
        if (arr.length > 0) {
          this.branches = arr
            .map((b: any) => ({
              branchID: b.branchID ?? b.BranchID,
              branchName: b.branchName ?? b.BranchName ?? '',
              isDefault: !!(b.isDefault ?? b.IsDefault),
            }))
            .filter((b: BranchOption) => b.branchID != null && b.branchName);
        } else {
          this.applyBranchesFromLogin(emp, false);
        }
        this.finishBranchInit(emp);
      },
      () => {
        this.applyBranchesFromLogin(emp, false);
        this.finishBranchInit(emp);
      }
    );
  }

  private applyBranchesFromLogin(emp: any, finishInit = true): void {
    const rawBranches = emp.Branches ?? emp.branches ?? [];
    this.branches = (Array.isArray(rawBranches) ? rawBranches : [])
      .map((b) => ({ branchID: b.BranchID ?? b.branchID, branchName: b.BranchName ?? b.branchName ?? '' }))
      .filter((b) => b.branchID != null && b.branchName);

    if (finishInit) {
      this.finishBranchInit(emp);
    }
  }

  private finishBranchInit(emp: any): void {
    const defaultFromApi = this.branches.find((b: any) => b.isDefault);
    const defaultBranch = emp.DefaultBranch ?? emp.defaultBranch;
    const selected = defaultFromApi
      ? defaultFromApi
      : defaultBranch != null
        ? {
            branchID: defaultBranch.BranchID ?? defaultBranch.branchID,
            branchName: defaultBranch.BranchName ?? defaultBranch.branchName ?? '',
          }
        : this.branches[0] ?? null;

    if (selected?.branchID != null) {
      this.onBranchOptionSelected(selected);
    } else {
      this.noBranchAssigned = true;
      this.branchName = 'No branch assigned';
    }

    this.showBranchSelector = this.showAllLocation || this.branches.length > 1;
    this.refreshAutocompleteOptions();
  }

  onBranchOptionSelected(option: BranchOption): void {
    if (!option) return;
    this.branchInput.setValue(option.branchName, { emitEvent: false });
    this.applySelectedBranch(option.branchID, option.branchName);
  }

  onLocationOptionSelected(option: LocationOption | null): void {
    if (!option) {
      this.locationFilter.setValue('all', { emitEvent: false });
      this.locationInput.setValue('All Locations', { emitEvent: false });
      return;
    }
    this.locationFilter.setValue(option.organizationalEntityID, { emitEvent: false });
    this.locationInput.setValue(option.organizationalEntityName, { emitEvent: false });
  }

  onCustomerOptionSelected(option: CustomerOption | null): void {
    if (!option) {
      this.customerFilter.setValue('all', { emitEvent: false });
      this.customerInput.setValue('All Customers', { emitEvent: false });
      return;
    }
    this.customerFilter.setValue(option.customerID, { emitEvent: false });
    this.customerInput.setValue(option.customerName, { emitEvent: false });
  }

  onDutyTypeOptionSelected(option: DutyTypeOption | null): void {
    if (!option) {
      this.dutyTypeFilter.setValue('all', { emitEvent: false });
      this.dutyTypeInput.setValue('All Duty Types', { emitEvent: false });
      return;
    }
    this.dutyTypeFilter.setValue(option.packageTypeID, { emitEvent: false });
    this.dutyTypeInput.setValue(option.packageType, { emitEvent: false });
  }

  onApplyFilters(): void {
    if (!this.validateDateRange(true)) return;
    this.updateDisplayDateRange();
    this.loadBookingCount();
    this.refreshVisibleDetailsIfOpen();
    const branchHint = this.branchID != null ? ` (branch ID ${this.branchID})` : '';
    this.snackBar.open(`Filters applied${branchHint}`, 'OK', { duration: 2500 });
  }

  onAutoRefresh(): void {
    if (!this.validateDateRange(false)) return;
    this.loadBookingCount();
    this.refreshVisibleDetailsIfOpen();
  }

  onManualRefresh(): void {
    if (!this.validateDateRange(true)) return;
    this.loadBookingCount();
    this.refreshVisibleDetailsIfOpen();
    this.snackBar.open('Dashboard refreshed', '', { duration: 1500 });
  }

  onDateFromChange(): void {
    this.setupDateConstraints();
    this.validateDateRange(true);
  }

  onDateToChange(): void {
    this.setupDateConstraints();
    this.validateDateRange(true);
  }

  openBookingDetails(metricKey: string, title: string, event?: Event): void {
    event?.preventDefault();
    if (!this.branchID) {
      this.snackBar.open('Please select a branch before viewing details.', 'OK', { duration: 3500 });
      return;
    }
    if (!this.validateDateRange(true)) return;

    this.detailsVisible = true;
    this.detailsTitle = title;
    this.detailsMetricKey = metricKey;
    this.detailsLoading = true;
    this.reservationHeaderInfo = [];
    this.totalHeaderRecords = 0;

    const dateFrom = moment(this.filterDateFrom.value).format('YYYY-MM-DD');
    const dateTo = moment(this.filterDateTo.value).format('YYYY-MM-DD');
    const customerID = this.customerFilter.value === 'all' ? null : Number(this.customerFilter.value);
    const locationID = this.locationFilter.value === 'all' ? null : Number(this.locationFilter.value);
    const packageTypeID = this.dutyTypeFilter.value === 'all' ? null : Number(this.dutyTypeFilter.value);

    if (!this.usesControlPanelDetailsGrid(metricKey)) {
      this.detailsLoading = false;
      this.detailsVisible = false;
      return;
    }

    const userID = this.getCurrentUserId();
    if (!userID) {
      this.detailsLoading = false;
      this.snackBar.open('Unable to identify the logged-in user.', 'OK', { duration: 3500 });
      return;
    }

    this.detailsPageIndex = 0;
    this.loadDetailsHeaders(metricKey, userID, dateFrom, dateTo, customerID, locationID, packageTypeID, 1, this.detailsPageSize);
  }

  onDetailsPageChange(event: PageEvent): void {
    if (!this.branchID || !this.detailsMetricKey) return;

    this.detailsPageIndex = event.pageIndex;
    this.detailsPageSize = event.pageSize;

    const dateFrom = moment(this.filterDateFrom.value).format('YYYY-MM-DD');
    const dateTo = moment(this.filterDateTo.value).format('YYYY-MM-DD');
    const customerID = this.customerFilter.value === 'all' ? null : Number(this.customerFilter.value);
    const locationID = this.locationFilter.value === 'all' ? null : Number(this.locationFilter.value);
    const packageTypeID = this.dutyTypeFilter.value === 'all' ? null : Number(this.dutyTypeFilter.value);
    const userID = this.getCurrentUserId();
    if (!userID) return;

    this.loadDetailsHeaders(
      this.detailsMetricKey,
      userID,
      dateFrom,
      dateTo,
      customerID,
      locationID,
      packageTypeID,
      event.pageIndex + 1,
      event.pageSize
    );
  }

  private refreshVisibleDetailsIfOpen(): void {
    if (!this.detailsVisible || !this.detailsMetricKey || !this.branchID) return;
    if (!this.usesControlPanelDetailsGrid(this.detailsMetricKey)) return;

    const params = this.getDetailFilterParams();
    if (!params) return;

    const userID = this.getCurrentUserId();
    if (!userID) return;

    this.detailsPageIndex = 0;
    this.totalHeaderRecords = 0;
    this.loadDetailsHeaders(
      this.detailsMetricKey,
      userID,
      params.dateFrom,
      params.dateTo,
      params.customerID,
      params.locationID,
      params.packageTypeID,
      1,
      this.detailsPageSize
    );
  }

  private getDetailFilterParams(): {
    dateFrom: string;
    dateTo: string;
    customerID: number | null;
    locationID: number | null;
    packageTypeID: number | null;
  } | null {
    if (!this.filterDateFrom.value || !this.filterDateTo.value) return null;

    return {
      dateFrom: moment(this.filterDateFrom.value).format('YYYY-MM-DD'),
      dateTo: moment(this.filterDateTo.value).format('YYYY-MM-DD'),
      customerID: this.customerFilter.value === 'all' ? null : Number(this.customerFilter.value),
      locationID: this.locationFilter.value === 'all' ? null : Number(this.locationFilter.value),
      packageTypeID: this.dutyTypeFilter.value === 'all' ? null : Number(this.dutyTypeFilter.value),
    };
  }

  private loadDetailsHeaders(
    metricKey: string,
    userID: number,
    dateFrom: string,
    dateTo: string,
    customerID: number | null,
    locationID: number | null,
    packageTypeID: number | null,
    page: number,
    pageSize: number
  ): void {
    this.detailsLoading = true;

    this.dashboardService
      .getBookingHeaders(this.branchID, dateFrom, dateTo, metricKey, userID, customerID, locationID, packageTypeID, page, pageSize)
      .subscribe(
        (res) => {
          const rawDetails = res?.reservationHeaderDetails ?? res?.ReservationHeaderDetails;
          this.reservationHeaderInfo = this.dedupeHeaderRows(this.toArray(rawDetails));
          const apiTotal = Number(res?.totalRecords ?? res?.TotalRecords ?? 0);
          this.totalHeaderRecords =
            apiTotal > 0
              ? apiTotal
              : this.reservationHeaderInfo.length > 0
                ? this.getKpiCountForMetric() || this.reservationHeaderInfo.length
                : 0;
          this.detailsLoading = false;
        },
        () => {
          this.reservationHeaderInfo = [];
          this.totalHeaderRecords = 0;
          this.detailsLoading = false;
          this.snackBar.open('Unable to load booking details. Please try again.', 'OK', { duration: 3500 });
        }
      );
  }

  getDetailsPanelSubtitle(): string {
    const key = (this.detailsMetricKey || '').trim().toLowerCase();
    if (
      key === 'totalallotted' ||
      key === 'lateallotted' ||
      key === 'totalowned' ||
      key === 'totalsupplier'
    ) {
      return 'Allotment Details';
    }
    return 'Booking Details';
  }

  getDetailsHeaderCountText(): string {
    if (this.detailsLoading) return '';
    const total = this.getDisplayTotalCount();
    if (total === 0) return '0 records';
    if (total === 1) return '1 record';
    return `${total} records`;
  }

  getDisplayTotalCount(): number {
    if (this.totalHeaderRecords > 0) return this.totalHeaderRecords;
    const kpi = this.getKpiCountForMetric();
    if (kpi > 0) return kpi;
    if (this.reservationHeaderInfo.length >= this.detailsPageSize) {
      return this.detailsPageIndex * this.detailsPageSize + this.reservationHeaderInfo.length + 1;
    }
    return this.reservationHeaderInfo.length;
  }

  get showDetailsPaginator(): boolean {
    if (this.detailsLoading) return false;
    return this.getDisplayTotalCount() > this.detailsPageSize || this.reservationHeaderInfo.length >= this.detailsPageSize;
  }

  getDetailsPageRangeText(): string {
    if (this.detailsLoading || this.reservationHeaderInfo.length === 0) return '';
    const total = this.getDisplayTotalCount();
    const start = this.detailsPageIndex * this.detailsPageSize + 1;
    const end = start + this.reservationHeaderInfo.length - 1;
    if (total > 0) return `Showing ${start}–${end} of ${total}`;
    return `Showing ${this.reservationHeaderInfo.length} on this page`;
  }

  private getKpiCountForMetric(): number {
    const key = (this.detailsMetricKey || '').trim().toLowerCase();
    switch (key) {
      case 'totalbooking':
        return this.totalBooking;
      case 'cancelled':
        return this.cancelled;
      case 'tnc':
        return this.tnc;
      case 'totalallotted':
        return this.totalAllotted;
      case 'lateallotted':
        return this.lateAllotted;
      case 'totalowned':
        return this.totalOwned;
      case 'totalsupplier':
        return this.totalSupplier;
      case 'latedispatch':
        return this.lateDispatch;
      case 'notverified':
        return this.notVerified;
      case 'totaldispute':
        return this.totalDispute;
      default:
        return 0;
    }
  }

  private dedupeHeaderRows(rows: any[]): any[] {
    const seen = new Set<number>();
    return rows.filter((row) => {
      const id = Number(row?.reservationID ?? row?.ReservationID ?? 0);
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  closeBookingDetails(): void {
    this.detailsVisible = false;
    this.detailsTitle = '';
    this.detailsMetricKey = '';
    this.reservationHeaderInfo = [];
    this.totalHeaderRecords = 0;
    this.detailsPageIndex = 0;
  }

  getPackageTypeLabel(row: any): string {
    return row?.package?.packageType ?? row?.package?.PackageType ?? row?.packageType ?? row?.PackageType ?? '—';
  }

  getPackageLabel(row: any): string {
    return row?.package?.package ?? row?.package?.Package ?? row?.packageName ?? row?.PackageName ?? '';
  }

  formatCpDate(value: any): string {
    return value ? moment(value).format('DD-MMM-YY') : 'N/A';
  }

  formatCpTime(value: any): string {
    if (!value) return 'TNC';
    const parsed = moment(value);
    return parsed.isValid() ? parsed.format('H:mm') : String(value);
  }

  private usesControlPanelDetailsGrid(metricKey: string): boolean {
    const key = (metricKey || '').trim().toLowerCase();
    return (
      key === 'totalbooking' ||
      key === 'cancelled' ||
      key === 'tnc' ||
      key === 'totalallotted' ||
      key === 'lateallotted' ||
      key === 'totalowned' ||
      key === 'totalsupplier' ||
      key === 'latedispatch' ||
      key === 'notverified' ||
      key === 'totaldispute'
    );
  }

  private getCurrentUserId(): number {
    const emp = this.authService.currentUserValue?.employee;
    const id = emp?.EmployeeID ?? emp?.employeeID ?? emp?.UserID ?? emp?.userID ?? 0;
    return Number(id) || 0;
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.onClose();
  }

  onClose(): void {
    this.router.navigate(['/dashboard/main']);
  }

  supplierLegendPct(i: number): string {
    const sum = this.supplierDonutSeries.reduce((a, b) => a + b, 0);
    return sum ? Math.round((this.supplierDonutSeries[i] / sum) * 100) + '%' : '0%';
  }

  displayBranch = (value: BranchOption | string): string =>
    typeof value === 'string' ? value : value?.branchName ?? '';

  displayLocation = (value: LocationOption | string): string =>
    typeof value === 'string' ? value : value?.organizationalEntityName ?? '';

  displayCustomer = (value: CustomerOption | string): string =>
    typeof value === 'string' ? value : value?.customerName ?? '';

  displayDutyType = (value: DutyTypeOption | string): string =>
    typeof value === 'string' ? value : value?.packageType ?? '';

  onAutocompleteFocus(): void {
    this.refreshAutocompleteOptions();
  }

  private initAutocompleteStreams(): void {
    const branchQuery$ = merge(
      this.branchInput.valueChanges.pipe(startWith(this.branchInput.value ?? '')),
      this.autocompleteRefresh$.pipe(map(() => this.branchInput.value ?? ''))
    );
    const locationQuery$ = merge(
      this.locationInput.valueChanges.pipe(startWith(this.locationInput.value ?? '')),
      this.autocompleteRefresh$.pipe(map(() => this.locationInput.value ?? ''))
    );
    const customerQuery$ = merge(
      this.customerInput.valueChanges.pipe(startWith(this.customerInput.value ?? '')),
      this.autocompleteRefresh$.pipe(map(() => this.customerInput.value ?? ''))
    );
    const dutyTypeQuery$ = merge(
      this.dutyTypeInput.valueChanges.pipe(startWith(this.dutyTypeInput.value ?? '')),
      this.autocompleteRefresh$.pipe(map(() => this.dutyTypeInput.value ?? ''))
    );

    this.filteredBranches = branchQuery$.pipe(
      map((value) => this.filterByName(this.branches, value, (x) => x.branchName))
    );
    this.filteredLocations = locationQuery$.pipe(
      map((value) => this.filterByName(this.locations, value, (x) => x.organizationalEntityName, true))
    );
    this.filteredCustomers = customerQuery$.pipe(
      map((value) => this.filterByName(this.customers, value, (x) => x.customerName, true))
    );
    this.filteredDutyTypes = dutyTypeQuery$.pipe(
      map((value) => this.filterByName(this.dutyTypes, value, (x) => x.packageType, true))
    );
  }

  private refreshAutocompleteOptions(): void {
    this.autocompleteRefresh$.next();
  }

  private filterByName<T>(
    items: T[],
    value: string | T | null,
    getter: (item: T) => string,
    treatAllLabelAsEmpty = false
  ): T[] {
    const text =
      typeof value === 'string'
        ? value
        : value && typeof value === 'object'
          ? getter(value as T)
          : '';
    const normalized = (text || '').toLowerCase().trim();
    if (!normalized || (treatAllLabelAsEmpty && this.isAllSelectionLabel(normalized))) {
      return items;
    }
    return items.filter((x) => (getter(x) || '').toLowerCase().includes(normalized));
  }

  private isAllSelectionLabel(text: string): boolean {
    return (
      text === 'all locations' ||
      text === 'all customers' ||
      text === 'all duty types'
    );
  }

  private applySelectedBranch(branchID: number, branchName: string): void {
    this.branchID = branchID;
    this.branchName = branchName;
    this.branchFilter.setValue(branchID, { emitEvent: false });
    this.branchInput.setValue(branchName, { emitEvent: false });
    this.noBranchAssigned = false;

    this.locationFilter.setValue('all', { emitEvent: false });
    this.locationInput.setValue('All Locations', { emitEvent: false });
    this.customerFilter.setValue('all', { emitEvent: false });
    this.customerInput.setValue('All Customers', { emitEvent: false });
    this.dutyTypeFilter.setValue('all', { emitEvent: false });
    this.dutyTypeInput.setValue('All Duty Types', { emitEvent: false });

    this.loadLocations();
    this.loadCustomers();
    this.loadBookingCount();
    this.refreshVisibleDetailsIfOpen();
  }

  private setupDateConstraints(): void {
    const from = this.filterDateFrom.value ? moment(this.filterDateFrom.value).startOf('day') : null;
    const to = this.filterDateTo.value ? moment(this.filterDateTo.value).startOf('day') : null;
    this.dateToMax = from ? from.clone().add(7, 'days').toDate() : null;
    this.dateFromMin = to ? to.clone().subtract(7, 'days').toDate() : null;
  }

  private validateDateRange(showSnack: boolean): boolean {
    const from = this.filterDateFrom.value;
    const to = this.filterDateTo.value;

    if (!from || !to) {
      this.dateRangeError = 'Please select both Date From and Date To.';
      if (showSnack) this.snackBar.open(this.dateRangeError, 'OK', { duration: 4000 });
      return false;
    }

    const fromM = moment(from).startOf('day');
    const toM = moment(to).startOf('day');

    if (fromM.isAfter(toM)) {
      this.dateRangeError = 'Date From cannot be later than Date To.';
      if (showSnack) this.snackBar.open(this.dateRangeError, 'OK', { duration: 4000 });
      return false;
    }

    const daySpan = toM.diff(fromM, 'days');
    if (daySpan > 7) {
      this.dateRangeError = 'The date range cannot exceed 7 days. Please select a shorter range.';
      if (showSnack) this.snackBar.open(this.dateRangeError, 'OK', { duration: 4000 });
      return false;
    }

    this.dateRangeError = '';
    return true;
  }

  private updateDisplayDateRange(): void {
    const fromStr = this.filterDateFrom.value ? moment(this.filterDateFrom.value).format('DD-MMM-YYYY') : '';
    const toStr = this.filterDateTo.value ? moment(this.filterDateTo.value).format('DD-MMM-YYYY') : '';
    this.displayDateRange = fromStr && toStr ? `${fromStr} – ${toStr}` : fromStr || toStr;
  }

  private loadLocations(): void {
    if (!this.branchID) {
      this.locations = [];
      this.locationFilter.setValue('all', { emitEvent: false });
      this.locationInput.setValue('All Locations', { emitEvent: false });
      return;
    }
    const userID = this.getCurrentUserId();
    if (!userID) {
      this.locations = [];
      return;
    }
    this.dashboardService.getLocations(this.branchID, userID).subscribe(
      (res) => {
        const arr = this.toArray(res);
        this.locations = arr
          .map((l: any) => ({ organizationalEntityID: l.organizationalEntityID ?? l.OrganizationalEntityID, organizationalEntityName: l.organizationalEntityName ?? l.OrganizationalEntityName }))
          .filter((l: LocationOption) => !!l.organizationalEntityID && !!l.organizationalEntityName);
        this.locationFilter.setValue('all', { emitEvent: false });
        this.locationInput.setValue('All Locations', { emitEvent: false });
        this.refreshAutocompleteOptions();
      },
      (err) => {
        this.locations = [];
        this.locationFilter.setValue('all', { emitEvent: false });
        this.locationInput.setValue('All Locations', { emitEvent: false });
        this.refreshAutocompleteOptions();
      }
    );
  }

  private loadCustomers(): void {
    if (!this.branchID) {
      this.customers = [];
      this.customerFilter.setValue('all', { emitEvent: false });
      this.customerInput.setValue('All Customers', { emitEvent: false });
      return;
    }
    const userID = this.getCurrentUserId();
    if (!userID) {
      this.customers = [];
      return;
    }
    this.dashboardService.getCustomers(this.branchID, userID).subscribe(
      (res) => {
        const arr = this.toArray(res);
        this.customers = arr
          .map((c: any) => ({ customerID: c.customerID ?? c.CustomerID, customerName: c.customerName ?? c.CustomerName }))
          .filter((c: CustomerOption) => !!c.customerID && !!c.customerName);
        this.customerFilter.setValue('all', { emitEvent: false });
        this.customerInput.setValue('All Customers', { emitEvent: false });
        this.refreshAutocompleteOptions();
      },
      (err) => {
        this.customers = [];
        this.customerFilter.setValue('all', { emitEvent: false });
        this.customerInput.setValue('All Customers', { emitEvent: false });
        this.refreshAutocompleteOptions();
      }
    );
  }

  private loadDutyTypes(): void {
    this.dashboardService.getDutyTypes().subscribe(
      (res) => {
        const arr = this.toArray(res);
        this.dutyTypes = arr
          .map((p: any) => ({ packageTypeID: p.packageTypeID ?? p.PackageTypeID, packageType: p.packageType ?? p.PackageType }))
          .filter((p: DutyTypeOption) => !!p.packageTypeID && !!p.packageType);
        this.dutyTypeFilter.setValue('all', { emitEvent: false });
        this.dutyTypeInput.setValue('All Duty Types', { emitEvent: false });
        this.refreshAutocompleteOptions();
      },
      (err) => {
        this.dutyTypes = [];
        this.dutyTypeFilter.setValue('all', { emitEvent: false });
        this.dutyTypeInput.setValue('All Duty Types', { emitEvent: false });
        this.refreshAutocompleteOptions();
      }
    );
  }

  private loadBookingCount(): void {
    if (!this.branchID) {
      this.totalBooking = 0;
      return;
    }
    if (!this.validateDateRange(false)) return;

    const dateFrom = this.filterDateFrom.value ? moment(this.filterDateFrom.value).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    const dateTo = this.filterDateTo.value ? moment(this.filterDateTo.value).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    const customerID = this.customerFilter.value === 'all' ? null : Number(this.customerFilter.value);
    const locationID = this.locationFilter.value === 'all' ? null : Number(this.locationFilter.value);
    const packageTypeID = this.dutyTypeFilter.value === 'all' ? null : Number(this.dutyTypeFilter.value);

    const userID = this.getCurrentUserId();
    if (!userID) {
      this.totalBooking = 0;
      return;
    }

    this.dashboardService.getSummary(this.branchID, dateFrom, dateTo, userID, customerID, locationID, packageTypeID).subscribe(
      (res) => {
        this.totalBooking = Number(res?.totalBooking ?? res?.TotalBooking ?? 0);
        this.cancelled = Number(res?.cancelled ?? res?.Cancelled ?? 0);
        this.tnc = Number(res?.tnc ?? res?.TNC ?? 0);
        this.totalAllotted = Number(res?.totalAllotted ?? res?.TotalAllotted ?? 0);
        this.lateAllotted = Number(res?.lateAllotted ?? res?.LateAllotted ?? 0);
        this.totalOwned = Number(res?.totalOwned ?? res?.TotalOwned ?? 0);
        this.totalSupplier = Number(res?.totalSupplier ?? res?.TotalSupplier ?? 0);
        this.lateDispatch = Number(res?.lateDispatch ?? res?.LateDispatch ?? 0);
        this.notVerified = Number(res?.notVerified ?? res?.NotVerified ?? 0);
        this.totalDispute = Number(res?.totalDispute ?? res?.TotalDispute ?? 0);
        this.updateSupplierDonutChart(res);
      },
      () => {
        this.totalBooking = 0;
        this.cancelled = 0;
        this.tnc = 0;
        this.totalAllotted = 0;
        this.lateAllotted = 0;
        this.totalOwned = 0;
        this.totalSupplier = 0;
        this.lateDispatch = 0;
        this.notVerified = 0;
        this.totalDispute = 0;
        this.updateSupplierDonutChart(null);
      }
    );
  }

  private updateSupplierDonutChart(summary: any): void {
    this.supplierDonutSeries = [
      Number(summary?.dedicated ?? summary?.Dedicated ?? 0),
      Number(summary?.vdp ?? summary?.VDP ?? 0),
      Number(summary?.onCall ?? summary?.OnCall ?? 0),
    ];
    this.supplierChartKey++;
  }

  private toArray(value: any): any[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.$values)) return value.$values;
    return [];
  }
}
