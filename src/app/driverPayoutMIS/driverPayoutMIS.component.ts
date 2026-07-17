// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { SearchCriteria } from './driverPayoutMIS.model';
import { DriverPayoutMISService } from './driverPayoutMIS.service';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { SupplierTypeDropDownModel } from '../supplierType/supplierType.model';
import { CityDropDown } from '../city/cityDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';

@Component({
  standalone: false,
  selector: 'app-driver-payout-mis',
  templateUrl: './driverPayoutMIS.component.html',
  styleUrls: ['./driverPayoutMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverPayoutMISComponent implements OnInit {
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  readonly maxPickupDateRangeDays = 31;
  IsKAMRole = false;

  SearchCustomer: FormControl = new FormControl();
  SearchDri: FormControl = new FormControl();
  SearchDriverType: FormControl = new FormControl();
  SearchSupplierType: FormControl = new FormControl();
  SearchCity: FormControl = new FormControl();
  SearchDispatchLocation: FormControl = new FormControl();
  SearchFromDate = '';
  SearchToDate = '';

  driverTypeOptions = ['Internal', 'External'];

  CustomerList: CustomerDropDown[] = [];
  DriverList: DriverDropDown[] = [];
  SupplierTypeList: SupplierTypeDropDownModel[] = [];
  CityList: CityDropDown[] = [];
  DispatchLocationList: OrganizationalEntityDropDown[] = [];

  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  filteredDriverOptions: Observable<DriverDropDown[]>;
  filteredSupplierTypeOptions: Observable<SupplierTypeDropDownModel[]>;
  filteredCityOptions: Observable<CityDropDown[]>;
  filteredDispatchLocationOptions: Observable<OrganizationalEntityDropDown[]>;

  constructor(
    private snackBar: MatSnackBar,
    public generalService: GeneralService,
    public driverPayoutMISService: DriverPayoutMISService
  ) {
    this.IsKAMRole = localStorage.getItem('isThisAKeyAccountManagerRole') === 'true';
  }

  ngOnInit() {
    this.InitCustomer();
    this.InitDriver();
    this.InitSupplierType();
    this.InitCities();
    this.InitDispatchLocation();
  }

  refresh() {
    this.clearExportJob();
    this.SearchCustomer.setValue('');
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.SearchDri.setValue('');
    this.SearchDriverType.setValue('');
    this.SearchSupplierType.setValue('');
    this.SearchCity.setValue('');
    this.SearchDispatchLocation.setValue('');
  }

  buildSearchCriteria(): SearchCriteria {
    return {
      UserID: this.generalService.getUserID(),
      SearchCustomer: this.SearchCustomer?.value || '',
      SearchFromDate: this.SearchFromDate !== '' ? moment(this.SearchFromDate).format('MMM DD yyyy') : '',
      SearchToDate: this.SearchToDate !== '' ? moment(this.SearchToDate).format('MMM DD yyyy') : '',
      SearchDri: this.SearchDri?.value || '',
      SearchDriverType: this.SearchDriverType?.value || '',
      SearchSupplierType: this.SearchSupplierType?.value || '',
      SearchCity: this.SearchCity?.value || '',
      SearchDispatchLocation: this.SearchDispatchLocation?.value || ''
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

    this.driverPayoutMISService.startExportJob(searchCriteria).subscribe(
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
    if (!this.exportJobId || !this.driverPayoutMISService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.driverPayoutMISService.downloadExportJob(this.exportJobId).subscribe(
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
        this.driverPayoutMISService.getExportJobStatus(this.exportJobId).subscribe(
          (status) => {
            this.exportJobStatus = status;
          },
          () => {}
        );
      },
      async (error) => {
        this.exportJobDownloading = false;
        const message = await this.extractExportErrorMessage(error);
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  canDownloadExport(): boolean {
    return !!this.exportJobId && this.driverPayoutMISService.isExportJobReady(this.exportJobStatus) && !this.exportJobDownloading;
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.driverPayoutMISService.isExportJobRunning(this.exportJobStatus);
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

  private startExportPolling(jobId: string) {
    this.stopExportPolling();
    this.exportPollSub = this.driverPayoutMISService.pollExportJob(jobId).subscribe(
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

    if (typeof error === 'string' && error.trim()) {
      return error.trim();
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

  private hasAdditionalSearchFilters(): boolean {
    return !!(
      (this.SearchCustomer?.value && String(this.SearchCustomer.value).trim()) ||
      (this.SearchDri?.value && String(this.SearchDri.value).trim()) ||
      (this.SearchDriverType?.value && String(this.SearchDriverType.value).trim()) ||
      (this.SearchSupplierType?.value && String(this.SearchSupplierType.value).trim()) ||
      (this.SearchCity?.value && String(this.SearchCity.value).trim()) ||
      (this.SearchDispatchLocation?.value && String(this.SearchDispatchLocation.value).trim())
    );
  }

  private triggerCsvDownload(blob: Blob, preferredFileName?: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timeStamp = moment().format('YYYYMMDD_HHmmss');
    link.href = url;
    link.download = preferredFileName || `DriverPayoutMIS_${timeStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    this.showNotification('snackbar-success', 'CSV downloaded', 'bottom', 'center');
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  InitCustomer() {
    this.driverPayoutMISService.GetCustomerByKAMForDutyRegister(this.IsKAMRole).subscribe((data) => {
      this.CustomerList = data || [];
      this.filteredCustomerOptions = this.SearchCustomer.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterCustomer(value || ''))
      );
    });
  }

  filterCustomer(value: string) {
    const filterValue = value.toLowerCase();
    if (!value) {
      return [];
    }
    return this.CustomerList.filter((item) => item.customerName?.toLowerCase().indexOf(filterValue) === 0);
  }

  InitDriver() {
    this.generalService.GetDriver().subscribe((data) => {
      this.DriverList = data || [];
      this.filteredDriverOptions = this.SearchDri.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterDriver(value || ''))
      );
    });
  }

  filterDriver(value: string) {
    const filterValue = value.toLowerCase();
    if (!value) {
      return [];
    }
    return this.DriverList.filter((item) => item.driverName?.toLowerCase().indexOf(filterValue) === 0);
  }

  InitSupplierType() {
    this.generalService.GetSupplierType().subscribe((data) => {
      this.SupplierTypeList = data || [];
      this.filteredSupplierTypeOptions = this.SearchSupplierType.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterSupplierType(value || ''))
      );
    });
  }

  filterSupplierType(value: string) {
    const filterValue = value.toLowerCase();
    return this.SupplierTypeList.filter((item) => item.supplierType?.toLowerCase().indexOf(filterValue) === 0);
  }

  InitCities() {
    this.generalService.GetCitiessAll().subscribe((data) => {
      this.CityList = data || [];
      this.filteredCityOptions = this.SearchCity.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterCity(value || ''))
      );
    });
  }

  filterCity(value: string) {
    const filterValue = value.toLowerCase();
    if (!value) {
      return [];
    }
    return this.CityList.filter((item) => item.geoPointName?.toLowerCase().indexOf(filterValue) === 0);
  }

  InitDispatchLocation() {
    this.driverPayoutMISService.GetLocationDropDownForDutyRegister(this.IsKAMRole).subscribe((data) => {
      this.DispatchLocationList = data || [];
      this.filteredDispatchLocationOptions = this.SearchDispatchLocation.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterDispatchLocation(value || ''))
      );
    });
  }

  filterDispatchLocation(value: string) {
    const filterValue = value.toLowerCase();
    if (!value) {
      return [];
    }
    return this.DispatchLocationList.filter((item) => item.organizationalEntityName?.toLowerCase().indexOf(filterValue) === 0);
  }
}
