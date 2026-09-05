// @ts-nocheck
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import { SearchCriteria } from './bookingMis.model';
import { BookingMisService } from './bookingMis.service';
import { extractExportErrorMessage, exportJobAcceptedSnackbarMessage, exportSearchButtonLabel, formatExportElapsedTime, IN_FLIGHT_EXPORT_MESSAGE, isExportJobCancelled, isExportJobNotFoundError, loadPersistedExportJobId, markExportDumpStarted, persistExportJobId } from '../general/export-job.helper';
import { StoredMisExportsComponent } from '../general/stored-mis-exports.component';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { ModeOfPaymentDropDown } from '../modeOfPayment/modeOfPaymentDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';
import { CustomerPersonDetailsDropDown } from '../passengerDetails/customerPersonDetailsDropDown.model';
import { GeoPointTypeDropDown } from '../geoPointType/geoPointTypeDropDown.model';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';
import { SalesPersonModel } from '../bookingBackupMIS/bookingBackupMIS.model';

@Component({
  standalone: false,
  selector: 'app-booking-mis',
  templateUrl: './bookingMis.component.html',
  styleUrls: ['./bookingMis.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BookingMisComponent implements OnInit, OnDestroy {
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  private readonly exportJobPageKey = 'bookingMis';
  @ViewChild(StoredMisExportsComponent) storedExports?: StoredMisExportsComponent;
  readonly maxPickupDateRangeDays = 15;

  modeOfPayment: FormControl = new FormControl();
  customer: FormControl = new FormControl();
  customerGroup: FormControl = new FormControl();
  serviceLocation: FormControl = new FormControl();
  customerLocation: FormControl = new FormControl();
  city: FormControl = new FormControl();
  guestName: FormControl = new FormControl();
  bookerName: FormControl = new FormControl();
  salesPerson: FormControl = new FormControl();
  pickupDetail: FormControl = new FormControl();
  pickupSubDetail: FormControl = new FormControl();

  searchDutySlip = '';
  searchManualDS = '';
  searchBooking = '';
  searchDispatchStatus = '';
  searchBookingStatus = '';
  searchFromDate = '';
  searchToDate = '';
  searchCancellationFrom = '';
  searchCancellationTo = '';
  searchBookingDateFrom = '';
  searchBookingDateTo = '';
  geoPointTypeID: any;

  PaymentModeList: ModeOfPaymentDropDown[] = [];
  CustomerList: CustomerDropDown[] = [];
  customerGroupList: CustomerGroupDropDown[] = [];
  ServiceList: OrganizationalEntityDropDown[] = [];
  CustomerLocationList: OrganizationalEntityDropDown[] = [];
  CityList: CityDropDown[] = [];
  CustomerPersonList: CustomerPersonDetailsDropDown[] = [];
  BookerList: CustomerPersonDetailsDropDown[] = [];
  SalesPersonList: SalesPersonModel[] = [];
  GeoPointTypeList: GeoPointTypeDropDown[] = [];
  PickupSpotList: StatesDropDown[] = [];

  filteredPaymentModeOptions: Observable<ModeOfPaymentDropDown[]>;
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  filteredOptions: Observable<CustomerGroupDropDown[]>;
  filteredServiceOptions: Observable<OrganizationalEntityDropDown[]>;
  filteredCustomerLocationOptions: Observable<OrganizationalEntityDropDown[]>;
  filteredCityOptions: Observable<CityDropDown[]>;
  filteredCustomerPersonOptions: Observable<CustomerPersonDetailsDropDown[]>;
  filteredBookerOptions: Observable<CustomerPersonDetailsDropDown[]>;
  filteredSalesPersonOptions: Observable<SalesPersonModel[]>;
  filteredGeoPointTypeOptions: Observable<GeoPointTypeDropDown[]>;
  filteredPickupSpotOptions: Observable<StatesDropDown[]>;

  constructor(
    private snackBar: MatSnackBar,
    public generalService: GeneralService,
    public bookingMisService: BookingMisService
  ) {}

  ngOnInit() {
    this.InitPaymentMode();
    this.initCustomerGroup();
    this.initCustomer();
    this.InitBooker();
    this.initCity();
    this.InitSalesPerson();
    this.InitGuestDetails();
    this.initCustomerLocation();
    this.initServiceLocation();
    this.InitPickupDetails();
    this.resumeExportJobIfNeeded();
  }

  ngOnDestroy() {
    this.stopExportPolling();
  }

  refresh() {
    this.clearExportJob();
    this.modeOfPayment.setValue('');
    this.customer.setValue('');
    this.customerGroup.setValue('');
    this.salesPerson.setValue('');
    this.bookerName.setValue('');
    this.city.setValue('');
    this.guestName.setValue('');
    this.pickupSubDetail.setValue('');
    this.pickupDetail.setValue('');
    this.customerLocation.setValue('');
    this.serviceLocation.setValue('');
    this.searchDutySlip = '';
    this.searchManualDS = '';
    this.searchBooking = '';
    this.searchDispatchStatus = '';
    this.searchBookingStatus = '';
    this.searchFromDate = '';
    this.searchToDate = '';
    this.searchCancellationFrom = '';
    this.searchCancellationTo = '';
    this.searchBookingDateFrom = '';
    this.searchBookingDateTo = '';
    this.geoPointTypeID = null;
    this.PickupSpotList = [];
  }

  buildSearchCriteria(): SearchCriteria {
    return {
      UserID: this.generalService.getUserID(),
      ShowAllLocation: null,
      SearchModeOfPayment: this.modeOfPayment?.value || '',
      SearchServiceLocation: this.serviceLocation?.value || '',
      SearchCustomer: this.customer?.value || '',
      SearchDutySlip: this.searchDutySlip || '',
      SearchManualDS: this.searchManualDS || '',
      SearchBooking: this.searchBooking || '',
      SearchCity: this.city?.value || '',
      SearchFromDate: this.searchFromDate !== '' ? moment(this.searchFromDate).format('MMM DD yyyy') : '',
      SearchToDate: this.searchToDate !== '' ? moment(this.searchToDate).format('MMM DD yyyy') : '',
      SearchCancellationFrom:
        this.searchCancellationFrom !== '' ? moment(this.searchCancellationFrom).format('MMM DD yyyy') : '',
      SearchCancellationTo:
        this.searchCancellationTo !== '' ? moment(this.searchCancellationTo).format('MMM DD yyyy') : '',
      SearchBookingDateFrom:
        this.searchBookingDateFrom !== '' ? moment(this.searchBookingDateFrom).format('MMM DD yyyy') : '',
      SearchBookingDateTo:
        this.searchBookingDateTo !== '' ? moment(this.searchBookingDateTo).format('MMM DD yyyy') : '',
      SearchSalesPerson: this.salesPerson?.value || '',
      SearchDispatchStatus: this.searchDispatchStatus || '',
      SearchBookingStatus: this.searchBookingStatus || '',
      SearchCustomerLocation: this.customerLocation?.value || '',
      SearchGuestName: this.guestName?.value || '',
      SearchPickupDetail: this.pickupDetail?.value || '',
      SearchPickupSubDetail: this.pickupSubDetail?.value || '',
      SearchCustomerGroup: this.customerGroup?.value || '',
      SearchBookerName: this.bookerName?.value || ''
    };
  }

  SearchData() {
    if (this.exportJobRunning) {
      this.showNotification('snackbar-danger', IN_FLIGHT_EXPORT_MESSAGE, 'bottom', 'center');
      return;
    }

    const dateRangeError = this.validateSearchDateRanges();
    if (dateRangeError) {
      this.showNotification('snackbar-danger', dateRangeError, 'bottom', 'center');
      return;
    }

    this.exportJobError = '';
    const searchCriteria = this.buildSearchCriteria();

    this.exportJobRunning = true;

    this.bookingMisService.startExportJob(searchCriteria).subscribe(
      (startResult: any) => {
        const jobId = startResult?.jobId ?? startResult?.JobId;
        if (!jobId) {
          this.exportJobRunning = false;
          this.exportJobError = 'Could not start export job.';
          this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
          return;
        }

        this.exportJobId = jobId;
        persistExportJobId(this.exportJobPageKey, jobId);
        this.exportJobStatus = {
          jobId,
          status: startResult?.status ?? startResult?.Status ?? 'Pending',
          message: startResult?.message ?? startResult?.Message ?? 'Export queued'
        };
        this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, this.exportJobStatus);
        this.startExportPolling(jobId);
        this.showNotification(
          'snackbar-info',
          exportJobAcceptedSnackbarMessage(startResult),
          'bottom',
          'center'
        );
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error, 'Could not start export');
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
      }
    );
  }

  downloadExportCsv() {
    if (!this.exportJobId || !this.bookingMisService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.bookingMisService.downloadExportJob(this.exportJobId).subscribe(
      async (blob: Blob) => {
        this.exportJobDownloading = false;

        if (!blob || blob.size === 0) {
          this.showNotification('snackbar-danger', 'Export file is empty or unavailable.', 'bottom', 'center');
          return;
        }

        const contentType = (blob.type || '').toLowerCase();
        if (contentType.includes('application/json') || contentType.includes('text/plain')) {
          const text = await blob.text();
          let message = 'Export file is not ready.';
          try {
            const parsed = JSON.parse(text || '{}');
            message = parsed.message || message;
          } catch {
            if (text && text.trim()) {
              message = text;
            }
          }
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
          return;
        }

        const fileName = this.exportJobStatus?.fileName ?? this.exportJobStatus?.FileName;
        this.triggerCsvDownload(blob, fileName);
      },
      async (error) => {
        this.exportJobDownloading = false;
        const message = await extractExportErrorMessage(error, 'Export download failed.');
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  cancelExportJob() {
    if (!this.exportJobId || !this.isExportJobInProgress()) {
      return;
    }

    this.bookingMisService.cancelExportJob(this.exportJobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        this.exportJobRunning = false;
        this.stopExportPolling();
        this.showNotification('snackbar-info', status?.message ?? status?.Message ?? 'Export cancelled.', 'bottom', 'center');
      },
      async (error) => {
        const message = await extractExportErrorMessage(error, 'Could not cancel export.');
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  canDownloadExport(): boolean {
    return (
      !!this.exportJobId &&
      this.bookingMisService.isExportJobReady(this.exportJobStatus) &&
      !this.exportJobDownloading
    );
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.bookingMisService.isExportJobRunning(this.exportJobStatus);
  }

  getExportJobStatusLabel(): string {
    return this.exportJobStatus?.status ?? this.exportJobStatus?.Status ?? '';
  }

  getExportJobMessage(): string {
    return this.exportJobStatus?.message ?? this.exportJobStatus?.Message ?? this.exportJobError ?? '';
  }

  getExportRowsExported(): number {
    return this.exportJobStatus?.rowsExported ?? this.exportJobStatus?.RowsExported ?? 0;
  }

  getExportElapsedTime(): string {
    return formatExportElapsedTime(this.exportJobStartedAt, this.exportJobStatus);
  }

  getExportSearchButtonLabel(): string {
    return exportSearchButtonLabel(this.exportJobStatus, this.isExportJobInProgress());
  }

  validateSearchDateRanges(): string | null {
    const hasPickupFrom = this.isSearchValueSet(this.searchFromDate);
    const hasPickupTo = this.isSearchValueSet(this.searchToDate);
    const hasBookingFrom = this.isSearchValueSet(this.searchBookingDateFrom);
    const hasBookingTo = this.isSearchValueSet(this.searchBookingDateTo);
    const hasPickupRange = hasPickupFrom && hasPickupTo;
    const hasBookingRange = hasBookingFrom && hasBookingTo;

    if (hasPickupFrom !== hasPickupTo) {
      return 'Please select both Pickup Date From and Pickup Date To.';
    }
    if (hasBookingFrom !== hasBookingTo) {
      return 'Please select both Booking Date From and Booking Date To.';
    }
    if (!hasPickupRange && !hasBookingRange) {
      return 'Select Pickup Date From/To, or Booking Date From/To.';
    }

    if (hasPickupRange) {
      const pickupError = this.validateDatePair(
        this.searchFromDate,
        this.searchToDate,
        'Pickup date',
        !hasBookingRange && !this.hasAdditionalSearchFilters()
      );
      if (pickupError) {
        return pickupError;
      }
    }

    if (hasBookingRange) {
      const bookingError = this.validateDatePair(
        this.searchBookingDateFrom,
        this.searchBookingDateTo,
        'Booking date',
        !hasPickupRange && !this.hasFiltersBesidesBookingDates()
      );
      if (bookingError) {
        return bookingError;
      }
    }

    return null;
  }

  validatePickupDateRange(): string | null {
    return this.validateSearchDateRanges();
  }

  validateBookingDateRange(): string | null {
    return this.validateSearchDateRanges();
  }

  private validateDatePair(
    fromValue: any,
    toValue: any,
    label: string,
    enforceMaxRange: boolean
  ): string | null {
    const fromDate = moment(fromValue).startOf('day');
    const toDate = moment(toValue).startOf('day');
    if (!fromDate.isValid() || !toDate.isValid()) {
      return `Please enter valid ${label.toLower()}s.`;
    }
    if (toDate.isBefore(fromDate)) {
      return `${label} To cannot be earlier than From.`;
    }
    if (enforceMaxRange) {
      const inclusiveDays = toDate.diff(fromDate, 'days') + 1;
      if (inclusiveDays > this.maxPickupDateRangeDays) {
        return `${label} range cannot exceed ${this.maxPickupDateRangeDays} days when no other search filters are selected. Add another filter to search a wider range.`;
      }
    }
    return null;
  }

  hasFiltersBesidesBookingDates(): boolean {
    return (
      this.isSearchValueSet(this.modeOfPayment?.value) ||
      this.isSearchValueSet(this.serviceLocation?.value) ||
      this.isSearchValueSet(this.customer?.value) ||
      this.isSearchValueSet(this.searchDutySlip) ||
      this.isSearchValueSet(this.searchManualDS) ||
      this.isSearchValueSet(this.searchBooking) ||
      this.isSearchValueSet(this.city?.value) ||
      this.isSearchValueSet(this.searchCancellationFrom) ||
      this.isSearchValueSet(this.searchCancellationTo) ||
      this.isSearchValueSet(this.searchFromDate) ||
      this.isSearchValueSet(this.searchToDate) ||
      this.isSearchValueSet(this.salesPerson?.value) ||
      this.isSearchValueSet(this.searchDispatchStatus) ||
      this.isSearchValueSet(this.searchBookingStatus) ||
      this.isSearchValueSet(this.customerLocation?.value) ||
      this.isSearchValueSet(this.guestName?.value) ||
      this.isSearchValueSet(this.pickupDetail?.value) ||
      this.isSearchValueSet(this.pickupSubDetail?.value) ||
      this.isSearchValueSet(this.customerGroup?.value) ||
      this.isSearchValueSet(this.bookerName?.value)
    );
  }

  hasAdditionalSearchFilters(): boolean {
    return (
      this.isSearchValueSet(this.modeOfPayment?.value) ||
      this.isSearchValueSet(this.serviceLocation?.value) ||
      this.isSearchValueSet(this.customer?.value) ||
      this.isSearchValueSet(this.searchDutySlip) ||
      this.isSearchValueSet(this.searchManualDS) ||
      this.isSearchValueSet(this.searchBooking) ||
      this.isSearchValueSet(this.city?.value) ||
      this.isSearchValueSet(this.searchCancellationFrom) ||
      this.isSearchValueSet(this.searchCancellationTo) ||
      this.isSearchValueSet(this.searchBookingDateFrom) ||
      this.isSearchValueSet(this.searchBookingDateTo) ||
      this.isSearchValueSet(this.salesPerson?.value) ||
      this.isSearchValueSet(this.searchDispatchStatus) ||
      this.isSearchValueSet(this.searchBookingStatus) ||
      this.isSearchValueSet(this.customerLocation?.value) ||
      this.isSearchValueSet(this.guestName?.value) ||
      this.isSearchValueSet(this.pickupDetail?.value) ||
      this.isSearchValueSet(this.pickupSubDetail?.value) ||
      this.isSearchValueSet(this.customerGroup?.value) ||
      this.isSearchValueSet(this.bookerName?.value)
    );
  }

  private isSearchValueSet(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    const text = String(value).trim();
    return text !== '' && text.toLowerCase() !== 'null' && text.toLowerCase() !== 'all';
  }

  private startExportPolling(jobId: string) {
    this.stopExportPolling();
    this.exportPollSub = this.bookingMisService.pollExportJob(jobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, status);
        const current = String(status?.status ?? status?.Status ?? '').toLowerCase();

        if (current === 'failed') {
          this.exportJobRunning = false;
          this.exportJobError = status?.message ?? status?.Message ?? 'Export failed.';
          this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
          this.stopExportPolling();
          persistExportJobId(this.exportJobPageKey, null);
          return;
        }

        if (isExportJobCancelled(status)) {
          this.exportJobRunning = false;
          this.showNotification('snackbar-info', status?.message ?? status?.Message ?? 'Export cancelled.', 'bottom', 'center');
          this.stopExportPolling();
          persistExportJobId(this.exportJobPageKey, null);
          return;
        }

        if (current === 'completed') {
          this.exportJobRunning = false;
          const rows = status?.rowsExported ?? status?.RowsExported ?? 0;
          this.showNotification(
            'snackbar-success',
            status?.message ?? `Export ready (${rows} rows). Click Download CSV.`,
            'bottom',
            'center'
          );
          this.stopExportPolling();
          this.storedExports?.refresh();
        }
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error, 'Export failed.');
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
        this.stopExportPolling();
      }
    );
  }

  private stopExportPolling() {
    if (this.exportPollSub) {
      this.exportPollSub.unsubscribe();
      this.exportPollSub = undefined;
    }
  }

  private resumeExportJobIfNeeded() {
    const jobId = loadPersistedExportJobId(this.exportJobPageKey);
    if (!jobId) {
      return;
    }

    this.exportJobId = jobId;
    if (!this.exportJobStatus) {
      this.exportJobStatus = { status: 'Pending', message: 'Checking export status...' };
    }

    this.bookingMisService.getExportJobStatus(jobId).subscribe(
      (status: any) => {
        if (!status) {
          this.exportJobRunning = true;
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobId = jobId;
        this.exportJobStatus = status;
        this.exportJobError = '';
        if (this.bookingMisService.isExportJobRunning(status)) {
          this.exportJobRunning = true;
          this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, this.exportJobStatus);
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobRunning = false;
      },
      (error) => {
        if (isExportJobNotFoundError(error)) {
          persistExportJobId(this.exportJobPageKey, null);
          this.exportJobId = null;
          this.exportJobStatus = null;
          this.exportJobRunning = false;
          return;
        }

        this.exportJobRunning = true;
        this.startExportPolling(jobId);
      }
    );
  }

  private clearExportJob() {
    this.stopExportPolling();
    this.exportJobId = null;
    this.exportJobStatus = null;
    this.exportJobRunning = false;
    this.exportJobDownloading = false;
    this.exportJobError = '';
    this.exportJobStartedAt = null;
  }

  private triggerCsvDownload(blob: Blob, preferredFileName?: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timeStamp = moment().format('YYYYMMDD_HHmmss');
    link.href = url;
    link.download = preferredFileName || `BookingMIS_${timeStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    this.showNotification('snackbar-success', 'CSV downloaded', 'bottom', 'center');
  }

  private showNotification(colorName: string, text: string, verticalPosition: string, horizontalPosition: string) {
    this.snackBar.open(text, 'Close', {
      duration: 4000,
      verticalPosition,
      horizontalPosition,
      panelClass: colorName
    });
  }

  private InitPaymentMode() {
    this.generalService.GetModeOfPayment().subscribe((data) => {
      this.PaymentModeList = data || [];
      this.filteredPaymentModeOptions = this.modeOfPayment.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.PaymentModeList, value, 'modeOfPayment'))
      );
    });
  }

  private initCustomerGroup() {
    this.generalService.getCustomerGroup().subscribe((data) => {
      this.customerGroupList = data || [];
      this.filteredOptions = this.customerGroup.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.customerGroupList, value, 'customerGroup'))
      );
    });
  }

  private initCustomer() {
    this.generalService.getCustomers().subscribe((data) => {
      this.CustomerList = data || [];
      this.filteredCustomerOptions = this.customer.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.CustomerList, value, 'customerName'))
      );
    });
  }

  private initServiceLocation() {
    this.generalService.GetLocation().subscribe((data) => {
      this.ServiceList = data || [];
      this.filteredServiceOptions = this.serviceLocation.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.ServiceList, value, 'organizationalEntityName'))
      );
    });
  }

  private initCustomerLocation() {
    this.generalService.GetLocation().subscribe((data) => {
      this.CustomerLocationList = data || [];
      this.filteredCustomerLocationOptions = this.customerLocation.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.CustomerLocationList, value, 'organizationalEntityName'))
      );
    });
  }

  private initCity() {
    this.generalService.GetCitiessAll().subscribe((data) => {
      this.CityList = data || [];
      this.filteredCityOptions = this.city.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.CityList, value, 'geoPointName'))
      );
    });
  }

  private InitSalesPerson() {
    this.generalService.GetSalesPersonForBookingMIS().subscribe((data) => {
      this.SalesPersonList = data || [];
      this.filteredSalesPersonOptions = this.salesPerson.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.SalesPersonList, value, 'salesPerson'))
      );
    });
  }

  private InitBooker() {
    this.generalService.getCustomerPersonDetails().subscribe((data) => {
      this.BookerList = data || [];
      this.filteredBookerOptions = this.bookerName.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.BookerList, value, 'customerPersonName'))
      );
    });
  }

  private InitGuestDetails() {
    this.generalService.getCustomerPersonDetails().subscribe((data) => {
      this.CustomerPersonList = data || [];
      this.filteredCustomerPersonOptions = this.guestName.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.CustomerPersonList, value, 'customerPersonName'))
      );
    });
  }

  private InitPickupDetails() {
    this.generalService.GetGeoPointTypeForReservation().subscribe((data) => {
      this.GeoPointTypeList = data || [];
      this.filteredGeoPointTypeOptions = this.pickupDetail.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.GeoPointTypeList, value, 'geoPointType'))
      );
    });
  }

  getPSTID(geoPointTypeID: any) {
    this.geoPointTypeID = geoPointTypeID;
    this.InitPickupSubDetails();
  }

  private InitPickupSubDetails() {
    this.generalService.GetPickupSpotForReservation(this.geoPointTypeID).subscribe((data) => {
      this.PickupSpotList = data || [];
      this.filteredPickupSpotOptions = this.pickupSubDetail.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.PickupSpotList, value, 'geoPointName'))
      );
    });
  }

  private filterList(list: any[], value: string, field: string): any[] {
    const filterValue = String(value || '').toLowerCase();
    if (!list) {
      return [];
    }
    if (!filterValue) {
      return list.slice(0, 50);
    }
    return list.filter((item) => String(item[field] || '').toLowerCase().includes(filterValue)).slice(0, 50);
  }
}
