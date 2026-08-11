// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { Router } from '@angular/router';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { RegistrationDropDown } from '../carPaidTaxMIS/registrationDropDown.model';
import { CreditNoteHistoryComponent } from '../creditnotehistory/creditnotehistory.component';
import { InvoiceBillingHistoryComponent } from '../invoiceBillingHistory/invoiceBillingHistory.component';
import Swal from 'sweetalert2';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { PackageDropDown } from '../general/packageDropDown.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { ChangeVendorService } from './changeVendor.service';
import { ChangeVendorFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { ChangeEntityModel } from './changeVendor.model';
import { ChangeVendorDetailsComponent } from './dialogs/changeVendorDetails/changeVendorDetails.component';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import {
  filterSuppliersByDisplay,
  formatSupplierDisplay,
  supplierMatchesDisplay,
} from '../supplier/supplier-display.util';
import moment from 'moment';




@Component({
  standalone: false,
  selector: 'app-changeVendor',
  templateUrl: './changeVendor.component.html',
  styleUrls: ['./changeVendor.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ChangeVendorComponent implements OnInit {
  displayedColumns = [
    'check',
    'actions',
    'ReservationID',
    'DutySlipID',
    'BillingStatus',
    'Vendor',
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

  dataSource?:ChangeEntityModel[] | null | undefined;
  SearchActivationStatus:boolean = true;
  PageNumber:number = 0;
  search:FormControl = new FormControl();
  isChecked:boolean = false;
  sortingData?:number;
  sortType?:string;
  dialogRef?:MatDialogRef<any>;


  searchActivationStatus:boolean=true;
  searchTerm:any = '';
  selectedFilter:string = 'search';
  advanceTableForm:any;  

  searchCustomerGroup:string='';
  customerGroupID:any;
  public customerGroupList?:CustomerGroupDropDown[] = [];
  filteredOptions?:Observable<CustomerGroupDropDown[]>;
  customerGroup:FormControl=new FormControl();

  searchCustomerName:string='';
  public CustomerList?:CustomerDropDown[]=[];
  filteredCustomerOptions?:Observable<CustomerDropDown[]>;
  customer:FormControl=new FormControl();

  SearchFromDate:string = '';
  startDate:FormControl = new FormControl();

  SearchToDate:string = '';
  endDate:FormControl = new FormControl();

  SearchCity:string = '';
  public CityList?:CitiesDropDown[] = [];
  filteredCityOptions?:Observable<CitiesDropDown[]>;
  city:FormControl=new FormControl();

  SearchVehicle:string = '';
  public VehicleList?:VehicleDropDown[] = [];
  filteredVehicleOptions?:Observable<VehicleDropDown[]>;
  vehicle:FormControl=new FormControl();

  SearchPackageType:string = '';
  public PackageTypeList?:PackageTypeDropDown[]=[]; 
  filteredPackageTypeOptions?:Observable<PackageTypeDropDown[]>;
  packageType:FormControl=new FormControl();

  SearchPakcage:string = '';
  public PackageList?:PackageDropDown[]=[];
  filteredPackageOptions?:Observable<PackageDropDown[]>;
  package:FormControl=new FormControl();

  searchReservationID:string = '';
  searchDutySlipID:string = '';

  SearchVendor:string = '';
  public VendorList?:SupplierDropDown[] = [];
  filteredVendorOptions?:Observable<SupplierDropDown[]>;
  vendor:FormControl = new FormControl();
  formatSupplierDisplay = formatSupplierDisplay;

  selectAll:boolean=false;
  selectedEntity: any[] = [];
  

    constructor(
      public httpClient: HttpClient,
      public dialog: MatDialog,
      public changeVendorService: ChangeVendorService,
      private snackBar: MatSnackBar,
      public router:Router,
      public _generalService: GeneralService,
      public route: Router,
    ) { }
    @ViewChild(MatPaginator, { static: true }) paginator?:MatPaginator;
    @ViewChild(MatSort, { static: true }) sort?:MatSort;
    @ViewChild('filter', { static: true }) filter?:ElementRef;
    @ViewChild(MatMenuTrigger)
    contextMenu?:MatMenuTrigger;
    contextMenuPosition = { x: '0px', y: '0px' };
    ngOnInit() 
    {
      this.filteredCustomerOptions = of([]);
      this.filteredVendorOptions = of([]);
      this.InitCustomerGroup();
      this.InitCities();
      this.InitVehicle();
      this.InitPackageType();
      this.InitPackage();
      this.InitVendor();
    }

    refresh() 
    {
      this.searchActivationStatus = true;
      this.PageNumber = 0;
      this.customerGroup.setValue('');
      this.customer.setValue('');
      this.city.setValue('');
      this.vehicle.setValue('');
      this.packageType.setValue('');
      this.package.setValue('');
      this.vendor.setValue('');
      this.SearchFromDate = '';
      this.SearchToDate = '';
      this.searchReservationID = '';
      this.searchDutySlipID = '';
      this.SearchVendor = '';
      this.searchTerm = '';
      this.selectedFilter = 'search';
      this.customerGroupID = null;
      this.CustomerList = [];
      this.filteredCustomerOptions = of([]);
      this.VendorList = [];
      this.filteredVendorOptions = of([]);
      this.selectedEntity = [];
      this.selectAll = false;
      this.dataSource = null;
    }

    public SearchData() 
    {
      this.PageNumber = 0;
      this.loadData();
    }
 
    public Filter() 
    {
      this.PageNumber = 0;
      this.loadData();
    }

    onBackPress(event: { keyCode: number; }) 
    {
      if (event.keyCode === 8) 
      {
        this.loadData();
      }
    }

    private buildSearchParams() {
      let searchFromDate = this.SearchFromDate;
      let searchToDate = this.SearchToDate;

      if (searchFromDate) {
        searchFromDate = moment(searchFromDate).format('YYYY-MM-DD');
        this.SearchFromDate = searchFromDate;
      } else {
        searchFromDate = null;
        this.SearchFromDate = '';
      }

      if (searchToDate) {
        searchToDate = moment(searchToDate).format('YYYY-MM-DD');
        this.SearchToDate = searchToDate;
      } else {
        searchToDate = null;
        this.SearchToDate = '';
      }

      let reservationIDs = null;
      if (this.searchReservationID && this.searchReservationID.trim() !== '') {
        reservationIDs = this.searchReservationID.split(/[\s,]+/).filter(x => x.trim() !== '').join(',');
      }

      let dutySlipIDs = null;
      if (this.searchDutySlipID && this.searchDutySlipID.trim() !== '') {
        dutySlipIDs = this.searchDutySlipID.split(/[\s,]+/).filter(x => x.trim() !== '').join(',');
      }

      const packageValue = this.package.value
        ? String(this.package.value).replace(/\//g, '-')
        : null;

      this.searchCustomerGroup = this.customerGroup.value || '';
      this.searchCustomerName = this.customer.value || '';
      this.SearchCity = this.city.value || '';
      this.SearchVehicle = this.vehicle.value || '';
      this.SearchPackageType = this.packageType.value || '';
      this.SearchPakcage = packageValue || '';
      this.SearchVendor = this.vendor.value || '';

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
        vendor: this.vendor.value || null,
      };
    }

    public loadData() 
    {
      const params = this.buildSearchParams();
      this.changeVendorService.getTableData(
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
        params.vendor
      ).subscribe(
      data => 
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
      );
    }

    SortingData(coloumName:any) 
    {
      if (this.sortingData == 1) 
      {
        this.sortingData = 0;
        this.sortType = "Ascending"
      }
      else 
      {
        this.sortingData = 1;
        this.sortType = "Descending";
      }
      const params = this.buildSearchParams();
      this.changeVendorService.getTableDataSort(
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
        params.vendor
      ).subscribe
      (
        data =>   
        {
          this.dataSource = data;       
        },
        (error: HttpErrorResponse) => { this.dataSource = null;}
      );
    }

    showNotification(colorName: any, text: string, placementFrom: any, placementAlign: any) 
    {
      this.snackBar.open(text, '', {
        duration: 2000,
        verticalPosition: placementFrom,
        horizontalPosition: placementAlign,
        panelClass: colorName
      });
    }

    onContextMenu(event: MouseEvent, item: ChangeEntityModel) 
    {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu!.menuData = { item: item };
      this.contextMenu?.menu?.focusFirstItem('mouse');
      this.contextMenu?.openMenu();
    }

    NextCall() 
    {
      if (this.dataSource && this.dataSource?.length > 0) 
      {
        this.PageNumber++;
        this.loadData();
      }
    }

    PreviousCall() 
    {
      if (this.PageNumber > 0) 
      {
        this.PageNumber--;
        this.loadData();
      }
    } 

  

    //---------- Customer Group ----------
    InitCustomerGroup()
    {
      this._generalService.getCustomerGroup().subscribe(
      data=>{
        this.customerGroupList=data;
        this.filteredOptions = this.customerGroup.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomerGroup(value || ''))
        );
      })
    }
    private _filterCustomerGroup(value: string): any {
      const filterValue = value.toLowerCase();
      if (!value || value.length < 3)
      {
          return [];   
        }
      return this.customerGroupList?.filter(
        data => 
        {
          return data.customerGroup.toLowerCase().includes(filterValue);
        }
      );    
    };

    onCustomerGroupSelected(customerGroup: string) 
    {
      const selectedCustomerGroup = this.customerGroupList?.find(
        data => data.customerGroup === customerGroup
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


    //---------- Customer ----------
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

      this._generalService.getCustomerForInvoice(prefix).subscribe(data => {
        this.CustomerList = data || [];
        this.filteredCustomerOptions = merge(of(prefix), this.customer.valueChanges).pipe(
          map(value => this._filterCustomer((value || '').toString()))
        );
      });
    }

    InitCustomer(customerGroupID?: number)
    {
      if (!customerGroupID) {
        this.CustomerList = [];
        this.filteredCustomerOptions = of([]);
        return;
      }

      this.customerGroupID = customerGroupID;
      this._generalService.GetCustomersForCP(customerGroupID).subscribe(
      data=>
      {
        this.CustomerList = data || [];
        this.filteredCustomerOptions = this.customer.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCustomer((value || '').toString()))
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
      return (this.CustomerList || []).filter(
        data => 
        {
          return data.customerName?.toLowerCase().includes(filterValue);
        }
      );
    }
    onCustomerSelected(customer: string) 
    {
      const selectedCustomer = this.CustomerList?.find(
        data => data.customerName === customer);
    }
  

    //---------- City ----------
    InitCities()
    {
      this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList = data;
        this.filteredCityOptions = this.city.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        ); 
      });
    }
    private _filterCity(value: string): any {
      const filterValue = value.toLowerCase();
      return this.CityList?.filter(
        data => 
        {
          return data.geoPointName.toLowerCase().includes(filterValue);
        }
      );
    }
    onCitySelected(CityName: string) 
    {
      const selectedCityName = this.CityList?.find(
        data => data.geoPointName === CityName
      ); 
    }


    //---------- Vehicle ----------
    InitVehicle() 
    {
      this._generalService.GetVehicle().subscribe(
      data => 
      {
        this.VehicleList = data;
        this.filteredVehicleOptions = this.vehicle.valueChanges.pipe(
          startWith(''),
          map(value => this._filterVehicle(value || ''))
        );
      });
    }  
    private _filterVehicle(value: string): any {
      const filterValue = value.toLowerCase();
      return this.VehicleList?.filter(
        data => 
        {
          return data.vehicle.toLowerCase().includes(filterValue);
        }
      );
    }
    onVehicleSelected(VehicleName: string) 
    {
      const selectedVehicleName = this.VehicleList?.find(
        data => data.vehicle === VehicleName
      ); 
    }


    //---------- Package Type ----------
    InitPackageType()
    {
      this._generalService.GetPackgeType().subscribe(
      data=>
      {
        this.PackageTypeList=data;
        this.filteredPackageTypeOptions = this.packageType.valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
    }
    private _filterPackageType(value: string): any {
      const filterValue = value.toLowerCase();
      return this.PackageTypeList?.filter(
        data => 
        {
          return data.packageType.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }
    onPackageTypeSelected(PackageTypeName: string) 
    {
      const selectedPackageTypeName = this.PackageTypeList?.find(
        data => data.packageType === PackageTypeName
      ); 
    }


    //---------- Package ----------
    InitPackage()
    { 
      this._generalService.GetPackages().subscribe(
      data=>
      {
        this.PackageList=data;
        this.filteredPackageOptions = this.package.valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackage(value || ''))
        ); 
      });
    }
    private _filterPackage(value: string): any {
      const filterValue = value.toLowerCase();
      return this.PackageList?.filter(
        data => 
        {
          return data.package.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }
    onPackageSelected(PackageName: string) 
    {
      const selectedPackageName = this.PackageList?.find(
        data => data.package === PackageName
      ); 
    }


    //---------- Vendor (SupplierName + OldRentnetCode, same as closingOne Change Supplier) ----------
    InitVendor() {
      this._generalService.GetAllSuppliers().subscribe(
        data => {
          this.VendorList = data || [];
          this.filteredVendorOptions = this.vendor.valueChanges.pipe(
            startWith(''),
            map(value => this._filterVendor((value || '').toString()))
          );
        },
        () => {
          this.VendorList = [];
          this.filteredVendorOptions = of([]);
        }
      );
    }

    private _filterVendor(value: string): any {
      if (!value || value.length < 3) {
        return [];
      }
      return filterSuppliersByDisplay(this.VendorList, value);
    }

    onVendorSelected(vendorDisplay: string) {
      const selectedVendor = this.VendorList?.find(
        data => supplierMatchesDisplay(data, vendorDisplay)
      );
      if (selectedVendor) {
        const display = formatSupplierDisplay(selectedVendor);
        this.vendor.setValue(display);
        this.SearchVendor = display;
      }
    }
 


    UpdateVendor() 
    {
      const dialogRef = this.dialog.open(ChangeVendorFormDialogComponent, {
      width: '600px',
      data: 
        {         
          //advanceTable : row
          advanceTable: this.selectedEntity,
        }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
      if (res) 
        {
          this.loadData();
        }
      });  
    }


    
    OpenVendorDetails(row:any) 
    {
      const dialogRef = this.dialog.open(ChangeVendorDetailsComponent, {
      width: '600px',
      data: 
        {         
          reservationID : row.reservationID,
        }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
      if (res) 
        {
          this.loadData();
          
        }
      });  
    }


    //---------- Check Box ----------
    checkAll(checkBoxValue: boolean) 
    {
      this.selectedEntity = [];
      this.dataSource?.forEach((element: any) => {
        element.checked = checkBoxValue;
        if (checkBoxValue) 
        {
          this.selectAll = true;
          this.selectedEntity.push(element.reservationID);
        } 
        else 
        {
          this.selectAll = false;
        }
      });
    }

    onCheckBox(checkBoxValue: boolean, data: any) 
    {
      if(checkBoxValue) 
      {
        const exists = this.selectedEntity.includes(data.reservationID);
        if (!exists) 
        {
          this.selectedEntity.push(data.reservationID);
        }
        data.checked = true;
      } 
      else 
      {
        this.selectAll = false;
        data.checked = false;
        const index = this.selectedEntity.indexOf(data.reservationID);
        if (index > -1) {
          this.selectedEntity.splice(index, 1);
        }
      }
    }

    isIndeterminate() 
    {
      const checkedCount = this.dataSource.filter(r => r.checked).length;
      return checkedCount > 0 && checkedCount < this.dataSource.length;
    }


    




}



