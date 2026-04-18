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
// import { FormDialogComponent } from '../carUtilizationMIS/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
// import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { CarUtilizationMISService } from './carUtilizationMIS.service';
import { CarUtilizationMIS } from './carUtilizationMIS.model';
import { ActivatedRoute } from '@angular/router';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';

import moment from 'moment';
import { VehicleCategoryDropDown } from '../general/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { RegistrationDropDown } from '../interstateTaxEntry/registrationDropDown.model';
@Component({
  standalone: false,
  selector: 'app-carUtilizationMIS',
  templateUrl: './carUtilizationMIS.component.html',
  styleUrls: ['./carUtilizationMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CarUtilizationMISComponent implements OnInit {
   // Display columns that correspond to the model properties
   displayedColumns = [
    'reservationID',
    'registrationNumber',
    'vehicle',
    'driverName',
    'customerName',
    'guestName',
    'openDate',
    'serviceLocation',
    'carLocation',
    'dutySlipID',
    'ownedSupplier',
    'supplierName',
    'supplierType',
    
  ];

  columnTitleMap: { [key: string]: string } = {
    reservationID: 'Booking No.',
    dutySlipNo: 'Duty Slip No',
    registrationNumber: 'Reg. Number',
    openDate: 'Open Date',
    driverName: 'Driver',
    carLocation: 'Car Location',
    vehicle: 'Vehicle',
    ownedSupplier: 'OwnerShip',
    locationHub: 'Location Hub',
    customerName: 'Customer',
    dutySlipID: 'Duty Slip No',
    supplierName: 'Supplier',
    supplierType: 'Supplier Type',
    guestName: 'Guest',
    serviceLocation: 'Service Location',
    actions: 'Actions',
  };
  
  // displayedColumns: string[] = [];
  dataSource: CarUtilizationMIS[] | null;
  carUtilizationMISID: number;
  advanceTable: CarUtilizationMIS | null;
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
  VehicleCategory: string = '';
  Vehicle: string = '';
  Inventory: string = '';
  // FromDate: string = '';
  // ToDate: string = '';
  DispatchLocation: string = '';

  searchFromDate: string = '';
  searchToDate: string = '';
  searchcarLocation: string = '';
  searchcarType: string = '';
  searchcarNumber: string = '';
  searchownedSupplier: string = '';
  openDate: string = '';
  status: string = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public carUtilizationMISService: CarUtilizationMISService,
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
    this.InitRegistrationNumber();
    this.InitLocationHub();
    this.initVehicle();
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
      if (!value || value.length < 3) {
        return [];   
      }
      return this.DispatchLocationList.filter(
        customer =>
        {
          return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
        }
      );
      }

      InitRegistrationNumber(){
        this._generalService.GetRegistrationForDropDown().subscribe(
          data=>
          {
            this.RegistrationNumberList=data;
            console.log(this.RegistrationNumberList);
            this.filteredRegistrationNumberOptions = this.registrationNumber.valueChanges.pipe(
              startWith(""),
              map(value => this._filterRNs(value || ''))
            ); 
          });
      }
      
      private _filterRNs(value: string): any {
        const filterValue = value.toLowerCase();
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

       InitLocationHub(){
          this._generalService.GetLocationHub().subscribe(
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

  refresh() {
    this.locationHub.setValue(''),
    this.vehicle.setValue(''),
    this.registrationNumber.setValue(''),
    this.openDate = '';
    this.status = '';
    this.searchownedSupplier = '';
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
//   this.carUtilizationMISID = row.id;
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
//   this.carUtilizationMISID = row.id;
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

  onStatusChange(selectedStatus: string) {
    this.status = selectedStatus;
    // this.fetchDataBasedOnStatus();
  }

   public loadData() 
   {
   
    // if(this.StartDate!==""){
    //   this.StartDate=moment(this.StartDate).format('MMM DD yyyy');
    // }
    // if(this.EndDate!==""){
    //   this.EndDate=moment(this.EndDate).format('MMM DD yyyy');
    // }
    if(this.openDate!==""){
          this.openDate=moment(this.openDate).format('MMM DD yyyy');
        }
    switch (this.selectedFilter)
    { 
      case 'carLocation':
      this.locationHub.setValue(this.searchTerm);
      break;
      case 'vehicle':
        this.vehicle.setValue(this.searchTerm);
          break;
        case 'carNumber':
          this.registrationNumber.setValue(this.searchTerm);
          break;
          case 'openDate':
          this.openDate = this.searchTerm;
          break;
          case 'status':
          this.status = this.searchTerm;
          break;
      default:
        this.searchTerm = '';
        break;
    }
      this.carUtilizationMISService.getTableData(this.locationHub.value,
        this.vehicle.value|| this.Vehicle,this.registrationNumber.value,this.searchownedSupplier,this.openDate,this.status,
       this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CarUtilizationMIS) {
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
          if(this.MessageArray[0]=="CarUtilizationMISCreate")
          {
            if(this.MessageArray[1]=="CarUtilizationMISView")
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
          else if(this.MessageArray[0]=="CarUtilizationMISUpdate")
          {
            if(this.MessageArray[1]=="CarUtilizationMISView")
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
          else if(this.MessageArray[0]=="CarUtilizationMISDelete")
          {
            if(this.MessageArray[1]=="CarUtilizationMISView")
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
          else if(this.MessageArray[0]=="CarUtilizationMISAll")
          {
            if(this.MessageArray[1]=="CarUtilizationMISView")
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
    this.carUtilizationMISService.getTableDataSort(this.locationHub.value,
      this.vehicle.value,this.registrationNumber.value,this.searchownedSupplier,this.openDate,this.status,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;     
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




