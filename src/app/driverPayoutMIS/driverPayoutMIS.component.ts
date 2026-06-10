// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { DriverPayoutMISModel, SearchCriteria } from './driverPayoutMIS.model';
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
  displayedColumns = [
    'reservationNo',
    'dutySlipNo',
    'customer',
    'guestName',
    'carNo',
    'carBooked',
    'carSent',
    'driverOfficialID',
    'driverName',
    'driverMobile',
    'city',
    'package',
    'locationOutDate',
    'locationOutTime',
    'locationOutKM',
    'locationInDate',
    'locationInTime',
    'locationInKM',
    'totalKM',
    'totalHRS',
    'invoiceNo',
    'chargeableExpense',
    'nonChargeableExpense',
    'status',
    'dispatchLocation',
    'supplierOfficialIdentityNumber',
    'supplierName',
    'supplierType',
    'ownedOrSupplied',
    'closingType',
    'physicalDutySlipReceived'
  ];

  columnTitleMap = {
    reservationNo: 'Reservation No.',
    dutySlipNo: 'Duty Slip No.',
    customer: 'Customer',
    guestName: 'Guest Name',
    carNo: 'Car No.',
    carBooked: 'Car booked',
    carSent: 'Car Sent',
    driverOfficialID: 'Driver Official ID',
    driverName: 'Driver Name',
    driverMobile: 'Driver Mobile',
    city: 'City',
    package: 'Package',
    locationOutDate: 'Location Out Date',
    locationOutTime: 'Location Out Time',
    locationOutKM: 'Location Out KM',
    locationInDate: 'Location In Date',
    locationInTime: 'LocationIn Time',
    locationInKM: 'Location In KM',
    totalKM: 'Total KM',
    totalHRS: 'Total HRS',
    invoiceNo: 'Invoice No.',
    chargeableExpense: 'Chargeable Expense',
    nonChargeableExpense: 'Non Chargeable Expense',
    status: 'Status',
    dispatchLocation: 'Dispatch Location',
    supplierOfficialIdentityNumber: 'Supplier Official ID',
    supplierName: 'Supplier Name',
    supplierType: 'Supplier Type',
    ownedOrSupplied: 'Owned or Supplied',
    closingType: 'Closing Type',
    physicalDutySlipReceived: 'Physical Duty Slip Received'
  };

  dataSource: DriverPayoutMISModel[] | null = null;
  PageNumber = 0;
  sortingData = 1;
  sortType = '';
  csvExporting = false;
  hasManualSearch = false;
  IsKAMRole = false;
  columnWidths: Record<string, number> = {};

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
    this.SearchCustomer.setValue('');
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.SearchDri.setValue('');
    this.SearchDriverType.setValue('');
    this.SearchSupplierType.setValue('');
    this.SearchCity.setValue('');
    this.SearchDispatchLocation.setValue('');
    this.PageNumber = 0;
    this.dataSource = null;
    this.hasManualSearch = false;
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

  loadData() {
    const searchCriteria = this.buildSearchCriteria();
    this.driverPayoutMISService.getTableData(searchCriteria, this.PageNumber).subscribe(
      (data) => {
        this.applyTableData(Array.isArray(data) ? data : []);
      },
      (error: HttpErrorResponse) => {
        this.applyTableData([]);
        this.showNotification('snackbar-danger', error?.message || 'Driver Payout MIS search failed', 'bottom', 'center');
      }
    );
  }

  getColumnWidth(column: string): string {
    const width = this.columnWidths[column];
    return width ? `${width}px` : 'auto';
  }

  getCellDisplayValue(row: DriverPayoutMISModel, column: string): string {
    const value = row?.[column];
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return String(value);
  }

  private applyTableData(rows: DriverPayoutMISModel[]) {
    this.dataSource = rows;
    this.updateColumnWidths(rows);
  }

  private updateColumnWidths(rows: DriverPayoutMISModel[]) {
    const padding = 24;
    const minWidth = 56;
    const maxWidth = 360;
    const charPx = 7.2;
    const widths: Record<string, number> = {};

    for (const column of this.displayedColumns) {
      const header = this.columnTitleMap[column] || column;
      let maxLen = header.length;

      for (const row of rows) {
        maxLen = Math.max(maxLen, this.getCellDisplayValue(row, column).length);
      }

      widths[column] = Math.min(maxWidth, Math.max(minWidth, Math.ceil(maxLen * charPx + padding)));
    }

    this.columnWidths = widths;
  }

  SearchData() {
    this.hasManualSearch = true;
    this.PageNumber = 0;
    this.loadData();
  }

  NextCall() {
    if (this.dataSource?.length > 0) {
      this.PageNumber++;
      this.loadData();
    }
  }

  PreviousCall() {
    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  SortingData(column: any) {
    if (this.sortingData === 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }

    const searchCriteria = this.buildSearchCriteria();
    this.driverPayoutMISService.getTableDataSort(searchCriteria, this.PageNumber, column.active, this.sortType).subscribe(
      (data) => {
        this.applyTableData(Array.isArray(data) ? data : []);
      },
      (error: HttpErrorResponse) => {
        this.applyTableData([]);
        this.showNotification('snackbar-danger', error?.message || 'Driver Payout MIS search failed', 'bottom', 'center');
      }
    );
  }

  downloadFilteredCsv() {
    if (this.csvExporting || !this.hasManualSearch) {
      return;
    }

    this.csvExporting = true;
    const searchCriteria = this.buildSearchCriteria();
    this.driverPayoutMISService.exportCsv(searchCriteria).subscribe(
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

  private triggerCsvDownload(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timeStamp = moment().format('YYYYMMDD_HHmmss');
    link.href = url;
    link.download = `DriverPayoutMIS_${timeStamp}.csv`;
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
