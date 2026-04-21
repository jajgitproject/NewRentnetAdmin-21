// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VehicleInterStateTaxService } from './vehicleInterStateTax.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VehicleInterStateTax } from './vehicleInterStateTax.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
import moment from 'moment';
import { StateDropDown } from '../state/stateDropDown.model';
import { RegistrationDropDown } from '../interstateTaxEntry/registrationDropDown.model';
@Component({
  standalone: false,
  selector: 'app-vehicleInterStateTax',
  templateUrl: './vehicleInterStateTax.component.html',
  styleUrls: ['./vehicleInterStateTax.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VehicleInterStateTaxComponent implements OnInit {
  
  dataSource: VehicleInterStateTax[] | null;
  inventoryInterStateTaxID: number;
  InventoryInterStateTaxID: number=0;
  advanceTable: VehicleInterStateTax | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  state : FormControl = new FormControl();
  registrationNumber : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  inventoryID: number;
  regNo: any;

  SearchStartDate: string = '';
  startDate : FormControl = new FormControl();

  SearchEndDate: string = '';
  endDate : FormControl = new FormControl();
  redirectingFrom: any;
  StateID: any;
  StateName: any;
  displayedColumns: any;

  public StateList?: StateDropDown[] = [];
  filteredStateOptions: Observable<StateDropDown[]>;

  public InventoryList?: RegistrationDropDown[] = [];
  filteredRegistrationOptions: Observable<RegistrationDropDown[]>;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public vehicleInterStateTaxService: VehicleInterStateTaxService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      this.inventoryID=paramsData.InventoryID;
      this.regNo=paramsData.RegNo;
      this.redirectingFrom=paramsData.redirectingFrom;
      this.StateID=paramsData.StateID;
      this.StateName=paramsData.StateName;      
    });
    
    this.InitState();
    this.InitInventory();
    this.loadData();
    this.displayedColumns = this.getDisplayedColumns();
    this.SubscribeUpdateService();
  }

  getDisplayedColumns(): string[] {
    if (this.redirectingFrom === 'Inventory') {
      return ['geoPoint.GeoPointName', 'interStateTaxAmount', 'interStateTaxStartDate','interStateTaxEndDate', 'interStateTaxImage', 'status', 'actions'];
    }  
    if (this.redirectingFrom === 'State') {
      return ['registrationNumber', 'interStateTaxAmount', 'interStateTaxStartDate','interStateTaxEndDate', 'interStateTaxImage', 'status', 'actions'];
    }
    if (!this.redirectingFrom) {
      return ['geoPoint.GeoPointName','registrationNumber', 'interStateTaxAmount','interStateTaxEndDate', 'interStateTaxStartDate', 'interStateTaxImage', 'status', 'actions'];
    }
    // Add more conditions as needed
    return [];
  }


  refresh() {
    this.InventoryInterStateTaxID = 0;
    this.SearchStartDate='';
    this.SearchEndDate='';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  InitState() {
    this._generalService.getStateForInterstateTax().subscribe(
      data => {
        this.StateList = data;
        this.filteredStateOptions = this.state.valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        );
      },
      error => {

      }
    );
  }
 private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    return this.StateList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  InitInventory() {
    this._generalService.GetRegistrationForDropDown().subscribe(
      data => {
        this.InventoryList = data;
        this.filteredRegistrationOptions = this.registrationNumber.valueChanges.pipe(
          startWith(""),
          map(value => this._filterInventory(value || ''))
        );
      },
      error => {

      }
    );
  }
 private _filterInventory(value: string): any {
    const filterValue = value.toLowerCase();
    return this.InventoryList.filter(
      customer => 
      {
        return customer.registrationNumber.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  public SearchData()
  {
    this.loadData();    
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          InventoryID:this.inventoryID,
          RegNo:this.regNo,
          RedirectingFrom:this.redirectingFrom,
          StateID:this.StateID,
          StateName:this.StateName,
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.inventoryInterStateTaxID = row.inventoryInterStateTaxID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        InventoryID:this.inventoryID,
        RegNo:this.regNo,
        RedirectingFrom:this.redirectingFrom,
        StateID:this.StateID,
        StateName:this.StateName,
      }
    });

  }
  deleteItem(row)
  {

    this.inventoryInterStateTaxID = row.id;
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
   public loadData() 
   {
    debugger;
    if(this.SearchStartDate!==""){
      this.SearchStartDate=moment(this.SearchStartDate).format('MMM DD yyyy');
    }
    if(this.SearchEndDate!==""){
      this.SearchEndDate=moment(this.SearchEndDate).format('MMM DD yyyy');
    }  
    if(this.inventoryID===null || this.inventoryID === undefined)
      {
        this.inventoryID=0
      }
    if(this.StateID===null || this.StateID === undefined)
      {
        this.StateID=0
      }
      this.vehicleInterStateTaxService.getTableData(this.InventoryInterStateTaxID,this.registrationNumber.value,this.state.value,this.inventoryID,this.StateID,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        this.dataSource.forEach((ele)=>{
          if(ele.activationStatus===true){
            this.activeData="Active";
          }
          if(ele.activationStatus===false){
            this.activeData="Deleted";
          }
        })
       
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
  onContextMenu(event: MouseEvent, item: VehicleInterStateTax) {
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
          if(this.MessageArray[0]=="VehicleInterStateTaxCreate")
          {
            if(this.MessageArray[1]=="VehicleInterStateTaxView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vehicle Interstate Tax Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleInterStateTaxUpdate")
          {
            if(this.MessageArray[1]=="VehicleInterStateTaxView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vehicle Interstate Tax Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleInterStateTaxDelete")
          {
            if(this.MessageArray[1]=="VehicleInterStateTaxView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vehicle Interstate Tax Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleInterStateTaxAll")
          {
            if(this.MessageArray[1]=="VehicleInterStateTaxView")
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
    this.vehicleInterStateTaxService.getTableDataSort(this.InventoryInterStateTaxID,this.inventoryID,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}





