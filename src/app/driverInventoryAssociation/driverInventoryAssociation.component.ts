// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DriverInventoryAssociationService } from './driverInventoryAssociation.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DriverInventoryAssociation } from './driverInventoryAssociation.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { FormBuilder, FormControl } from '@angular/forms';
import moment from 'moment';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { ActivatedRoute } from '@angular/router';
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleVehicleCategoryDropDown } from '../vehicle/vehicleVehicleCategoryDropDown.model';

@Component({
  standalone: false,
  selector: 'app-driverInventoryAssociation',
  templateUrl: './driverInventoryAssociation.component.html',
  styleUrls: ['./driverInventoryAssociation.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverInventoryAssociationComponent implements OnInit {
  displayedColumns = [
    'driverName',
    'registrationNumber',
    'vehicle',
    'vehicleCategory',
    'driverInventoryAssociationStartDate',
    'driverInventoryAssociationEndDate',
    'driverInventoryAssociationStatus',
    'status',
    'actions'
  ];
  
  dataSource: DriverInventoryAssociation[] | null;
  driverInventoryAssociationID: number;
  advanceTable: DriverInventoryAssociation | null;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();

  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];

  filteredDriverOptions:Observable<DriverDropDown[]>;
  public DriverList?:DriverDropDown[]=[];
  filteredInventoryOptions:Observable<VehicleDropDown[]>;
  public InventoryList:VehicleDropDown[]=[];
  
  searchDriverName:string='';
  driver : FormControl=new FormControl();
  
  searchInventoryName:string="";
  inventory : FormControl=new FormControl();
  searchVehicle:string="";
  vehicle : FormControl=new FormControl();
  searchVehicleCategory:string="";
  vehicleCategory : FormControl=new FormControl();

  searchendDate: string = '';
  endDate : FormControl = new FormControl();

  searchstartDate: string = '';
  startDate : FormControl = new FormControl();

  searchAssociationStatus:boolean=true;
  searchActivationStatus : boolean=true;
  activeData: string;
  inventoryID: any;
  driverID: any;
  driverName: any;

  advanceTableForm = this.fb.group({
    inventoryID: [''],
    vehicleNameID: [''],
    vehicleCategoryID: ['']
    })
  vehicleNameID: any;
  vehicleCategoryID: any;
  vehicleID: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  RegNo: any;
  Vehicle: any;
  VehicleCategory: any;
  RedirectingFrom: any;
  SupplierName: any;
  DriverPhone: any;
  Supplier: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public driverInventoryAssociationService: DriverInventoryAssociationService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    private fb: FormBuilder,
    public route:ActivatedRoute,
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      //this.driverID   = paramsData.DriverID;
       //this.driverName=paramsData.DriverName;
      //  this.RedirectingFrom = paramsData.redirectingFrom;
      //  this.SupplierName = paramsData.SupplierName;
      //  this.DriverPhone = paramsData.DriverPhone;
      //  this.vehicleID = paramsData.InventoryID;
      //  this.RegNo = paramsData.RegNo;
      //  this.Vehicle = paramsData.Vehicle;
      //  this.VehicleCategory = paramsData.VehicleCategory;
      //  this.SupplierName = paramsData.SupplierName;


      // Decrypt the parameters if they exist For Driver
      const encryptedDriverID = paramsData.DriverID;
      const encryptedDriverName = paramsData.DriverName;
      const encryptedDriverPhone = paramsData.DriverPhone;
      const encryptedSupplier = paramsData.supplierName;
      const encryptedRedirectingFrom = paramsData.redirectingFrom;

if (encryptedDriverID && encryptedDriverName && encryptedRedirectingFrom && encryptedDriverPhone && encryptedSupplier)
{
  this.driverID = this._generalService.decrypt(decodeURIComponent(encryptedDriverID));
  this.driverName = this._generalService.decrypt(decodeURIComponent(encryptedDriverName));
  this.DriverPhone = this._generalService.decrypt(decodeURIComponent(encryptedDriverPhone));
  this.RedirectingFrom = this._generalService.decrypt(decodeURIComponent(encryptedRedirectingFrom));
  this.Supplier = this._generalService.decrypt(decodeURIComponent(encryptedSupplier));
}

  // Decrypt the parameters if they exist For Inventory
const encryptedVehicleID = paramsData.InventoryID;
const encryptedRegNo = paramsData.RegNo;
const encryptedVehicle = paramsData.Vehicle;
const encryptedVehicleCategory = paramsData.VehicleCategory;
const encryptedSupplierName = paramsData.SupplierName;

if (encryptedVehicleID && encryptedRegNo && encryptedRedirectingFrom && encryptedVehicle && encryptedVehicleCategory && encryptedSupplierName ) 
{
  this.vehicleID = (this._generalService.decrypt(decodeURIComponent(encryptedVehicleID)));
  this.RegNo = this._generalService.decrypt(decodeURIComponent(encryptedRegNo));
  this.Vehicle = this._generalService.decrypt(decodeURIComponent(encryptedVehicle));
  this.VehicleCategory = this._generalService.decrypt(decodeURIComponent(encryptedVehicleCategory));
  this.RedirectingFrom = this._generalService.decrypt(decodeURIComponent(encryptedRedirectingFrom));
  this.SupplierName = this._generalService.decrypt(decodeURIComponent(encryptedSupplierName));
}

    });

   
    this.loadData();
    this.initDriver();
    this.initVehicle();
    this.initVehicleCategory();
    this.initInventory();
    this.SubscribeUpdateService();
  }
  
  refresh() {
    this.driver.setValue('');
    this.inventory.setValue('');
    this.vehicle.setValue('');
    this.vehicleCategory.setValue('');
    this.searchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

//-------Driver-------
  initDriver(){
    this._generalService.GetDriver().subscribe(
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
    if (filterValue.length < 3) {
      return [];
    }
    return this.DriverList.filter(
      customer => 
      {
        return customer.driverName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

//-------Vehicle-------
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
    if (filterValue.length < 3) {
      return [];
    }
    return this.VehicleList.filter(
      customer => 
      {
        return customer.vehicle.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  //-----VehicleCategory-------
  initVehicleCategory(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.filteredVehicleCategoryOptions = this.vehicleCategory.valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicleCategory(value || ''))
        ); 
      });
  }
  private _filterVehicleCategory(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.VehicleCategoryList.filter(
      customer => 
      {
        return customer.vehicleCategory.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  //----Registration Number----
  initInventory(){
    this._generalService.GetInventoryForDropDown().subscribe(
      data=>
      {
        this.InventoryList=data;
        this.filteredInventoryOptions = this.inventory.valueChanges.pipe(
          startWith(""),
          map(value => this._filterInventory(value || ''))
        ); 
      });
  }
  private _filterInventory(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.InventoryList.filter(
      customer => 
      {
        return customer.vehicle.toLowerCase().includes(filterValue);
        // return customer.vehicle.indexOf(filterValue)===0;
      }
    );
  }

  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          driverID: this.driverID,
          driverName :this.driverName,
          regno : this.RegNo,
          vehicleID : this.vehicleID,
          vehicle : this.Vehicle,
          vehicleCategory : this.VehicleCategory,
          redirectingFrom : this.RedirectingFrom,
          supplierName: this.SupplierName,
          driverPhone:this.DriverPhone,
          supplier:this.Supplier
        }
    });
  }

  editCall(row) {
    //  alert(row.id);
  this.driverInventoryAssociationID = row.driverInventoryAssociationID;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit',
      driverID: this.driverID,
      driverName :this.driverName,
      regno : this.RegNo,
      vehicleID : this.vehicleID,
      vehicle : this.Vehicle,
      vehicleCategory : this.VehicleCategory,
      redirectingFrom : this.RedirectingFrom,
      supplierName: this.SupplierName,
      driverPhone:this.DriverPhone,
      supplier:this.Supplier
    }
  });

}
deleteItem(row)
{

  this.driverInventoryAssociationID = row.id;
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

public SearchData()
{

  //this.searchDriverName='';
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
  debugger;
  if(this.driverID===undefined)
  {
    this.driverID=0;
  }
  if(this.vehicleID===undefined)
  {
    this.vehicleID=0;
  }
  // if(this.searchInventoryName!==""){
  //   this.searchInventoryName=this.searchInventoryName.split('-')[0]

  // }
  switch (this.selectedFilter)
    {
      case 'driver':
        this.driver.setValue(this.searchTerm);
        break;
      case 'vehicle':
        this.vehicle.setValue(this.searchTerm);
        break;
      case 'registrationNumber':
        this.inventory.setValue(this.searchTerm);
        break;
      case 'vehicleCategory':
        this.vehicleCategory.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
   this.driverInventoryAssociationService.getDriverInventoryData(this.driverID,this.driver.value,this.vehicleID,this.vehicle.value,this.inventory.value,this.vehicleCategory.value,this.searchActivationStatus, this.PageNumber).subscribe
    
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
  onContextMenu(event: MouseEvent, item: DriverInventoryAssociation) {
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
          if(this.MessageArray[0]=="DriverInventoryAssociationCreate")
          {
            if(this.MessageArray[1]=="DriverInventoryAssociationView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Driver Inventory Association Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverInventoryAssociationUpdate")
          {
            if(this.MessageArray[1]=="DriverInventoryAssociationView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Driver Inventory Association Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverInventoryAssociationDelete")
          {
            if(this.MessageArray[1]=="DriverInventoryAssociationView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Driver Inventory Association Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverInventoryAssociationAll")
          {
            if(this.MessageArray[1]=="DriverInventoryAssociationView")
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
    if(this.driverID===undefined)
  {
    this.driverID=0;
  }
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.driverInventoryAssociationService.getTableDataSort(this.driverID,this.searchDriverName,this.searchVehicle,this.searchInventoryName,this.searchVehicleCategory,this.searchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}


