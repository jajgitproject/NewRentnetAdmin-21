// @ts-nocheck
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomerCategorySoldOutConfigService } from './customerCategorySoldOutConfig.service';
import { CustomerCategorySoldOutConfigModel } from './customerCategorySoldOutConfig.model';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { GeneralService } from '../general/general.service';

@Component({
  standalone: false,
  selector: 'app-customer-category-sold-out-config',
  templateUrl: './customerCategorySoldOutConfig.component.html',
  styles: [],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerCategorySoldOutConfigComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'customerCategory',
    'city',
    'packageType',
    'vehicle',
    'fromDateTimeString',
    'toDateTimeString',
    'activationStatus',
    'actions'
  ];
  dataSource: CustomerCategorySoldOutConfigModel[] = [];
  SearchActivationStatus: boolean = true;
  SearchCustomerCategoryID: number | null = null;
  SearchCityID: number | null = null;
  SearchPackageTypeID: number | null = null;
  SearchVehicleID: number | null = null;
  PageNumber = 0;
  isLoading = false;

  customerCategoryList: any[] = [];
  cityList: any[] = [];
  packageTypeList: any[] = [];
  vehicleList: any[] = [];

  selectedCustomerCategoryLabel = '';
  selectedCityLabel = '';
  selectedPackageTypeLabel = '';
  selectedVehicleLabel = '';

  private updateSub: Subscription;

  constructor(
    public dialog: MatDialog,
    public service: CustomerCategorySoldOutConfigService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  ngOnInit() {
    this.loadLookups();
    this.loadData();
    this.updateSub = this._generalService.getUpdate().subscribe((msg) => {
      const text = msg?.text ?? '';
      if (
        text.indexOf('CustomerCategorySoldOutConfig') >= 0 &&
        text.indexOf('Success') >= 0
      ) {
        this.loadData();
        this.showNotification('snackbar-success', 'Saved successfully', 'bottom', 'center');
      }
    });
  }

  ngOnDestroy() {
    this.updateSub?.unsubscribe();
  }

  loadLookups() {
    this._generalService.getCustomerCategory().subscribe((rows) => {
      this.customerCategoryList = Array.isArray(rows) ? rows : [];
    });
    this._generalService.GetCitys().subscribe((rows) => {
      this.cityList = Array.isArray(rows) ? rows : [];
    });
    this._generalService.GetPackageType().subscribe((rows) => {
      this.packageTypeList = Array.isArray(rows) ? rows : [];
    });
    this._generalService.GetVehicle().subscribe((rows) => {
      this.vehicleList = Array.isArray(rows) ? rows : [];
    });
  }

  loadData() {
    this.isLoading = true;
    this.service
      .getTableData(
        this.SearchCustomerCategoryID,
        this.SearchCityID,
        this.SearchPackageTypeID,
        this.SearchVehicleID,
        this.SearchActivationStatus,
        this.PageNumber
      )
      .subscribe(
        (rows) => {
          this.dataSource = Array.isArray(rows) ? rows : [];
          this.isLoading = false;
        },
        () => {
          this.dataSource = [];
          this.isLoading = false;
        }
      );
  }

  applyFilters() {
    this.PageNumber = 0;
    this.updateFilterLabels();
    this.loadData();
  }

  clearFilters() {
    this.SearchCustomerCategoryID = null;
    this.SearchCityID = null;
    this.SearchPackageTypeID = null;
    this.SearchVehicleID = null;
    this.SearchActivationStatus = true;
    this.selectedCustomerCategoryLabel = '';
    this.selectedCityLabel = '';
    this.selectedPackageTypeLabel = '';
    this.selectedVehicleLabel = '';
    this.applyFilters();
  }

  private updateFilterLabels() {
    const cat = this.customerCategoryList.find(
      (c) => (c.customerCategoryID || c.CustomerCategoryID) === this.SearchCustomerCategoryID
    );
    this.selectedCustomerCategoryLabel = cat
      ? cat.customerCategory || cat.CustomerCategory || ''
      : '';

    const city = this.cityList.find(
      (c) => (c.geoPointID || c.GeoPointID) === this.SearchCityID
    );
    this.selectedCityLabel = city ? city.geoPointName || city.GeoPointName || '' : '';

    const duty = this.packageTypeList.find(
      (p) => (p.packageTypeID || p.PackageTypeID) === this.SearchPackageTypeID
    );
    this.selectedPackageTypeLabel = duty ? duty.packageType || duty.PackageType || '' : '';

    const vehicle = this.vehicleList.find(
      (v) => (v.vehicleID || v.VehicleID) === this.SearchVehicleID
    );
    this.selectedVehicleLabel = vehicle ? vehicle.vehicle || vehicle.Vehicle || '' : '';
  }

  refresh() {
    this.PageNumber = 0;
    this.loadData();
  }

  addNew() {
    this.dialog.open(FormDialogComponent, {
      data: { advanceTable: new CustomerCategorySoldOutConfigModel({}), action: 'add' },
      width: '780px',
      maxHeight: '90vh'
    });
  }

  editCall(row: CustomerCategorySoldOutConfigModel) {
    this.dialog.open(FormDialogComponent, {
      data: { advanceTable: row, action: 'edit' },
      width: '780px',
      maxHeight: '90vh'
    });
  }

  deleteItem(row: CustomerCategorySoldOutConfigModel) {
    this.dialog.open(DeleteDialogComponent, {
      data: row,
      width: '400px'
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2500,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
