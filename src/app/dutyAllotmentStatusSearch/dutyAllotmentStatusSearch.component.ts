// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
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
// import { FormDialogComponent } from '../dutyAllotmentStatusSearch/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
// import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DutyAllotmentStatusSearchService } from './dutyAllotmentStatusSearch.service';
// import { DutyAllotmentStatusSearch } from './dutyAllotmentStatusSearch.model';
import { ActivatedRoute } from '@angular/router';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';

import moment from 'moment';
import { VehicleCategoryDropDown } from '../general/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { RegistrationDropDown } from '../interstateTaxEntry/registrationDropDown.model';
import {DutyAllotmentStatusSearch } from './dutyAllotmentStatusSearch.model';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
@Component({
  standalone: false,
  selector: 'app-dutyAllotmentStatusSearch',
  templateUrl: './dutyAllotmentStatusSearch.component.html',
  styleUrls: ['./dutyAllotmentStatusSearch.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyAllotmentStatusSearchComponent implements OnInit {
   // Display columns that correspond to the model properties
   displayedColumns = [
    'location',
    'slotName',
    'dispatched',
    'assigned',
    'notAssigned',
    'grandTotal',
    'smsSent',
    'smsNotSent',
    
  ];

  columnTitleMap: { [key: string]: string } = {
    location: 'Location',
    slotName: 'Slot',
    dispatched: 'Dispatched',
    assigned: 'Assigned',
    notAssigned: 'Not Assigned',
    grandTotal: 'Grand Total',
    smsSent: 'SMS Sent',
    smsNotSent: 'SMS Not Sent',
    actions: 'Actions',
  };
  advanceTableForm:FormGroup;
  // displayedColumns: string[] = [];
  dataSource:DutyAllotmentStatusSearch[] | null;
  dutyAllotmentStatusSearchID: number;
  advanceTable:DutyAllotmentStatusSearch | null;
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
  searchForm: FormGroup;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  Vehicle: string = '';
  searchvehicle: string = '';
  searchcity: string = '';
  searchlocation: string = '';
  searchpickupadate:string = '';
  searchPickupTime:string = '';
  searchvehicleCategory: string = '';
  Inventory: string = '';
  // FromDate: string = '';
  // ToDate: string = '';
  DispatchLocation: string = '';
  pickupDate: string;
  locationID: number=0;
  // CustomerAddressID:number=0;

  // vehicleCategory: string = '';
  isSearchPerformed: boolean = false;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyAllotmentStatusSearchService: DutyAllotmentStatusSearchService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    public _generalService: GeneralService,
    private fb: FormBuilder,
    
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
@ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  
  ngOnInit() {
    this.searchForm = this.fb.group({
      searchpickupadate: [null, Validators.required],
      locationHub: [null, Validators.required],
      // SearchActivationStatus: [true, Validators.required],
    });
    this.SubscribeUpdateService();
    this.initLocationHub();
   
  }

    initDispatchLocation(){
      this._generalService.GetLocationHub().subscribe(
        data =>
        {
          this.DispatchLocationList = data;  
          console.log(this.DispatchLocationList)
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
        return this.CityList.filter(
          customer =>
          {
            return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
          }
        );
      }
       initLocationHub(){
          this._generalService.GetLocation().subscribe(
            data=>
            {
              this.OrganizationalEntitiesList=data;
              console.log(this.OrganizationalEntitiesList);
              this.filteredOrganizationalEntityOptions = this.searchForm.controls['locationHub'].valueChanges.pipe(
                startWith(""),
                map(value => this._filterOrganizationalsEntity(value || ''))
              ); 
            });
        }
        
        private _filterOrganizationalsEntity(value: string): any {
          console.log(value);
          const filterValue = value?.toLowerCase() || '';
    //       if (!value || value.length < 3)
    //  {
    //     return [];   
    //   }
          return this.OrganizationalEntitiesList.filter(
            customer => 
            {
              return customer.organizationalEntityName.toLowerCase().includes(filterValue);
            }
          );
        }
        
        onOptionSelected(event: any) {
          this.locationID = event.option.value.organizationalEntityID;
          this.searchForm.controls['locationHub'].setValue(event.option.value.organizationalEntityName);
        }
        
        // Method to get location name by locationID
  getLocationNameById(locationID: number): string {
    const location = this.OrganizationalEntitiesList.find(entity => entity.organizationalEntityID === locationID);
    return location ? location.organizationalEntityName : 'N/A';
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
          return this.VehicleCategoryList.filter(
            customer => 
            {
              return customer.vehicleCategory.toLowerCase().includes(filterValue);
            }
          );
        }

  refresh() {
    this.locationID = null; // Ensure locationID is reset if needed
    this.locationHub.setValue('');
    this.initLocationHub();
    this.searchpickupadate ='',
    this.searchTerm = '';
    this.selectedFilter = 'search';
     this.loadData();
     this.searchForm.reset();
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
 
    if(this.searchForm.value.searchpickupadate!==""){
          this.searchpickupadate=moment(this.searchForm.value.searchpickupadate).format('MMM DD yyyy');
        }
        // if(this.searchPickupTime!==""){
        //   this.searchPickupTime=moment(this.searchForm.value.searchPickupTime).format('MMM DD yyyy');
        // }
  
      this.dutyAllotmentStatusSearchService.getTableData(this.searchpickupadate,
        this.locationID,
      ).subscribe
      (
        data =>   
        {
          this.dataSource = data?.slots; 
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
  onContextMenu(event: MouseEvent, item:DutyAllotmentStatusSearch) {
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
        debugger;
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="DutyAllotmentStatusSearchCreate")
          {
            if(this.MessageArray[1]=="DutyAllotmentStatusSearchView")
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
          else if(this.MessageArray[0]=="DutyAllotmentStatusSearchUpdate")
          {
            if(this.MessageArray[1]=="DutyAllotmentStatusSearchView")
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
          else if(this.MessageArray[0]=="DutyAllotmentStatusSearchDelete")
          {
            if(this.MessageArray[1]=="DutyAllotmentStatusSearchView")
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
          else if(this.MessageArray[0]=="DutyAllotmentStatusSearchAll")
          {
            if(this.MessageArray[1]=="DutyAllotmentStatusSearchView")
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
    this.dutyAllotmentStatusSearchService.getTableDataSort(this.searchpickupadate,
      this.locationHub.value,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;     
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }



  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}




