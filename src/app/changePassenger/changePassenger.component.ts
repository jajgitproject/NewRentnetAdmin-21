// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
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
import { ChangePassengerService } from './changePassenger.service';
import { ChangePassengerFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { ChangeEntityModel } from './changePassenger.model';
import { ChangePassengerDetailsComponent } from './dialogs/changePassengerDetails/changePassengerDetails.component';
import moment from 'moment';


@Component({
  standalone: false,
  selector: 'app-changePassenger',
  templateUrl: './changePassenger.component.html',
  styleUrls: ['./changePassenger.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ChangePassengerComponent implements OnInit {
  displayedColumns = [
    'actions',
    'ReservationID',
    'DutySlipID',
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
  

    constructor(
      public httpClient: HttpClient,
      public dialog: MatDialog,
      public changePassengerService: ChangePassengerService,
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
      this.loadData();
      this.InitCustomerGroup();
      this.InitCities();
      this.InitVehicle();
      this.InitPackageType();
      this.InitPackage();
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
      this.SearchFromDate = '';
      this.SearchToDate = '';
      this.searchReservationID = '';
      this.searchDutySlipID = '';    
      this.searchTerm = '';
      this.selectedFilter = 'search';  
      this.loadData();
    }

    public SearchData() 
    {
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

    public loadData() 
    {
      if(this.SearchFromDate!=="")
      {
        this.SearchFromDate=moment(this.SearchFromDate).format('yyyy-MM-DD');
      }
      if(this.SearchToDate!=="")
      {
        this.SearchToDate=moment(this.SearchToDate).format('yyyy-MM-DD');
      }
      // Convert multi-ID input
      let reservationIDs = null;
      if (this.searchReservationID && this.searchReservationID.trim() !== "") 
      {
        reservationIDs = this.searchReservationID.split(/[\s,]+/).filter(x => x.trim() !== "").join(',');
      }
      let dutySlipIDs = null;
      if (this.searchDutySlipID && this.searchDutySlipID.trim() !== "") 
      {
        dutySlipIDs = this.searchDutySlipID.split(/[\s,]+/).filter(x => x.trim() !== "").join(',');
      }
      let Package = this.package.value ? this.package.value.replace('/','-') : null;
      this.changePassengerService.getTableData(this.customerGroup.value,this.customer.value,this.city.value,this.vehicle.value,this.packageType.value,encodeURIComponent(Package),this.SearchFromDate,this.SearchToDate,reservationIDs,dutySlipIDs,this.searchActivationStatus,this.PageNumber).subscribe(
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
      this.changePassengerService.getTableDataSort(this.searchCustomerGroup,this.searchCustomerName,this.SearchCity,this.SearchVehicle,this.SearchPackageType,this.SearchPakcage.replace(/\//g, '-'),this.SearchFromDate,this.SearchToDate,this.searchReservationID,this.searchDutySlipID,this.searchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe
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
    }


    //---------- Customer ----------
    InitCustomer()
    {
      this._generalService.GetCustomersForCP(this.customerGroupID).subscribe(
      data=>
      {
        this.CustomerList = data;
        this.filteredCustomerOptions = this.customer.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        ); 
      });
    }
    private _filterCustomer(value: string): any {
      const filterValue = value.toLowerCase();
      return this.CustomerList?.filter(
        data => 
        {
          return data.customerName.toLowerCase().includes(filterValue);
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
 


    UpdatePassenger(row:any) 
    {
      const dialogRef = this.dialog.open(ChangePassengerFormDialogComponent, {
      width: '600px',
      data: 
        {         
          advanceTable : row,
          reservationID : row.reservationID,
          customerID : row.customerID,
          customerName : row.customerName,
          customerGroupID : row.customerGroupID,
          customerGroupName : row.customerGroup,
          primaryPassengerID : row.primaryPassengerID,
          primaryPassenger : row.primaryPassenger
        }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
      if (res) 
        {
          this.loadData();
        }
      });  
    }


    
    OpenPassengerDetails(row:any) 
    {
      const dialogRef = this.dialog.open(ChangePassengerDetailsComponent, {
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



    




}



