// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InventoryStatusHistoryService } from './inventoryStatusHistory.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InventoryStatusHistory } from './inventoryStatusHistory.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from '../supplierRateCard/supplierRateCardDropDown.model';
@Component({
  standalone: false,
  selector: 'app-inventoryStatusHistory',
  templateUrl: './inventoryStatusHistory.component.html',
  styleUrls: ['./inventoryStatusHistory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InventoryStatusHistoryComponent implements OnInit {
  displayedColumns = [
    'vehicle',
    'inventoryStatus',
    'statusReason',
    'supportingDocImage',
    'actions'

  ];
  dataSource: InventoryStatusHistory[] | null;
  inventoryStatusHistoryID: number;
  advanceTable: InventoryStatusHistory | null;
  SearchstatusReason: string = '';
  Searchstatus: string = '';
  searchInventoryStatus: string = '';
  SearchsupportingDocImage: string = '';
  SearchInventoryID:number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  statusReason : FormControl = new FormControl();
  supportingDocImage : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplier_ID: any;
  supplier_Name: any;
  public CityList?: CitiesDropDown[] = [];
  public RateList?: SupplierRateCardDropDown[] = [];
  inventoryID: any;
  registrationNumber: any;
  vehicleCategoryID: any;
  vehicleID: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  vehicle!: string;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public inventoryStatusHistoryService: InventoryStatusHistoryService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      // this.inventoryID = paramsData.InventoryID;
      // this.registrationNumber = paramsData.RegNo;
      // this.vehicleCategoryID = paramsData.VehicleCategoryID;
      // this.vehicle = paramsData.vechicleName;
      // this.vehicleID=paramsData.vehicleID;
      const encryptedInventoryID = paramsData.InventoryID;
const encryptedRegNo = paramsData.RegNo;
const encryptedVehicleCategoryID = paramsData.VehicleCategoryID;
const encryptedVehicleName = paramsData.vechicleName;
const encryptedVehicleID = paramsData.vehicleID;

if (encryptedInventoryID && encryptedRegNo) {
  this.inventoryID = this._generalService.decrypt(decodeURIComponent(encryptedInventoryID));
  this.registrationNumber = this._generalService.decrypt(decodeURIComponent(encryptedRegNo));
}

if (encryptedVehicleCategoryID && encryptedVehicleName && encryptedVehicleID) {
  this.vehicleCategoryID = this._generalService.decrypt(decodeURIComponent(encryptedVehicleCategoryID));
  this.vehicle = this._generalService.decrypt(decodeURIComponent(encryptedVehicleName));
  this.vehicleID = this._generalService.decrypt(decodeURIComponent(encryptedVehicleID));
}


    })
    this.InitCities()
    this.initRate();
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchstatusReason = '';
    this.searchInventoryStatus = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
      });
  }

  public SearchData()
  {
    this.loadData();    
  }
  addNew()
  {
    this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          inventoryID: this.inventoryID,
          registrationNumber: this.registrationNumber,
          vechicleName: this.vehicle,
          vehicleID:this.vehicleID,
        }
    });
  }
  editCall(row) {
    this.inventoryStatusHistoryID = row.inventoryStatusHistoryID;
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        inventoryID: this.inventoryID,
        registrationNumber: this.registrationNumber,
        vehicleID:this.vehicleID,
        vechicleName: this.vehicle
      }
    });
  }
  deleteItem(row)
  {

    this.inventoryStatusHistoryID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
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
    switch (this.selectedFilter)
    {
      case 'statusReason':
        this.SearchstatusReason = this.searchTerm;
        break;
      case 'status':
        this.searchInventoryStatus = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.inventoryStatusHistoryService.getTableData(this.inventoryID,this.SearchstatusReason,this.searchInventoryStatus,this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    )
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: InventoryStatusHistory) {
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

/////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
  this.response = event;
  this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  }

  initRate(){
    this._generalService.GetRateList().subscribe(
      data=>
      {
        this.RateList=data;
      });
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
          if(this.MessageArray[0]=="InventoryStatusHistoryCreate")
          {
            if(this.MessageArray[1]=="InventoryStatusHistoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Inventory Status History Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryStatusHistoryUpdate")
          {
            if(this.MessageArray[1]=="InventoryStatusHistoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Inventory Status History Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryStatusHistoryDelete")
          {
            if(this.MessageArray[1]=="InventoryStatusHistoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Inventory Status History Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryStatusHistoryAll")
          {
            if(this.MessageArray[1]=="InventoryStatusHistoryView")
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
    this.inventoryStatusHistoryService.getTableDataSort(this.inventoryID,this.SearchstatusReason,this.searchInventoryStatus,this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



