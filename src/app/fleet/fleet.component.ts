// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
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
import { MyUploadComponent } from '../myupload/myupload.component';
// import { FormDialogComponent } from '../fleet/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
// import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FleetService } from './fleet.service';
// import { Fleet } from './fleet.model';
import { ActivatedRoute } from '@angular/router';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';

import moment from 'moment';
import { VehicleCategoryDropDown } from '../general/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { RegistrationDropDown } from '../interstateTaxEntry/registrationDropDown.model';
import {Fleet } from './fleet.model';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
@Component({
  standalone: false,
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FleetComponent implements OnInit {
   // Display columns that correspond to the model properties
   displayedColumns = [
    'registrationNo',
    'vehicle',
    'vehicleCategory',
    'dutySlipNo',
    'ReservationID',
    'currentChauffeur',
    'mobile',
    'location',
    'packages',
    'dutyType',
    'pickCity',
    'pickAddress',
    'pickupDate',
      'pickupTime',
    'dropOffCity',
    'dropOffAddress',
    'dropOffDate',
    'dropOffTime',
    // 'paidOn',
    // 'paidByEmployee',
    // 'uploadedOn',
    // 'uploadedByEmployee',
    // 'interStateTaxImage',
    // 'status',
    // 'actions'
  ];
  advanceTableForm:FormGroup;
  // displayedColumns: string[] = [];
  dataSource:any[] | null;
  fleetID: number;
  advanceTable:Fleet | null;
  RegistrationNumber: string = '';
  State: string = '';
  FromDate: string = '';
  ToDate: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  registrationNumber: FormControl = new FormControl();
  driver : FormControl=new FormControl();
   filteredDispatchLocationOptions: Observable<OrganizationalEntityDropDown[]>;
   dispatch_Location: FormControl = new FormControl();
  public DispatchLocationList?: OrganizationalEntityDropDown[] = [];
  state: FormControl = new FormControl();
  public StatesList?: StatesDropDown[] = [];
  filteredStateOptions: Observable<StatesDropDown[]>;
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  vehicleCategory:FormControl=new FormControl();
  location:FormControl=new FormControl();
  VehicleCategory: string = '';
  Vehicle: string = '';
  vehicle:FormControl=new FormControl();
  city:FormControl=new FormControl();
  searchInventory: string = '';
  filteredCityOptions: Observable<CitiesDropDown[]>;
  searchCity: FormControl = new FormControl();
  filteredDriverOptions:Observable<DriverDropDown[]>;
    public DriverList?:DriverDropDown[]=[];
    SearchDriverName:string='';
  public CityList?: CitiesDropDown[] = [];
    filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
    public RegistrationNumberList?: RegistrationDropDown[] = [];
    filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
    public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
    public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
   locationHub: FormControl = new FormControl();

  redirectingFrom: any;
  StateID: any;
  searchForm: FormGroup;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  searchvehicle: string = '';
  searchcity: string = '';
  searchlocation: string = '';
  searchpickupadate:string = '';
  searchPickupTime:string = '';
  searchvehicleCategory: string = '';
  Inventory: string = '';
  DispatchLocation: string = '';
  pickupDate: string;
  SearchdriverName: string = '';
  isSearchPerformed: boolean = false;
  searchpickupTime: string ='';
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public fleetService: FleetService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    public _generalService: GeneralService,
    private fb: FormBuilder,
    
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  
  ngOnInit() {
    this.searchForm = this.fb.group({
      searchpickupadate: ['',Validators.required],
  
    });
    this.SubscribeUpdateService();
     this.initDriver();
     this.InitLocationHub();
     this.initCity();
     this.initVehicleCategories();
     this.InitRegistrationNumber();
     this.initVehicle();
    //  this.loadData();
  }

      initCity(){
        this._generalService.GetCitiessAll().subscribe(
          data=>
          {
            this.CityList=data;
            this.filteredCityOptions = this.city.valueChanges.pipe(
              startWith(""),
              map(value => this._filterCity(value || ''))
            ); 
          });
      }
      
      private _filterCity(value: string): any {
        const filterValue = value.toLowerCase();
      //   if(filterValue.length === 0) {
      // return [];
      //   }
        return this.CityList.filter(
          customer =>
          {
            return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
          }
        );
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
    //  if(filterValue.length === 0) {
    //   return []; 
    //     }
        return this.OrganizationalEntitiesList.filter(
          customer => 
          {
            return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
          }
        );
      }
  refresh() {
    this.driver.setValue('');
    this.registrationNumber.setValue(''),
    this.vehicleCategory.setValue(''),
    this.vehicle.setValue(''),
    this.city.setValue(''),
    this.searchpickupadate = null,
    this.searchForm.reset();
    this.searchForm.controls['searchpickupadate'].setValue(null);
    this.searchpickupTime ='',
    this.locationHub.setValue(''),
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

shouldShowDeleteButton(item: any): boolean {
  return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
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
    if(this.searchForm.value.searchpickupadate! == "" || this.searchForm.value.searchpickupadate!== null){
      this.searchpickupadate=moment(this.searchForm.value.searchpickupadate).format('MMM DD yyyy');
    }
      this.fleetService.getTableData(this.driver.value,
        this.registrationNumber.value || this.RegistrationNumber,
        this.vehicle.value|| this.Vehicle,
        this.vehicleCategory.value || this.VehicleCategory,
       this.city.value,
       this.searchpickupadate,
       this.searchPickupTime,
       this.locationHub.value,
    
       this.SearchActivationStatus, this.PageNumber
      ).subscribe
      (
        data =>   
        {
          this.dataSource = data; 
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
  onContextMenu(event: MouseEvent, item:Fleet) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall()
  {
    if (this.dataSource?.length>0) 
    {
      this.PageNumber++;
      this.loadData();
    }
  }
  PreviousCall()
  {
    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData(); 
    } 
  }
  SearchData() {
    if (this.searchForm.valid) {
      this.isSearchPerformed = true;
      this.loadData(); // Replace with your actual function
    }
  }

  resetSearchState() {
    this.isSearchPerformed = false;
    this.searchForm.reset(); // Reset the form
  }
/////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
  this.response = event;
  this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  }
/////////////////for Image Upload ends////////////////////////////

  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="FleetCreate")
          {
            if(this.MessageArray[1]=="FleetView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'DateWise Carwise Booking Report View  Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FleetUpdate")
          {
            if(this.MessageArray[1]=="FleetView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'DateWise Carwise Booking Report View...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FleetDelete")
          {
            if(this.MessageArray[1]=="FleetView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'DateWise Carwise Booking Report View  Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FleetAll")
          {
            if(this.MessageArray[1]=="FleetView")
            {
              if(this.MessageArray[2]=="Failure")
              {
               this.refresh();
               this.showNotification(
                'snackbar-danger',
                'Operation Failed.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DataNotFound")
          {
            if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
               this.refresh();
               this.showNotification(
                'snackbar-danger',
                'Duplicate Value Found.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
        }
      }
    );
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
    this.fleetService.getTableDataSort(this.driver.value,
      this.registrationNumber.value || this.RegistrationNumber,
      this.vehicle.value|| this.Vehicle,
      this.vehicleCategory.value || this.VehicleCategory,
     this.city.value,
     this.searchpickupadate,
     this.searchPickupTime,
     this.locationHub.value,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;     
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  initDriver(){
    this._generalService.getDriverMIS().subscribe(
      data=>
      {
        this.DriverList=data;
        this.filteredDriverOptions = this.driver.valueChanges.pipe(
          startWith(""),
          map(value => this._filterDriver(value || ''))
        ); 
      });
  }
  private _filterDriver(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    // // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.DriverList.filter(
      customer => 
      {
        return customer.driverName.toLowerCase().includes(filterValue);
      }
    );
  }

  InitRegistrationNumber(){
    this._generalService.GetRegistrationForDropDown().subscribe(
      data=>
      {
        this.RegistrationNumberList=data;
        this.filteredRegistrationNumberOptions = this.registrationNumber.valueChanges.pipe(
          startWith(""),
          map(value => this._filterRN(value || ''))
        ); 
      });
  }
  
  private _filterRN(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.RegistrationNumberList.filter(
      customer => 
      {
        return customer.registrationNumber.toLowerCase().indexOf(filterValue)===0;
      }
    );
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
    //   if(filterValue.length === 0) {
    //   return [];
    // }
    return this.VehicleCategoryList.filter(
      customer => 
      {
        return customer.vehicleCategory.toLowerCase().includes(filterValue);
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
    // if(filterValue.length === 0) {
    //   return [];
    // // if (!value || value.length < 3) {
    // //   return [];   
    // }
    return this.VehicleList.filter(
      customer => 
      {
        return customer.vehicle.toLowerCase().includes(filterValue);
      }
    );
  }

}






