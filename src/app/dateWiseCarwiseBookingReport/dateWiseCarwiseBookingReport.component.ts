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
// import { FormDialogComponent } from '../dateWiseCarwiseBookingReport/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
// import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { DateWiseCarwiseBookingReportService } from './dateWiseCarwiseBookingReport.service';
// import { DateWiseCarwiseBookingReport } from './dateWiseCarwiseBookingReport.model';
import { ActivatedRoute } from '@angular/router';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';

import moment from 'moment';
import { VehicleCategoryDropDown } from '../general/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { RegistrationDropDown } from '../interstateTaxEntry/registrationDropDown.model';
import { DatewiseCarwiseBookingReport } from './dateWiseCarwiseBookingReport.model';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
@Component({
  standalone: false,
  selector: 'app-dateWiseCarwiseBookingReport',
  templateUrl: './dateWiseCarwiseBookingReport.component.html',
  styleUrls: ['./dateWiseCarwiseBookingReport.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DateWiseCarwiseBookingReportComponent implements OnInit {
   // Display columns that correspond to the model properties
   displayedColumns = [
    'reservationCount',
    'pickupDate',
    'geoPointName',
    'organizationalEntityName',
    'vehicleCategory',
    
  ];

  columnTitleMap: { [key: string]: string } = {
    reservationCount: ' Reservation Count',
    pickupDate: 'Pick Up Date',
    geoPointName: 'City',
    organizationalEntityName: 'Location',
    vehicleCategory: 'Vehicle Category',
    actions: 'Actions',
  };
  
  // displayedColumns: string[] = [];
  dataSource: DatewiseCarwiseBookingReport[] | null;
  dateWiseCarwiseBookingReportID: number;
  advanceTable: DatewiseCarwiseBookingReport | null;
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
  SearchVehicle:string='';
  vehicle:FormControl=new FormControl();
  city:FormControl=new FormControl();
  searchInventory: string = '';
  filteredCityOptions: Observable<CitiesDropDown[]>;
  searchCity: FormControl = new FormControl();
  public CityList?: CitiesDropDown[] = [];
    filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
    public RegistrationNumberList?: RegistrationDropDown[] = [];
   filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
   locationHub: FormControl = new FormControl();
    public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
      public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  redirectingFrom: any;
  StateID: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  Vehicle: string = '';
  searchvehicle: string = '';
  searchcity: string = '';
  searchlocation: string = '';
  searchpickupadate:string = '';
  searchvehicleCategory: string = '';
  Inventory: string = '';
  // FromDate: string = '';
  // ToDate: string = '';
  DispatchLocation: string = '';
  pickupDate: string;

  // vehicleCategory: string = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dateWiseCarwiseBookingReportService: DateWiseCarwiseBookingReportService,
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
 
    //this.loadData();
    this.initCity();
    this.InitLocationHub();
   this.initVehicleCategory();
    this.SubscribeUpdateService();
    this.initDispatchLocation();
  }

    // initdispatchLocation(){
    //   this._generalService.GetLocationHub().subscribe(
    //     data=>
    //     {
    //       this.DispatchLocationList=data;
    //       this.filteredDispatchLocationOptions = this.dispatchLocation.valueChanges.pipe(
    //         startWith(""),
    //         map(value => this._filterRN(value || ''))
    //       ); 
    //     });
    // }
    
    // private _filterRN(value: string): any {
    //   const filterValue = value.toLowerCase();
    //   return this.DispatchLocationList.filter(
    //     customer => 
    //     {
    //       return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
    //     }
    //   );
    // }

    initDispatchLocation(){
      this._generalService.GetLocationHub().subscribe(
        data =>
        {
          this.DispatchLocationList = data;  
          this.filteredDispatchLocationOptions = this.dispatch_Location.valueChanges.pipe(
            startWith(""),
            map(value => this._filterRN(value || ''))
          );              
        },
        error=>
        {
      
        }
      );
      }
  
      private _filterRN(value: string): any {
      const filterValue = value.toLowerCase();
      if (!value || value.length < 3)
     {
        return [];   
      }
      return this.DispatchLocationList.filter(
        customer =>
        {
          return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
        }
      );
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
    //     if (!value || value.length < 3)
    //  {
    //     return [];   
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
    //       if (!value || value.length < 3)
    //  {
    //     return [];   
    //   }
          return this.OrganizationalEntitiesList.filter(
            customer => 
            {
              return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
            }
          );
        }
        initVehicleCategory(){
          this._generalService.GetVehicleVehicleCategory().subscribe(
            data=>
            {
              this.VehicleCategoryList=data;
              this.filteredVehicleCategoryOptions = this.vehicleCategory.valueChanges.pipe(
                startWith(""),
                map(value => this._filterVehicle(value || ''))
              ); 
            });
        }
        
        private _filterVehicle(value: string): any {
          const filterValue = value.toLowerCase();
    //       if (!value || value.length < 3)
    //  {
    //     return [];   
    //   }
          return this.VehicleCategoryList.filter(
            customer => 
            {
              return customer.vehicleCategory.toLowerCase().indexOf(filterValue)===0;
            }
          );
        }

  refresh() {
    this.locationHub.setValue(''),
    this.vehicleCategory.setValue(''),
    this.city.setValue(''),
    this.searchpickupadate =''
    this.SearchActivationStatus = true;
    this.PageNumber=0;
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
   
    // if(this.StartDate!==""){
    //   this.StartDate=moment(this.StartDate).format('MMM DD yyyy');
    // }
    // if(this.EndDate!==""){
    //   this.EndDate=moment(this.EndDate).format('MMM DD yyyy');
    // }
    if(this.searchpickupadate!==""){
          this.searchpickupadate=moment(this.searchpickupadate).format('MMM DD yyyy');
        }
  
      this.dateWiseCarwiseBookingReportService.getTableData(this.searchpickupadate,
        this.city.value,this.locationHub.value,this.vehicleCategory.value,
       this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: DatewiseCarwiseBookingReport) {
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

  public SearchData()
  {
    this.loadData();
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
        debugger;
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="DateWiseCarwiseBookingReportCreate")
          {
            if(this.MessageArray[1]=="DateWiseCarwiseBookingReportView")
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
          else if(this.MessageArray[0]=="DateWiseCarwiseBookingReportUpdate")
          {
            if(this.MessageArray[1]=="DateWiseCarwiseBookingReportView")
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
          else if(this.MessageArray[0]=="DateWiseCarwiseBookingReportDelete")
          {
            if(this.MessageArray[1]=="DateWiseCarwiseBookingReportView")
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
          else if(this.MessageArray[0]=="DateWiseCarwiseBookingReportAll")
          {
            if(this.MessageArray[1]=="DateWiseCarwiseBookingReportView")
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
    this.dateWiseCarwiseBookingReportService.getTableDataSort(this.searchpickupadate,
      this.city.value,this.locationHub.value,this.vehicleCategory.value,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;     
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




