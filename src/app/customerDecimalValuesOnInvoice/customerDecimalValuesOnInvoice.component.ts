// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomerDecimalValuesOnInvoiceService } from './customerDecimalValuesOnInvoice.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerDecimalValuesOnInvoice } from './customerDecimalValuesOnInvoice.model';
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
  selector: 'app-customerDecimalValuesOnInvoice',
  templateUrl: './customerDecimalValuesOnInvoice.component.html',
  styleUrls: ['./customerDecimalValuesOnInvoice.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerDecimalValuesOnInvoiceComponent implements OnInit {
  displayedColumns = [
    'startDate',
    'endDate',
    'status',
    'actions'
  ];
  dataSource: CustomerDecimalValuesOnInvoice[] | null;
  customerDecimalValuesOnInvoiceID: number;
  advanceTable: CustomerDecimalValuesOnInvoice | null;
  searchstartDate: string = '';
  searchendDate: string = '';
  SearchCustomerDecimalValuesOnInvoiceID:number=0;
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
    public customerDecimalValuesOnInvoiceService: CustomerDecimalValuesOnInvoiceService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
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
    this.searchstartDate = '';
    this.searchendDate = '';
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
    this.customerDecimalValuesOnInvoiceID = row.customerDecimalValuesOnInvoiceID;
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

    this.customerDecimalValuesOnInvoiceID = row.id;
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
    if(this.searchstartDate!==""){
      this.searchstartDate=moment(this.searchstartDate).format('MMM DD yyyy');
    }
    if(this.searchendDate!==""){
      this.searchendDate=moment(this.searchendDate).format('MMM DD yyyy');
    } 
    switch (this.selectedFilter)
    {
      case 'startDate':
        this.searchstartDate = this.searchTerm;
        break;
        case 'endDate':
        this.searchendDate = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }  
      this.customerDecimalValuesOnInvoiceService.getTableData(this.customerID,this.searchstartDate,this.searchendDate,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerDecimalValuesOnInvoice) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
  NextCall()
  {
    //console.log(this.dataSource.length>0)
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
          if(this.MessageArray[0]=="CustomerDecimalValuesOnInvoiceCreate")
          {
            if(this.MessageArray[1]=="CustomerDecimalValuesOnInvoiceView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Round UP Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerDecimalValuesOnInvoiceUpdate")
          {
            if(this.MessageArray[1]=="CustomerDecimalValuesOnInvoiceView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Round UP Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerDecimalValuesOnInvoiceDelete")
          {
            if(this.MessageArray[1]=="CustomerDecimalValuesOnInvoiceView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Round UP Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerDecimalValuesOnInvoiceAll")
          {
            if(this.MessageArray[1]=="CustomerDecimalValuesOnInvoiceView")
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
    this.customerDecimalValuesOnInvoiceService.getTableDataSort(this.customerID,this.searchstartDate,this.searchendDate,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
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




