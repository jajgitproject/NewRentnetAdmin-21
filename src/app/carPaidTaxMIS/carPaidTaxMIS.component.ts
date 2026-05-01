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
// import { FormDialogComponent } from '../carPaidTaxMIS/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
// import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { CarPaidTaxMISService } from './carPaidTaxMIS.service';
import { CarPaidTaxMIS } from './carPaidTaxMIS.model';
import { ActivatedRoute } from '@angular/router';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';
import { RegistrationDropDown } from './registrationDropDown.model';
import moment from 'moment';
import { VehicleCategoryDropDown } from '../general/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
@Component({
  standalone: false,
  selector: 'app-carPaidTaxMIS',
  templateUrl: './carPaidTaxMIS.component.html',
  styleUrls: ['./carPaidTaxMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CarPaidTaxMISComponent implements OnInit {
  displayedColumns = [
    'registrationNumber',
    'vehicle',
    'vehicleCategory',
    'stateName',
    'amount',
    'interStateTaxStartDate',
    'interStateTaxEndDate',
    'paidOn',
    'paidByEmployee',
    'uploadedOn',
    'uploadedByEmployee',
    'interStateTaxImage',
    'status',
    // 'actions'
  ];

  // displayedColumns: string[] = [];
  dataSource: CarPaidTaxMIS[] | null;
  carPaidTaxMISID: number;
  advanceTable: CarPaidTaxMIS | null;
  RegistrationNumber: string = '';
  State: string = '';
  StartDate: string = '';
  EndDate: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  registrationNumber: FormControl = new FormControl();
  filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
  public RegistrationNumberList?: RegistrationDropDown[] = [];
  
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

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public carPaidTaxMISService: CarPaidTaxMISService,
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
    this.GetStates();
    this.initVehicleCategories();
    this.initVehicle();
    this.InitRegistrationNumber();
  }

  GetStates(){
    this._generalService.GetStatesAl().subscribe(
      data =>
      {
        this.StatesList = data;  
        this.filteredStateOptions = this.state.valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        );              
      },
      error=>
      {
    
      }
    );
    }

    private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.StatesList.filter(
      customer =>
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
    }

    // InitRegistrationNumber(){
    //   this._generalService.GetRegistrationForDropDown().subscribe(
    //     data=>
    //     {
    //       this.RegistrationNumberList=data;
    //       this.filteredRegistrationNumberOptions = this.registrationNumber.valueChanges.pipe(
    //         startWith(""),
    //         map(value => this._filterRN(value || ''))
    //       ); 
    //     });
    // }
    
    // private _filterRN(value: string): any {
    //   const filterValue = value.toLowerCase();
    //   return this.RegistrationNumberList.filter(
    //     customer => 
    //     {
    //       return customer.registrationNumber.toLowerCase().indexOf(filterValue)===0;
    //     }
    //   );
    // }

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
    //   if (!value || value.length < 3) {
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
    //   if (!value || value.length < 3) {
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
    //   if (!value || value.length < 3) {
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
    this.registrationNumber.setValue(''),
    this.vehicleCategory.setValue(''),
    this.vehicle.setValue(''),
    this.state.setValue('');
    this.StartDate = '';
    this.EndDate = '';
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
//   this.carPaidTaxMISID = row.id;
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
//   this.carPaidTaxMISID = row.id;
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
    if(this.StartDate!==""){
      this.StartDate=moment(this.StartDate).format('MMM DD yyyy');
    }
    if(this.EndDate!==""){
      this.EndDate=moment(this.EndDate).format('MMM DD yyyy');
    } 
    switch (this.selectedFilter)
    {
      case 'registrationNumber':
        this.registrationNumber.setValue(this.searchTerm);
        break;
      case 'vehicleCategory':
        this.vehicleCategory.setValue(this.searchTerm);
        break;
      case 'vehicle':
        this.vehicle.setValue(this.searchTerm);
          break;
          
      case 'state':
        this.state.setValue(this.searchTerm);
        break;
        case 'startDate':
          this.StartDate = this.searchTerm;
          break;
          case 'endDate':
          this.EndDate = this.searchTerm;
          break;
      default:
        this.searchTerm = '';
        break;
    }
      this.carPaidTaxMISService.getTableData(this.registrationNumber.value || this.RegistrationNumber,
        this.vehicleCategory.value || this.VehicleCategory,
        this.vehicle.value|| this.Vehicle,
        this.state.value || this.State,this.StartDate,this.EndDate,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CarPaidTaxMIS) {
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
        
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="CarPaidTaxMISCreate")
          {
            if(this.MessageArray[1]=="CarPaidTaxMISView")
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
          else if(this.MessageArray[0]=="CarPaidTaxMISUpdate")
          {
            if(this.MessageArray[1]=="CarPaidTaxMISView")
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
          else if(this.MessageArray[0]=="CarPaidTaxMISDelete")
          {
            if(this.MessageArray[1]=="CarPaidTaxMISView")
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
          else if(this.MessageArray[0]=="CarPaidTaxMISAll")
          {
            if(this.MessageArray[1]=="CarPaidTaxMISView")
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
    this.carPaidTaxMISService.getTableDataSort(this.RegistrationNumber,
      this.VehicleCategory,
      this.Vehicle,
      this.state.value,
      this.StartDate,
      this.EndDate,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;     
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




