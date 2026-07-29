// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import { SearchCriteria } from './vendorMis.model';
import { VendorMisService } from './vendorMis.service';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { SupplierTypeDropDownModel } from '../supplierType/supplierType.model';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import { ModeOfPaymentDropDown } from '../modeOfPayment/modeOfPaymentDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { InventoryDropDown } from '../inventory/inventoryDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';

@Component({
  standalone: false,
  selector: 'app-vendor-mis',
  templateUrl: './vendorMis.component.html',
  styleUrls: ['./vendorMis.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VendorMisComponent implements OnInit, OnDestroy {
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  readonly maxPickupDateRangeDays = 15;
  IsKAMRole = false;

  SearchCustomerGroup: FormControl = new FormControl();
  SearchCustomer: FormControl = new FormControl();
  SearchDispatchLocation: FormControl = new FormControl();
  SearchMOP: FormControl = new FormControl();
  SearchSupplierType: FormControl = new FormControl();
  SearchSupplier: FormControl = new FormControl();
  SearchSupplierO: FormControl = new FormControl('');
  SearchDri: FormControl = new FormControl();
  SearchCarNo: FormControl = new FormControl();
  SearchCity: FormControl = new FormControl();
  SearchBookingStatus: FormControl = new FormControl('');
  SearchFromDate = '';
  SearchToDate = '';
  SearchBillDateFrom = '';
  SearchBillToDate = '';

  CustomerGroupList: CustomerGroupDropDown[] = [];
  CustomerList: CustomerDropDown[] = [];
  SupplierTypeList: SupplierTypeDropDownModel[] = [];
  SupplierList: SupplierDropDown[] = [];
  MOPList: ModeOfPaymentDropDown[] = [];
  CityList: CityDropDown[] = [];
  DriverList: DriverDropDown[] = [];
  CarNoList: InventoryDropDown[] = [];
  DispatchLocationList: OrganizationalEntityDropDown[] = [];

  filteredCustomerGroupOptions: Observable<CustomerGroupDropDown[]>;
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  filteredSupplierTypeOptions: Observable<SupplierTypeDropDownModel[]>;
  filteredSupplierOptions: Observable<SupplierDropDown[]>;
  filteredMOPOptions: Observable<ModeOfPaymentDropDown[]>;
  filteredCityOptions: Observable<CityDropDown[]>;
  filteredDriverOptions: Observable<DriverDropDown[]>;
  filteredCarNoOptions: Observable<InventoryDropDown[]>;
  filteredDispatchLocationOptions: Observable<OrganizationalEntityDropDown[]>;

  ownedSuppliedOptions = ['All', 'Owned', 'Supplied'];
  bookingStatusOptions = ['All', 'Confirmed', 'Cancelled', 'Completed'];

  constructor(
    private snackBar: MatSnackBar,
    public generalService: GeneralService,
    public vendorMisService: VendorMisService
  ) {
    this.IsKAMRole = localStorage.getItem('isThisAKeyAccountManagerRole') === 'true';
  }

  ngOnInit() {
    this.initCustomerGroup();
    this.initCustomer();
    this.initDispatchLocation();
    this.initMOP();
    this.initSupplierType();
    this.initSupplier();
    this.initCities();
    this.initDriver();
    this.initCarNo();
  }

  ngOnDestroy() {
    this.stopExportPolling();
  }

  refresh() {
    this.clearExportJob();
    this.SearchCustomerGroup.setValue('');
    this.SearchCustomer.setValue('');
    this.SearchDispatchLocation.setValue('');
    this.SearchMOP.setValue('');
    this.SearchSupplierType.setValue('');
    this.SearchSupplier.setValue('');
    this.SearchSupplierO.setValue('');
    this.SearchDri.setValue('');
    this.SearchCarNo.setValue('');
    this.SearchCity.setValue('');
    this.SearchBookingStatus.setValue('');
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.SearchBillDateFrom = '';
    this.SearchBillToDate = '';
  }

  buildSearchCriteria(): SearchCriteria {
    return {
      UserID: this.generalService.getUserID(),
      ShowAllLocation: this.generalService.getShowAllLocation(),
      SearchCustomerGroup: this.SearchCustomerGroup?.value || '',
      SearchCustomer: this.SearchCustomer?.value || '',
      SearchDispatchLocation: this.SearchDispatchLocation?.value || '',
      SearchMOP: this.SearchMOP?.value || '',
      SearchSupplierType: this.SearchSupplierType?.value || '',
      SearchSupplier: this.SearchSupplier?.value || '',
      SearchFromDate: this.SearchFromDate !== '' ? moment(this.SearchFromDate).format('MMM DD yyyy') : '',
      SearchToDate: this.SearchToDate !== '' ? moment(this.SearchToDate).format('MMM DD yyyy') : '',
      SearchSupplierO: this.normalizeSelect(this.SearchSupplierO?.value),
      SearchDri: this.SearchDri?.value || '',
      SearchCarNo: this.SearchCarNo?.value || '',
      SearchCity: this.SearchCity?.value || '',
      SearchBookingStatus: this.normalizeSelect(this.SearchBookingStatus?.value),
      SearchBillFromDate: this.SearchBillDateFrom !== '' ? moment(this.SearchBillDateFrom).format('MMM DD yyyy') : '',
      SearchBillToDate: this.SearchBillToDate !== '' ? moment(this.SearchBillToDate).format('MMM DD yyyy') : ''
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
    this.showNotification('snackbar-info', 'Export job started. CSV will be ready when processing completes.', 'bottom', 'center');

    this.vendorMisService.startExportJob(searchCriteria).subscribe(
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
        this.exportJobError = await this.extractExportErrorMessage(error);
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
      }
    );
  }

  downloadExportCsv() {
    if (!this.exportJobId || !this.vendorMisService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.vendorMisService.downloadExportJob(this.exportJobId).subscribe(
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
        const message = await this.extractExportErrorMessage(error);
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  canDownloadExport(): boolean {
    return !!this.exportJobId && this.vendorMisService.isExportJobReady(this.exportJobStatus) && !this.exportJobDownloading;
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.vendorMisService.isExportJobRunning(this.exportJobStatus);
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
    if (!this.SearchFromDate || !this.SearchToDate) {
      return 'Pickup date range is required. Please select From and To dates.';
    }

    const fromDate = moment(this.SearchFromDate).startOf('day');
    const toDate = moment(this.SearchToDate).startOf('day');
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
    return this.isSearchValueSet(this.SearchCustomerGroup?.value)
      || this.isSearchValueSet(this.SearchCustomer?.value)
      || this.isSearchValueSet(this.SearchDispatchLocation?.value)
      || this.isSearchValueSet(this.SearchMOP?.value)
      || this.isSearchValueSet(this.SearchSupplierType?.value)
      || this.isSearchValueSet(this.SearchSupplier?.value)
      || this.isSearchValueSet(this.SearchSupplierO?.value)
      || this.isSearchValueSet(this.SearchDri?.value)
      || this.isSearchValueSet(this.SearchCarNo?.value)
      || this.isSearchValueSet(this.SearchCity?.value)
      || this.isSearchValueSet(this.SearchBookingStatus?.value)
      || this.isSearchValueSet(this.SearchBillDateFrom)
      || this.isSearchValueSet(this.SearchBillToDate);
  }

  private isSearchValueSet(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    const text = String(value).trim();
    return text !== '' && text.toLowerCase() !== 'null' && text.toLowerCase() !== 'all';
  }

  private normalizeSelect(value: any): string {
    const text = String(value ?? '').trim();
    if (!text || text.toLowerCase() === 'all') {
      return '';
    }
    return text;
  }

  private startExportPolling(jobId: string) {
    this.stopExportPolling();
    this.exportPollSub = this.vendorMisService.pollExportJob(jobId).subscribe(
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
        this.exportJobError = await this.extractExportErrorMessage(error);
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

  private async extractExportErrorMessage(error: any): Promise<string> {
    if (!error) {
      return 'Error starting export';
    }

    const blob = error?.error;
    if (blob instanceof Blob) {
      const text = await blob.text();
      try {
        const parsed = JSON.parse(text || '{}');
        return parsed.message || parsed.Message || text || 'Error starting export';
      } catch {
        return text || 'Error starting export';
      }
    }

    if (typeof error?.error === 'string' && error.error.trim()) {
      return error.error.trim();
    }

    if (error?.error && typeof error.error === 'object') {
      return error.error.message || error.error.Message || 'Error starting export';
    }

    return error?.message || 'Error starting export';
  }

  private triggerCsvDownload(blob: Blob, preferredFileName?: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timeStamp = moment().format('YYYYMMDD_HHmmss');
    link.href = url;
    link.download = preferredFileName || `VendorMIS_${timeStamp}.csv`;
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

  private initCustomerGroup() {
    this.vendorMisService.GetCustomerGroupByKAMForDutyRegister(this.IsKAMRole).subscribe((data) => {
      this.CustomerGroupList = data || [];
      this.filteredCustomerGroupOptions = this.SearchCustomerGroup.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.CustomerGroupList, value, 'customerGroup'))
      );
    });
  }

  private initCustomer() {
    this.vendorMisService.GetCustomerByKAMForDutyRegister(this.IsKAMRole).subscribe((data) => {
      this.CustomerList = data || [];
      this.filteredCustomerOptions = this.SearchCustomer.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.CustomerList, value, 'customerName'))
      );
    });
  }

  private initDispatchLocation() {
    this.vendorMisService.GetLocationDropDownForDutyRegister(this.IsKAMRole).subscribe((data) => {
      this.DispatchLocationList = data || [];
      this.filteredDispatchLocationOptions = this.SearchDispatchLocation.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.DispatchLocationList, value, 'organizationalEntityName'))
      );
    });
  }

  private initMOP() {
    this.generalService.GetModeOfPayment().subscribe((data) => {
      this.MOPList = data || [];
      this.filteredMOPOptions = this.SearchMOP.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.MOPList, value, 'modeOfPayment'))
      );
    });
  }

  private initSupplierType() {
    this.generalService.GetSupplierType().subscribe((data) => {
      this.SupplierTypeList = data || [];
      this.filteredSupplierTypeOptions = this.SearchSupplierType.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.SupplierTypeList, value, 'supplierType'))
      );
    });
  }

  private initSupplier() {
    this.generalService.getSupplier().subscribe((data) => {
      this.SupplierList = data || [];
      this.filteredSupplierOptions = this.SearchSupplier.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.SupplierList, value, 'supplierName'))
      );
    });
  }

  private initCities() {
    this.generalService.GetCitiessAll().subscribe((data) => {
      this.CityList = data || [];
      this.filteredCityOptions = this.SearchCity.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.CityList, value, 'geoPointName'))
      );
    });
  }

  private initDriver() {
    this.generalService.GetDriver().subscribe((data) => {
      this.DriverList = data || [];
      this.filteredDriverOptions = this.SearchDri.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.DriverList, value, 'driverName'))
      );
    });
  }

  private initCarNo() {
    this.generalService.GetRegistrationNumber().subscribe((data) => {
      this.CarNoList = data || [];
      this.filteredCarNoOptions = this.SearchCarNo.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.CarNoList, value, 'registrationNumber'))
      );
    });
  }

  private filterList(list: any[], value: string, field: string): any[] {
    const filterValue = String(value || '').toLowerCase();
    if (!filterValue) {
      return list.slice(0, 50);
    }
    return list.filter((item) => String(item[field] || '').toLowerCase().includes(filterValue)).slice(0, 50);
  }
}
