// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { IncidenceMIS, IncidenceMISSearchCriteria } from './incidenceMIS.model';
import { IncidenceMISService } from './incidenceMIS.service';

@Component({
  standalone: false,
  selector: 'app-incidenceMIS',
  templateUrl: './incidenceMIS.component.html',
  styleUrls: ['./incidenceMIS.component.sass']
})
export class IncidenceMISComponent implements OnInit {
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
    'salesManager',
    'vip',
    'rootCauseAnalysis',
    'openedByEmployeeName',
    'customerGroup',
    'customerSalesManager',
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
    salesManager: 'Sales Manager',
    openedByEmployeeName: 'Opened By Employee',
    customerGroup: 'Customer Group',
    customerSalesManager: 'Customer Sales Manager',
    incidenceType: 'Incidence Type',
    incidenceEmailAcknowledged: 'Incidence Email Acknowledged',
    feedbackEmailAcknowledged: 'Feedback Email Acknowledged',
    debitType: 'Debit Type',
    debitAmount: 'Debit Amount'
  };

  dataSource: IncidenceMIS[] = [];
  PageNumber = 0;
  hasManualSearch = false;
  csvExporting = false;

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

  downloadFilteredCsv(): void {
    if (this.csvExporting || !this.hasManualSearch) {
      return;
    }

    this.csvExporting = true;
    const criteria = this.buildSearchCriteria();
    this.incidenceMISService.exportCsv(criteria).subscribe(
      (blob: Blob) => {
        this.csvExporting = false;
        if (!blob || blob.size === 0) {
          this.showNotification('snackbar-danger', 'No data to export', 'bottom', 'center');
          return;
        }

        const contentType = (blob.type || '').toLowerCase();
        if (contentType.includes('application/json')) {
          blob.text().then((text) => {
            if ((text || '').trim() === 'null') {
              this.showNotification('snackbar-danger', 'No data to export', 'bottom', 'center');
              return;
            }
            const csvBlob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
            this.triggerCsvDownload(csvBlob);
          });
          return;
        }

        this.triggerCsvDownload(blob);
      },
      () => {
        this.csvExporting = false;
        this.showNotification('snackbar-danger', 'Error downloading CSV', 'bottom', 'center');
      }
    );
  }

  private triggerCsvDownload(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timeStamp = moment().format('YYYYMMDD_HHmmss');
    link.href = url;
    link.download = `IncidenceMIS_${timeStamp}.csv`;
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
