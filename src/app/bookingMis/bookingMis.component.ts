// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import { SearchCriteria } from './bookingMis.model';
import { BookingMisService } from './bookingMis.service';
import { extractExportErrorMessage } from '../general/export-job.helper';
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
      return;
    }

    const dateRangeError = this.validatePickupDateRange();
    if (dateRangeError) {
      this.showNotification('snackbar-danger', dateRangeError, 'bottom', 'center');
      return;
    }

    this.exportJobError = '';
    this.exportJobStartedAt = Date.now();
    const searchCriteria = this.buildSearchCriteria();

    this.exportJobRunning = true;
    this.showNotification(
      'snackbar-info',
      'Export job started. CSV will be ready when processing completes.',
      'bottom',
      'center'
    );

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
        this.exportJobStatus = {
          jobId,
          status: startResult?.status ?? startResult?.Status ?? 'Pending',
          message: startResult?.message ?? startResult?.Message ?? 'Export queued'
        };
        this.startExportPolling(jobId);
      },
      async (error) => {
        this.exportJobRunning = false;
        const status = error?.status;
        const fallback =
          status === 404
            ? 'Booking MIS export API was not found. Restart/redeploy the API with bookingMIS endpoints.'
            : status === 0
              ? 'Could not reach the API. Check that the backend is running.'
              : 'Error starting export';
        this.exportJobError = await extractExportErrorMessage(error, fallback);
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
    if (!this.exportJobStartedAt) {
      return '—';
    }
    const elapsedSeconds = Math.floor((Date.now() - this.exportJobStartedAt) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  validatePickupDateRange(): string | null {
    if (!this.searchFromDate || !this.searchToDate) {
      return 'Pickup date range is required. Please select From and To dates.';
    }

    const fromDate = moment(this.searchFromDate).startOf('day');
    const toDate = moment(this.searchToDate).startOf('day');
    if (!fromDate.isValid() || !toDate.isValid()) {
      return 'Please enter valid pickup dates.';
    }
    if (toDate.isBefore(fromDate)) {
      return 'Pickup To Date cannot be earlier than From Date.';
    }
    if (!this.hasAdditionalSearchFilters()) {
      const inclusiveDays = toDate.diff(fromDate, 'days') + 1;
      if (inclusiveDays > this.maxPickupDateRangeDays) {
        return `Pickup date range cannot exceed ${this.maxPickupDateRangeDays} days when no other search filters are selected. Add another filter to search a wider range.`;
      }
    }

    return null;
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
        const current = String(status?.status ?? status?.Status ?? '').toLowerCase();

        if (current === 'failed') {
          this.exportJobRunning = false;
          this.exportJobError = status?.message ?? status?.Message ?? 'Export failed.';
          this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
          this.stopExportPolling();
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
