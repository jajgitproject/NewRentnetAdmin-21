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
// import { FormDialogComponent } from '../appDutyMIS/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
// import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { AppDutyMISService } from './appDutyMIS.service';
import { AppDutyMIS } from './appDutyMIS.model';
import { ActivatedRoute } from '@angular/router';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';

import moment from 'moment';
import { VehicleCategoryDropDown } from '../general/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
@Component({
  standalone: false,
  selector: 'app-appDutyMIS',
  templateUrl: './appDutyMIS.component.html',
  styleUrls: ['./appDutyMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AppDutyMISComponent implements OnInit {
  displayedColumns = [
    'reservationID',
    'dutySlipID',
    'registrationNumber',
    'dutyDate',
    'dispatch_Location',
    'driverName',
    'customerName',
    'app_GaragetoStart_KM',
    'app_PicktoEnd_KM',
    'app_EndtoGarage_KM',
    'location_out_km',
    'reporting_km',
    'releasing_km',
    'location_in_Km',
    'locationOutTimeByApp',
    'reportingToGuestTimeByApp',
    'dropOffTimeByApp',
    'locationInTimeByApp',
    'locationOutAddressStringByApp',
    'pickUpAddressStringByApp',
    'dropOffAddressStringByApp',
    'locationInAddressStringByApp',
    'appVersion',
    'mobile1',
    'deviceModel',
    'tripStatus',
    'dispatchMethod',
    'dutyGoingOn',
    'supplierType',
    'supplierName',
    'customerGroup',
    'packageType',
    'carBooked',
    'bookingType',
    'customerSignatureImage',
    // 'activationStatus'
  ];

  columnTitleMap: { [key: string]: string } = {
    reservationID: 'Booking No.',
    dutySlipID: 'Duty Slip No',
    registrationNumber: 'Car No ',
    dutyDate: 'Duty Date',
    dispatch_Location: 'Dispatch Location',
    driverName: 'Driver Name',
    customerName: 'Customer Name',
    app_GaragetoStart_KM: 'G Start km..',
    app_PicktoEnd_KM: 'Pick End km..',
    app_EndtoGarage_KM: 'End Garage km..',
    location_out_km: 'Loc Out km..',
    reporting_km: 'Rpt km..',
    releasing_km: 'Rel km..',
    location_in_Km: 'Loc In km.',
    locationOutTimeByApp: 'Loc Out Time',
    reportingToGuestTimeByApp: 'Rpt to Guest Time',
    dropOffTimeByApp: 'Drop Off Time',
    locationInTimeByApp: 'Loc In Time',
    locationOutAddressStringByApp: 'Loc Out Add..',
    pickUpAddressStringByApp: 'Pick Up Add..',
    dropOffAddressStringByApp: 'Drop Off Add..',
    locationInAddressStringByApp: 'Loc In Add..',
    appVersion: 'App Ver..',
    mobile1: 'Mobile',
    deviceModel: 'Device Model',
    tripStatus: 'Trip Status',
    dispatchMethod: 'Dispatch Me..',
    dutyGoingOn: 'Duty Going On',
    supplierType: 'Type of Supplier',
    supplierName: 'Supplier Name',
    customerGroup: 'Customer Group',
    packageType: 'Package Type',
    carBooked: 'Car Booked',
    bookingType: 'Booking Type',
    customerSignatureImage: 'Sig Image',
    actions: 'Actions',
  };
  
  // displayedColumns: string[] = [];
  dataSource: AppDutyMIS[] | null;
  appDutyMISID: number;
  advanceTable: AppDutyMIS | null;
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

  SearchVehicle:string='';
  vehicle:FormControl=new FormControl();
  searchInventory: string = '';
  
  inventoryID: any;
  redirectingFrom: any;
  StateID: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  VehicleCategory: string = '';
  Vehicle: string = '';
  Inventory: string = '';
  // FromDate: string = '';
  // ToDate: string = '';
  DispatchLocation: string = '';

  searchFromDate: string = '';
  searchToDate: string = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public appDutyMISService: AppDutyMISService,
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
    this.SubscribeUpdateService();
    this.initDispatchLocation();
  }

    // initdispatchLocation(){
    //   this._generalService.GetLocationHub().subscribe(
    //     data=>
    //     {
    //       this.DispatchLocationList=data;
    //       console.log(this.DispatchLocationList);
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
    //   if (!value || value.length < 3) {
    //   return [];   
    // }
      return this.DispatchLocationList.filter(
        customer =>
        {
          return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
        }
      );
      }

  refresh() {

    this.searchFromDate = '';
    this.searchToDate = '';
   this.dispatch_Location.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

//   addNew()
//   {
//     const dialogRef = this.dialog.open(FormDialogComponent, 
//     {
//       data: 
//         {
//           advanceTable: this.advanceTable,
//           action: 'add',
//           inventoryID:this.inventoryID,
//           registrationNumber:this.RegistrationNumber,
//           redirectedFrom:this.redirectingFrom,
//           StateID:this.StateID,
//           State:this.State
//         }
//     });
//   }

//   editCall(row) {
//     //  alert(row.id);
//   this.appDutyMISID = row.id;
//   const dialogRef = this.dialog.open(FormDialogComponent, {
//     data: {
//       advanceTable: row,
//       action: 'edit',
//       inventoryID:this.inventoryID,
//       registrationNumber:this.RegistrationNumber,
//       redirectedFrom:this.redirectingFrom,
//       StateID:this.StateID,
//       State:this.State
//     }
//   });

// }
// deleteItem(row)
// {
//   this.appDutyMISID = row.id;
//   const dialogRef = this.dialog.open(DeleteDialogComponent, 
//   {
//     data: row
//   });
// }

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
    if(this.searchFromDate!==""){
          this.searchFromDate=moment(this.searchFromDate).format('MMM DD yyyy');
        }
        if(this.searchToDate!==""){
          this.searchToDate=moment(this.searchToDate).format('MMM DD yyyy');
        } 
    switch (this.selectedFilter)
    {
      case 'organizationalEntityName':
        this.dispatch_Location.setValue(this.searchTerm);
        break;
        case 'fromDate':
          this.FromDate = this.searchTerm;
          break;
          case 'toDate':
          this.ToDate = this.searchTerm;
          break;
      default:
        this.searchTerm = '';
        break;
    }
      this.appDutyMISService.getTableData(this.searchFromDate,
        this.searchToDate,
        this.dispatch_Location.value,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: AppDutyMIS) {
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
          if(this.MessageArray[0]=="AppDutyMISCreate")
          {
            if(this.MessageArray[1]=="AppDutyMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Car Paid Tax MIS  Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AppDutyMISUpdate")
          {
            if(this.MessageArray[1]=="AppDutyMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Car Paid Tax MIS Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AppDutyMISDelete")
          {
            if(this.MessageArray[1]=="AppDutyMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Car Paid Tax MIS  Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AppDutyMISAll")
          {
            if(this.MessageArray[1]=="AppDutyMISView")
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
    this.appDutyMISService.getTableDataSort(this.searchFromDate,
       this.searchToDate,
       this.dispatch_Location.value,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;     
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




