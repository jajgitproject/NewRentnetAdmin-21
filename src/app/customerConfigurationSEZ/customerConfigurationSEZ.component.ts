// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerConfigurationSEZService } from './customerConfigurationSEZ.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerConfigurationSEZ } from './customerConfigurationSEZ.model';
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
import moment from 'moment';
import { CustomerTypeDropDown } from '../customerType/customerTypeDropDown.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerConfigurationSEZ',
  templateUrl: './customerConfigurationSEZ.component.html',
  styleUrls: ['./customerConfigurationSEZ.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerConfigurationSEZComponent implements OnInit {
  displayedColumns = [
    'customerConfigurationSEZStartDate',
    'customerConfigurationSEZEndDate',
    'status',
    'actions'
  ];
  dataSource: CustomerConfigurationSEZ[] | null;
  customerConfigurationSEZID: number;
  advanceTable: CustomerConfigurationSEZ | null;
  searchcustomerConfigurationSEZStartDate: string = '';
  searchcustomerConfigurationSEZEndDate: string = '';
  SearchCustomerConfigurationSEZID:number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  startDate : FormControl = new FormControl();
  endDate : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplier_ID: any;
  supplier_Name: any;
  public CityList?: CitiesDropDown[] = [];
  public RateList?: SupplierRateCardDropDown[] = [];
  public CustomerTypeList?: CustomerTypeDropDown[] = [];
  public CustomerList?: CustomerDropDown[] = [];
  customerID: any;
  customerName: any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerConfigurationSEZService: CustomerConfigurationSEZService,
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
      const encryptedCustomerID = paramsData.CustomerID;
    const encryptedCustomerName = paramsData.CustomerName;
    
    if (encryptedCustomerID && encryptedCustomerName) {
      
        this.customerID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.customerName = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      }
     
    });
    this.initCustomerType();
    this.initCustomerfor();
    this.InitCities()
    this.initRate();
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.searchcustomerConfigurationSEZStartDate = '';
    this.searchcustomerConfigurationSEZEndDate = '';
    this.SearchActivationStatus = true;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.PageNumber=0;
    this.loadData();
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
      });
  }
  initCustomerType(){
    this._generalService.getCustomerType().subscribe(
      data=>{
        this.CustomerTypeList=data;
      }
    )
  }

  initCustomerfor(){
    this._generalService.getCustomer().subscribe(
      data=>{
        this.CustomerList=data;
      }
    )
    
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
          customerID: this.customerID,
          customerName :this.customerName,
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerConfigurationSEZID = row.customerConfigurationSEZID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerID: this.customerID,
        customerName :this.customerName,
      }
    });

  }
  deleteItem(row)
  {

    this.customerConfigurationSEZID = row.id;
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
    if(this.searchcustomerConfigurationSEZStartDate!==""){
      this.searchcustomerConfigurationSEZStartDate=moment(this.searchcustomerConfigurationSEZStartDate).format('MMM DD yyyy');
    }
    if(this.searchcustomerConfigurationSEZEndDate!==""){
      this.searchcustomerConfigurationSEZEndDate=moment(this.searchcustomerConfigurationSEZEndDate).format('MMM DD yyyy');
    } 
    switch (this.selectedFilter)
    {
      case 'startDate':
        this.searchcustomerConfigurationSEZStartDate = this.searchTerm;
        break;
        case 'endDate':
        this.searchcustomerConfigurationSEZEndDate = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }  
      this.customerConfigurationSEZService.getTableData(this.customerID,this.searchcustomerConfigurationSEZStartDate,this.searchcustomerConfigurationSEZEndDate,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerConfigurationSEZ) {
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
          if(this.MessageArray[0]=="CustomerConfigurationSEZCreate")
          {
            if(this.MessageArray[1]=="CustomerConfigurationSEZView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Configuration SEZ Mapping Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerConfigurationSEZUpdate")
          {
            if(this.MessageArray[1]=="CustomerConfigurationSEZView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Configuration SEZ Mapping Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerConfigurationSEZDelete")
          {
            if(this.MessageArray[1]=="CustomerConfigurationSEZView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Configuration SEZ Mapping Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerConfigurationSEZAll")
          {
            if(this.MessageArray[1]=="CustomerConfigurationSEZView")
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
    this.customerConfigurationSEZService.getTableDataSort(this.customerID,this.searchcustomerConfigurationSEZStartDate,this.searchcustomerConfigurationSEZStartDate,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




