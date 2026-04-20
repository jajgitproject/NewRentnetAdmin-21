// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CarMasterMISService } from './carMasterMIS.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { carMasterMIS } from './carMasterMIS.model';
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
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleCategory } from '../vehicleCategory/vehicleCategory.model';
import { RegistrationDropDown } from '../interstateTaxEntry/registrationDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import moment from 'moment';
interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-carMasterMIS',
  templateUrl: './carMasterMIS.component.html',
  styleUrls: ['./carMasterMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CarMasterMISComponent implements OnInit {
  displayedColumns = [
    'vehicleCategory',
       'vehicle',
   'registrationNumber', 
   'carLocation',
   'purchaseDate',
   'inventoryStatus',
    'ownedSupplied',
    'supplierName',
    'supplierType',
   'registrationFromDate',
   'registrationTillDate',
   'driverName',
    'color',
    'fuelType',
    'mileage',
    'noOfAirbags',
    'transmissionType',
    'modelYear',
    'isGPSAvailable',
    'gpsimeiNo',
    'company',
    'status',
    // 'inventoryStatusReason',
    'inventoryCreatedByName',
  ];
  
  columnTitleMap: { [key: string]: string } = {
    vehicleCategory: 'Car Category',
    vehicle: 'Car Type',
    registrationNumber: 'Reg. Number',
    carLocation: 'Location',
    inventoryStatus: 'Car Status',
    ownedSupplied: 'Owned Supplied',
    purchaseDate: 'Purchase Date',
    supplierName: 'Supplier Name',
    supplierType: 'Supplier Type',
    registrationFromDate:'Registration Date',
    registrationTillDate:' Car Creation Date',
    driverName: 'Driver',
    color: 'Color',
    fuelType: 'Fuel Type',
    mileage: 'Mileage',
    noOfAirbags: 'No. of Airbags',
    transmissionType: 'Transmission Type',
    modelYear: 'Model Year',
    isGPSAvailable: 'GPS Available',
    gpsimeiNo: 'GPS IMEI No.',
    company: 'Company',
    inventoryStatusReason: 'Status Reason',
    inventoryCreatedByName: 'Created By',
    status: 'Status',
  
  };
  
  dataSource: carMasterMIS[] | null;
  inventoryID: number;
  advanceTable: carMasterMIS | null;
  CarMasterMISID: number = 0;
  SearchActivationStatus : string='';
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  SearchVehcileCategory:string='';
  vehicleCategory:FormControl=new FormControl();
  locationHub:FormControl=new FormControl();
  company:FormControl=new FormControl();
  SearchVehicle:string='';
  vehicle:FormControl=new FormControl();

  SearchSupplier:string='';
  supplier:FormControl=new FormControl();
  registrationNumber: FormControl = new FormControl();
  filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
  public RegistrationNumberList?: RegistrationDropDown[] = [];

  // SearchRegNumber:string='';
  // regNumber:FormControl=new FormControl();

  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  public SupplierList?: SupplierDropDown[] = [];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;

  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
   filteredVOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
   filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  searchcarLocation: string='';
  searchownedSupplier:string='';
  status:string='';
  searchGps:string='';
  searchCompany:string='';
  purchaseDate: string='';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public inventoryService: CarMasterMISService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
    this.initVehicleCategories();
    this.initVehicle();
    this.InitLocationHub();
    this.InitCompany();
  }
  
  initVehicleCategories(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.filteredVehicleCategoryOptions = this.vehicleCategory.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.VehicleCategoryList.filter(
      customer => 
      {
        return customer.vehicleCategory.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  initVehicle(){
    this._generalService.GetVehicle().subscribe(
      data=>
      {
        this.VehicleList=data;
        this.filteredVehicleOptions = this.vehicle.valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
        ); 
      });
  }
  
  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.VehicleList.filter(
      customer => 
      {
        return customer.vehicle.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

    InitCompany(){
      this._generalService.GetCompany().subscribe(
        data=>
          {
            this.OrganizationalEntityList=data;
            this.filteredVOrganizationalEntityOptions = this.company.valueChanges.pipe(
              startWith(""),
              map(value => this._filterOrganizationalEntity(value || ''))
            ); 
          });
    }
    private _filterOrganizationalEntity(value: string): any {
      const filterValue = value.toLowerCase();
      // if (!value || value.length < 3) {
      //   return [];   
      // }
      return this.OrganizationalEntityList.filter(
        customer => 
        {
          return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
        });
    }
 
    InitLocationHub(){
      this._generalService.GetLocation().subscribe(
        data=>
        {
          this.OrganizationalEntitiesList=data;
        
          this.filteredOrganizationalEntityOptions = this.locationHub.valueChanges.pipe(
            startWith(""),
            map(value => this._filterOrganizationalsEntity(value || ''))
          ); 
        });
    }
    private _filterOrganizationalsEntity(value: string): any {
      const filterValue = value.toLowerCase();
      // if (!value || value.length < 3) {
      //   return [];   
      // }
      return this.OrganizationalEntitiesList.filter(
        customer => 
        {
          return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }
  refresh() {
    this.vehicleCategory.setValue(''),
    this.vehicle.setValue(''),
    this.locationHub.setValue(''),
    this.searchownedSupplier = '';
    this.status = '';
    this.searchGps = '';
    this.company.setValue(''),
    this.SearchActivationStatus = '';
    this.PageNumber=0;
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

onBackPress(event) 
{
  if (event.keyCode === 8) 
  {
    this.loadData();
  }
}

   public loadData() 
   {
     if(this.purchaseDate!==""){
              this.purchaseDate=moment(this.purchaseDate).format('MMM DD yyyy');
            }
      this.inventoryService.getTableData(
        this.vehicleCategory.value,
        this.vehicle.value,
        this.locationHub.value,
        this.searchownedSupplier,
        this.status,
        this.searchGps,
        this.company.value,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
        console.log(this.dataSource);
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: carMasterMIS) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
  NextCall()
  {
    if (this.dataSource.length>0) 
    {
     
      this.PageNumber++;
      //alert(this.PageNumber + 'mohit')
      this.loadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
  }

  SortingData(coloumName:any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.inventoryService.getTableDataSort(
      this.vehicleCategory.value,
      this.vehicle.value,
      this.locationHub.value,
      this.searchownedSupplier,
      this.status,
      this.searchGps,
      this.company.value,
      this.SearchActivationStatus, 
      this.PageNumber,
      coloumName.active,
      this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  onStatusChange(selectedStatus: string) {
    this.status = selectedStatus;
    // this.fetchDataBasedOnStatus();
  }
}




