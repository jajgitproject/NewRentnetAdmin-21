// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { FormControl } from '@angular/forms';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { Router } from '@angular/router';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { PackageDropDown } from '../general/packageDropDown.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { ChangeModeOfPaymentService } from './changeModeOfPayment.service';
import { ChangeModeOfPaymentFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { ChangeModeOfPaymentDutyModel } from './changeModeOfPayment.model';
import { ChangeModeOfPaymentDetailsComponent } from './dialogs/changeModeOfPaymentDetails/changeModeOfPaymentDetails.component';
import { ModeOfPaymentDropDown } from '../supplierContract/modeOfPaymentDropDown.model';
import moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-changeModeOfPayment',
  templateUrl: './changeModeOfPayment.component.html',
  styleUrls: ['./changeModeOfPayment.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ChangeModeOfPaymentComponent implements OnInit {
  displayedColumns = [
    'check',
    'actions',
    'ReservationID',
    'DutySlipID',
    'ModeOfPayment',
    'CustomerName',
    'CustomerGroup',
    'PrimaryPassenger',
    'PackageType',
    'Package',
    'PickupCity',
    'VehicleCategory',
    'Vehicle',
    'PickupDate',
    'PickupTime',
    'PrimaryBooker',
    'PickupAddress'
  ];

  dataSource?: ChangeModeOfPaymentDutyModel[] | null | undefined;
  PageNumber: number = 0;
  sortingData?: number;
  sortType?: string;
  dialogRef?: MatDialogRef<any>;

  searchActivationStatus: boolean = true;
  searchTerm: any = '';
  selectedFilter: string = 'search';

  searchCustomerGroup: string = '';
  customerGroupID: any;
  public customerGroupList?: CustomerGroupDropDown[] = [];
  filteredOptions?: Observable<CustomerGroupDropDown[]>;
  customerGroup: FormControl = new FormControl();

  searchCustomerName: string = '';
  public CustomerList?: CustomerDropDown[] = [];
  filteredCustomerOptions?: Observable<CustomerDropDown[]>;
  customer: FormControl = new FormControl();

  SearchFromDate: string = '';
  SearchToDate: string = '';

  SearchCity: string = '';
  public CityList?: CitiesDropDown[] = [];
  filteredCityOptions?: Observable<CitiesDropDown[]>;
  city: FormControl = new FormControl();

  SearchVehicle: string = '';
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions?: Observable<VehicleDropDown[]>;
  vehicle: FormControl = new FormControl();

  SearchPackageType: string = '';
  public PackageTypeList?: PackageTypeDropDown[] = [];
  filteredPackageTypeOptions?: Observable<PackageTypeDropDown[]>;
  packageType: FormControl = new FormControl();

  SearchPakcage: string = '';
  public PackageList?: PackageDropDown[] = [];
  filteredPackageOptions?: Observable<PackageDropDown[]>;
  package: FormControl = new FormControl();

  searchReservationID: string = '';
  searchDutySlipID: string = '';

  SearchModeOfPayment: string = '';
  public PaymentModeList?: ModeOfPaymentDropDown[] = [];
  filteredPaymentModeOptions?: Observable<ModeOfPaymentDropDown[]>;
  modeOfPayment: FormControl = new FormControl();

  selectAll: boolean = false;
  selectedEntity: any[] = [];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public changeModeOfPaymentService: ChangeModeOfPaymentService,
    private snackBar: MatSnackBar,
    public router: Router,
    public _generalService: GeneralService,
    public route: Router
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.filteredCustomerOptions = of([]);
    this.filteredPaymentModeOptions = of([]);
    this.loadData();
    this.InitCustomerGroup();
    this.InitCities();
    this.InitVehicle();
    this.InitPackageType();
    this.InitPackage();
    this.InitPaymentMode();
  }

  refresh() {
    this.searchActivationStatus = true;
    this.PageNumber = 0;
    this.customerGroup.setValue('');
    this.customer.setValue('');
    this.city.setValue('');
    this.vehicle.setValue('');
    this.packageType.setValue('');
    this.package.setValue('');
    this.modeOfPayment.setValue('');
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.searchReservationID = '';
    this.searchDutySlipID = '';
    this.SearchModeOfPayment = '';
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.customerGroupID = null;
    this.CustomerList = [];
    this.filteredCustomerOptions = of([]);
    this.selectedEntity = [];
    this.selectAll = false;
    this.loadData();
  }

  public SearchData() {
    this.PageNumber = 0;
    this.selectedEntity = [];
    this.selectAll = false;
    this.loadData();
  }

  private normalizeMultiIds(value: any): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    const normalized = String(value)
      .split(/[\s,]+/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .join(',');
    return normalized || null;
  }

  private buildSearchParams() {
    const packageValue = this.package.value
      ? this.package.value.toString().replace('/', '-')
      : null;
    const searchFromDate = this.SearchFromDate
      ? moment(this.SearchFromDate).format('YYYY-MM-DD')
      : null;
    const searchToDate = this.SearchToDate
      ? moment(this.SearchToDate).format('YYYY-MM-DD')
      : null;
    const reservationIDs = this.normalizeMultiIds(this.searchReservationID);
    const dutySlipIDs = this.normalizeMultiIds(this.searchDutySlipID);

    return {
      customerGroup: this.customerGroup.value || null,
      customerName: this.customer.value || null,
      city: this.city.value || null,
      vehicle: this.vehicle.value || null,
      packageType: this.packageType.value || null,
      packageValue,
      searchFromDate,
      searchToDate,
      reservationIDs,
      dutySlipIDs,
      modeOfPayment: this.modeOfPayment.value || null
    };
  }

  public loadData() {
    const params = this.buildSearchParams();
    this.changeModeOfPaymentService
      .getTableData(
        params.customerGroup,
        params.customerName,
        params.city,
        params.vehicle,
        params.packageType,
        params.packageValue,
        params.searchFromDate,
        params.searchToDate,
        params.reservationIDs,
        params.dutySlipIDs,
        this.searchActivationStatus,
        this.PageNumber,
        params.modeOfPayment
      )
      .subscribe(
        (data) => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => {
          this.dataSource = null;
        }
      );
  }

  SortingData(coloumName: any) {
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    const params = this.buildSearchParams();
    this.changeModeOfPaymentService
      .getTableDataSort(
        params.customerGroup,
        params.customerName,
        params.city,
        params.vehicle,
        params.packageType,
        params.packageValue,
        params.searchFromDate,
        params.searchToDate,
        params.reservationIDs,
        params.dutySlipIDs,
        this.searchActivationStatus,
        this.PageNumber,
        coloumName.active,
        this.sortType,
        params.modeOfPayment
      )
      .subscribe(
        (data) => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => {
          this.dataSource = null;
        }
      );
  }

  showNotification(colorName: any, text: string, placementFrom: any, placementAlign: any) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onContextMenu(event: MouseEvent, item: ChangeModeOfPaymentDutyModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu!.menuData = { item: item };
    this.contextMenu?.menu?.focusFirstItem('mouse');
    this.contextMenu?.openMenu();
  }

  NextCall() {
    if (this.dataSource && this.dataSource?.length > 0) {
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

  InitCustomerGroup() {
    this._generalService.getCustomerGroup().subscribe((data) => {
      this.customerGroupList = data;
      this.filteredOptions = this.customerGroup.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCustomerGroup(value || ''))
      );
    });
  }

  private _filterCustomerGroup(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];
    }
    return this.customerGroupList?.filter((data) =>
      data.customerGroup.toLowerCase().includes(filterValue)
    );
  }

  onCustomerGroupSelected(customerGroup: string) {
    const selectedCustomerGroup = this.customerGroupList?.find(
      (data) => data.customerGroup === customerGroup
    );
    this.customer.setValue('');
    this.customerGroupID = selectedCustomerGroup?.customerGroupID ?? null;
    if (this.customerGroupID) {
      this.InitCustomer(this.customerGroupID);
    } else {
      this.CustomerList = [];
      this.filteredCustomerOptions = of([]);
    }
  }

  onKeyupCustomerName(event?: any) {
    if (this.customerGroupID) {
      return;
    }

    const prefix = ((event?.target?.value ?? this.customer?.value) || '').toString().trim();
    if (prefix.length < 3) {
      this.CustomerList = [];
      this.filteredCustomerOptions = of([]);
      return;
    }

    this._generalService.getCustomerForInvoice(prefix).subscribe((data) => {
      this.CustomerList = data || [];
      this.filteredCustomerOptions = merge(of(prefix), this.customer.valueChanges).pipe(
        map((value) => this._filterCustomer((value || '').toString()))
      );
    });
  }

  InitCustomer(customerGroupID?: number) {
    if (!customerGroupID) {
      this.CustomerList = [];
      this.filteredCustomerOptions = of([]);
      return;
    }

    this.customerGroupID = customerGroupID;
    this._generalService.GetCustomersForCP(customerGroupID).subscribe((data) => {
      this.CustomerList = data || [];
      this.filteredCustomerOptions = this.customer.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCustomer((value || '').toString()))
      );
    });
  }

  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    if (!this.customerGroupID && (!value || value.length < 3)) {
      return [];
    }
    if (!value) {
      return this.CustomerList || [];
    }
    return (this.CustomerList || []).filter((data) =>
      data.customerName?.toLowerCase().includes(filterValue)
    );
  }

  onCustomerSelected(customer: string) {
    this.CustomerList?.find((data) => data.customerName === customer);
  }

  InitCities() {
    this._generalService.GetCitiessAll().subscribe((data) => {
      this.CityList = data;
      this.filteredCityOptions = this.city.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCity(value || ''))
      );
    });
  }

  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityList?.filter((data) =>
      data.geoPointName.toLowerCase().includes(filterValue)
    );
  }

  onCitySelected(CityName: string) {
    this.CityList?.find((data) => data.geoPointName === CityName);
  }

  InitVehicle() {
    this._generalService.GetVehicle().subscribe((data) => {
      this.VehicleList = data;
      this.filteredVehicleOptions = this.vehicle.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterVehicle(value || ''))
      );
    });
  }

  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleList?.filter((data) =>
      data.vehicle.toLowerCase().includes(filterValue)
    );
  }

  onVehicleSelected(VehicleName: string) {
    this.VehicleList?.find((data) => data.vehicle === VehicleName);
  }

  InitPackageType() {
    this._generalService.GetPackgeType().subscribe((data) => {
      this.PackageTypeList = data;
      this.filteredPackageTypeOptions = this.packageType.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterPackageType(value || ''))
      );
    });
  }

  private _filterPackageType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PackageTypeList?.filter(
      (data) => data.packageType.toLowerCase().indexOf(filterValue) === 0
    );
  }

  onPackageTypeSelected(PackageTypeName: string) {
    this.PackageTypeList?.find((data) => data.packageType === PackageTypeName);
  }

  InitPackage() {
    this._generalService.GetPackages().subscribe((data) => {
      this.PackageList = data;
      this.filteredPackageOptions = this.package.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterPackage(value || ''))
      );
    });
  }

  private _filterPackage(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PackageList?.filter(
      (data) => data.package.toLowerCase().indexOf(filterValue) === 0
    );
  }

  onPackageSelected(PackageName: string) {
    this.PackageList?.find((data) => data.package === PackageName);
  }

  InitPaymentMode() {
    this._generalService.GetModeOfPayment().subscribe((data) => {
      this.PaymentModeList = data || [];
      this.filteredPaymentModeOptions = this.modeOfPayment.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterPaymentMode(value || ''))
      );
    });
  }

  private _filterPaymentMode(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PaymentModeList?.filter((data) =>
      data.modeOfPayment.toLowerCase().includes(filterValue)
    );
  }

  onPaymentModeSelected(modeOfPayment: string) {
    const selected = this.PaymentModeList?.find(
      (data) => data.modeOfPayment === modeOfPayment
    );
    if (selected?.modeOfPayment) {
      this.modeOfPayment.setValue(selected.modeOfPayment);
      this.SearchModeOfPayment = selected.modeOfPayment;
    }
  }

  UpdateModeOfPayment() {
    if (!this.selectedEntity || this.selectedEntity.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please select at least one reservation.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const dialogRef = this.dialog.open(ChangeModeOfPaymentFormDialogComponent, {
      width: '600px',
      data: {
        advanceTable: this.selectedEntity
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.selectedEntity = [];
        this.selectAll = false;
        this.loadData();
      }
    });
  }

  OpenModeOfPaymentDetails(row: any) {
    const dialogRef = this.dialog.open(ChangeModeOfPaymentDetailsComponent, {
      width: '600px',
      data: {
        reservationID: row.reservationID
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.loadData();
      }
    });
  }

  checkAll(checkBoxValue: boolean) {
    this.selectedEntity = [];
    this.dataSource?.forEach((element: any) => {
      element.checked = checkBoxValue;
      if (checkBoxValue) {
        this.selectAll = true;
        this.selectedEntity.push(element.reservationID);
      } else {
        this.selectAll = false;
      }
    });
  }

  onCheckBox(checkBoxValue: boolean, data: any) {
    if (checkBoxValue) {
      const exists = this.selectedEntity.includes(data.reservationID);
      if (!exists) {
        this.selectedEntity.push(data.reservationID);
      }
      data.checked = true;
    } else {
      this.selectAll = false;
      data.checked = false;
      const index = this.selectedEntity.indexOf(data.reservationID);
      if (index > -1) {
        this.selectedEntity.splice(index, 1);
      }
    }
  }

  isIndeterminate() {
    if (!this.dataSource || this.dataSource.length === 0) {
      return false;
    }
    const checkedCount = this.dataSource.filter((r) => r.checked).length;
    return checkedCount > 0 && checkedCount < this.dataSource.length;
  }
}
