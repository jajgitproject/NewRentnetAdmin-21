// @ts-nocheck
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, of, Subscription, switchMap } from 'rxjs';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { IncidenceMIS, IncidenceMISSearchCriteria } from './incidenceMIS.model';
import { IncidenceMISService } from './incidenceMIS.service';
import { extractExportErrorMessage, exportJobAcceptedSnackbarMessage, exportSearchButtonLabel, formatExportElapsedTime, IN_FLIGHT_EXPORT_MESSAGE, isExportJobCancelled, isExportJobNotFoundError, loadPersistedExportJobId, markExportDumpStarted, persistExportJobId } from '../general/export-job.helper';
import { StoredMisExportsComponent } from '../general/stored-mis-exports.component';

@Component({
  standalone: false,
  selector: 'app-incidenceMIS',
  templateUrl: './incidenceMIS.component.html',
  styleUrls: ['./incidenceMIS.component.sass']
})
export class IncidenceMISComponent implements OnInit, OnDestroy {
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  private readonly exportJobPageKey = 'incidenceMIS';
  @ViewChild(StoredMisExportsComponent) storedExports?: StoredMisExportsComponent;
  displayedColumns = [
    'incidenceID',
    'dispatchLocation',
    'reservationID',
    'dutySlipID',
    'pickupDate',
    'incidenceDate',
    'customer',
    'passengerName',
    'vehicle',
    'registrationNumber',
    'driverOfficialIdentityNumber',
    'department',
    'reportSource',
    'issueRelatedTo',
    'issueCategory',
    'incidenceDetails',
    'actionTaken',
    'openDate',
    'openTime',
    'closureDate',
    'closureTime',
    'closedByEmployeeName',
    // 'salesManager',
    'vip',
    'rootCauseAnalysis',
    'openedByEmployeeName',
    'customerGroup',
    //'customerSalesManager',
    'incidenceType',
    'supplier',
    'supplierType',
    'responsible1',
    'responsible1Driver',
    'responsible1Vendor',
    'responsible1Employee',
    'responsible1CustomerPerson',
    'responsible2',
    'responsible2Driver',
    'responsible2Vendor',
    'responsible2Employee',
    'responsible2CustomerPerson',
    'responsible3',
    'responsible3Driver',
    'responsible3Vendor',
    'responsible3Employee',
    'responsible3CustomerPerson',
    'responsible4',
    'responsible4Driver',
    'responsible4Vendor',
    'responsible4Employee',
    'responsible4CustomerPerson',
    'incidenceEmailAcknowledged',
    'feedbackEmailAcknowledged',
    'debitType',
    'debitAmount'
  ];

  columnTitleMap = {
    incidenceID: 'Incidence ID',
    dispatchLocation: 'Dispatch Location',
    reservationID: 'Reservation No.',
    dutySlipID: 'Duty Slip No.',
    pickupDate: 'Duty Date',
    incidenceDate: 'Incidence Date',
    customer: 'Customer',
    passengerName: 'Guest Name',
    registrationNumber: 'Registration No.',
    driverOfficialIdentityNumber: 'Driver ID',
    reportSource: 'Report Source',
    issueRelatedTo: 'Issue Related To',
    issueCategory: 'Issue Category',
    incidenceDetails: 'Incidence Details',
    actionTaken: 'Action Taken',
    openDate: 'Open Date',
    openTime: 'Open Time',
    closureDate: 'Closure Date',
    closureTime: 'Closure Time',
    closedByEmployeeName: 'Closed By Employee',
    // salesManager: 'Sales Manager',
    openedByEmployeeName: 'Opened By Employee',
    customerGroup: 'Customer Group',
    // customerSalesManager: 'Customer Sales Manager',
    incidenceType: 'Incidence Type',
    incidenceEmailAcknowledged: 'Incidence Email Acknowledged',
    feedbackEmailAcknowledged: 'Feedback Email Acknowledged',
    debitType: 'Debit Type',
    debitAmount: 'Debit Amount'
  };

  dataSource: IncidenceMIS[] = [];
  PageNumber = 0;
  hasManualSearch = false;

  searchCustomerGroup = new FormControl('');
  searchCustomer = new FormControl('');
  searchSalesPerson = new FormControl('');
  searchPassengerName = new FormControl('');
  searchRegistrationNumber = new FormControl('');
  searchDriver = new FormControl('');

  searchVehicleCategoryID = 0;
  searchVehicleID = 0;
  searchDispatchLocationID = 0;
  searchIncidenceTypeID = 0;
  searchIncidenceFromDate: any = '';
  searchIncidenceToDate: any = '';

  customerGroupOptions: any[] = [];
  customerOptions: any[] = [];
  salesPersonOptions: any[] = [];
  passengerOptions: any[] = [];
  registrationOptions: any[] = [];
  driverOptions: any[] = [];

  vehicleCategories: any[] = [];
  vehicles: any[] = [];
  dispatchLocations: any[] = [];
  incidenceTypes: any[] = [];
  salesManagerMasterList: any[] = [];

  constructor(
    private incidenceMISService: IncidenceMISService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
    this.setupAutocomplete(this.searchCustomerGroup, (prefix) => this.generalService.GetCustomerGroupDropDownForControlPanel(prefix), (list) => (this.customerGroupOptions = list || []));
    this.setupAutocomplete(this.searchCustomer, (prefix) => this.generalService.GetCustomerDropDownForControlPanel(prefix), (list) => (this.customerOptions = list || []));
    this.setupSalesPersonAutocomplete();
    this.setupAutocomplete(this.searchPassengerName, (prefix) => this.generalService.GetPassengerDropDownForControlPanel(prefix), (list) => (this.passengerOptions = list || []));
    this.setupAutocomplete(this.searchRegistrationNumber, (prefix) => this.generalService.GetRegNoDropDownForControlPanel(prefix), (list) => (this.registrationOptions = list || []));
    this.setupDriverAutocomplete();
    this.resumeExportJobIfNeeded();
  }

  ngOnDestroy() {
    this.stopExportPolling();
  }

  private setupAutocomplete(control: FormControl, fetchFn: (prefix: string) => any, assignFn: (list: any[]) => void): void {
    control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const term = (value || '').toString().trim();
        if (term.length < 3) {
          assignFn([]);
          return of([]);
        }
        return fetchFn(term);
      })
    ).subscribe((list) => assignFn(list || []));
  }

  private setupSalesPersonAutocomplete(): void {
    this.searchSalesPerson.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      const term = (value || '').toString().trim().toLowerCase();
      if (term.length < 3) {
        this.salesPersonOptions = [];
        return;
      }
      this.salesPersonOptions = (this.salesManagerMasterList || []).filter((item) =>
        (item.customerSalesManager || '').toLowerCase().includes(term)
      );
    });
  }

  private setupDriverAutocomplete(): void {
    this.searchDriver.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const term = (value || '').toString().trim();
        if (term.length < 3) {
          this.driverOptions = [];
          return of([]);
        }
        return this.incidenceMISService.getDriverByPrefix(term);
      })
    ).subscribe((list) => (this.driverOptions = list || []));
  }

  private loadDropdowns(): void {
    this.generalService.GetVehicleCategories().subscribe((data) => (this.vehicleCategories = data || []));
    this.generalService.GetVehicle().subscribe((data) => (this.vehicles = data || []));
    this.generalService.GetOrganizationalEntity().subscribe((data) => (this.dispatchLocations = data || []));
    this.generalService.GetIncidenceTypes().subscribe((data) => (this.incidenceTypes = data || []));
    this.incidenceMISService.getCustomerSalesManagerDropDown().subscribe((data) => (this.salesManagerMasterList = data || []));
  }

  displayCustomerGroup(option: any): string {
    return option && typeof option === 'object' ? option.customerGroup : option || '';
  }

  displayCustomer(option: any): string {
    return option && typeof option === 'object' ? option.customerName : option || '';
  }

  displaySalesPerson(option: any): string {
    return option && typeof option === 'object' ? option.customerSalesManager : option || '';
  }

  displayPassenger(option: any): string {
    return option && typeof option === 'object' ? option.customerPersonName : option || '';
  }

  displayRegistration(option: any): string {
    return option && typeof option === 'object' ? option.registrationNumber : option || '';
  }

  displayDriver(option: any): string {
    return option && typeof option === 'object' ? option.driverName : option || '';
  }

  getCellDisplayValue(row: any, column: string): string {
    const value = row?.[column];
    if (value === null || value === undefined || value === '') {
      return '';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  }

  SearchData(): void {
    this.PageNumber = 0;
    this.hasManualSearch = true;
    this.loadData();
  }

  refresh(): void {
    this.clearExportJob();
    this.searchCustomerGroup.setValue('');
    this.searchCustomer.setValue('');
    this.searchSalesPerson.setValue('');
    this.searchPassengerName.setValue('');
    this.searchRegistrationNumber.setValue('');
    this.searchDriver.setValue('');
    this.searchVehicleCategoryID = 0;
    this.searchVehicleID = 0;
    this.searchDispatchLocationID = 0;
    this.searchIncidenceTypeID = 0;
    this.searchIncidenceFromDate = '';
    this.searchIncidenceToDate = '';
    this.PageNumber = 0;
    this.hasManualSearch = false;
    this.dataSource = [];
  }

  loadData(): void {
    const criteria = this.buildSearchCriteria();
    this.incidenceMISService.getTableData(criteria, this.PageNumber).subscribe(
      (data) => {
        this.dataSource = Array.isArray(data) ? data : [];
      },
      (error: HttpErrorResponse) => {
        this.dataSource = [];
        this.showNotification('snackbar-danger', error?.message || 'Incidence MIS search failed', 'bottom', 'center');
      }
    );
  }

  NextCall(): void {
    if (this.dataSource?.length > 0) {
      this.PageNumber++;
      this.loadData();
    }
  }

  PreviousCall(): void {
    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  startExportJob(): void {
    if (this.exportJobRunning) {
      this.showNotification('snackbar-danger', IN_FLIGHT_EXPORT_MESSAGE, 'bottom', 'center');
      return;
    }

    if (!this.hasManualSearch) {
      this.showNotification('snackbar-danger', 'Run search first', 'bottom', 'center');
      return;
    }

    this.exportJobError = '';
    const criteria = this.buildSearchCriteria();
    this.exportJobRunning = true;

    this.incidenceMISService.startExportJob(criteria).subscribe(
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
        this.showNotification('snackbar-info', exportJobAcceptedSnackbarMessage(startResult), 'bottom', 'center');
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error, 'Could not start export');
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
      }
    );
  }

  downloadExportCsv(): void {
    if (!this.exportJobId || !this.incidenceMISService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.incidenceMISService.downloadExportJob(this.exportJobId).subscribe(
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

  cancelExportJob(): void {
    if (!this.exportJobId || !this.isExportJobInProgress()) {
      return;
    }

    this.incidenceMISService.cancelExportJob(this.exportJobId).subscribe(
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
      this.incidenceMISService.isExportJobReady(this.exportJobStatus) &&
      !this.exportJobDownloading
    );
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.incidenceMISService.isExportJobRunning(this.exportJobStatus);
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

  getExportButtonLabel(): string {
    const label = exportSearchButtonLabel(this.exportJobStatus, this.isExportJobInProgress());
    return label === 'Search' ? 'Export CSV' : label;
  }

  private startExportPolling(jobId: string): void {
    this.stopExportPolling();
    this.exportPollSub = this.incidenceMISService.pollExportJob(jobId).subscribe(
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

  private stopExportPolling(): void {
    if (this.exportPollSub) {
      this.exportPollSub.unsubscribe();
      this.exportPollSub = undefined;
    }
  }

  private resumeExportJobIfNeeded(): void {
    const jobId = loadPersistedExportJobId(this.exportJobPageKey);
    if (!jobId) {
      return;
    }

    this.exportJobId = jobId;
    if (!this.exportJobStatus) {
      this.exportJobStatus = { status: 'Pending', message: 'Checking export status...' };
    }

    this.incidenceMISService.getExportJobStatus(jobId).subscribe(
      (status: any) => {
        if (!status) {
          this.exportJobRunning = true;
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobId = jobId;
        this.exportJobStatus = status;
        this.exportJobError = '';
        if (this.incidenceMISService.isExportJobRunning(status)) {
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

  private clearExportJob(): void {
    this.stopExportPolling();
    this.exportJobId = null;
    this.exportJobStatus = null;
    this.exportJobRunning = false;
    this.exportJobDownloading = false;
    this.exportJobError = '';
    this.exportJobStartedAt = null;
  }

  private triggerCsvDownload(blob: Blob, preferredFileName?: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timeStamp = moment().format('YYYYMMDD_HHmmss');
    link.href = url;
    link.download = preferredFileName || `IncidenceMIS_${timeStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    this.showNotification('snackbar-success', 'CSV downloaded', 'bottom', 'center');
  }

  private buildSearchCriteria(): IncidenceMISSearchCriteria {
    return {
      searchCustomerGroup: this.extractText(this.searchCustomerGroup.value, 'customerGroup'),
      searchCustomer: this.extractText(this.searchCustomer.value, 'customerName'),
      searchSalesPerson: this.extractText(this.searchSalesPerson.value, 'customerSalesManager'),
      searchPassengerName: this.extractText(this.searchPassengerName.value, 'customerPersonName'),
      searchVehicleCategoryID: this.searchVehicleCategoryID || 0,
      searchVehicleID: this.searchVehicleID || 0,
      searchRegistrationNumber: this.extractText(this.searchRegistrationNumber.value, 'registrationNumber'),
      searchDriver: this.extractText(this.searchDriver.value, 'driverName'),
      searchDispatchLocationID: this.searchDispatchLocationID || 0,
      searchIncidenceFromDate: this.searchIncidenceFromDate ? moment(this.searchIncidenceFromDate).format('MMM DD yyyy') : '',
      searchIncidenceToDate: this.searchIncidenceToDate ? moment(this.searchIncidenceToDate).format('MMM DD yyyy') : '',
      searchIncidenceTypeID: this.searchIncidenceTypeID || 0
    };
  }

  private extractText(value: any, objectKey: string): string {
    if (!value) {
      return '';
    }
    if (typeof value === 'object') {
      return value[objectKey] || '';
    }
    return value.toString().trim();
  }

  private showNotification(colorName: string, text: string, placementFrom: any, placementAlign: any): void {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
