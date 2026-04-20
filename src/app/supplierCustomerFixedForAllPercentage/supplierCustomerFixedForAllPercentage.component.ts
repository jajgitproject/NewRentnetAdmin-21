// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SupplierCustomerFixedForAllPercentageService } from './supplierCustomerFixedForAllPercentage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupplierCustomerFixedForAllPercentage } from './supplierCustomerFixedForAllPercentage.model';
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
import { Form, FormControl } from '@angular/forms';
import moment from 'moment';
import { CustomerDropDown } from './customerDropDown.model';
@Component({
  standalone: false,
  selector: 'app-supplierCustomerFixedForAllPercentage',
  templateUrl: './supplierCustomerFixedForAllPercentage.component.html',
  styleUrls: ['./supplierCustomerFixedForAllPercentage.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierCustomerFixedForAllPercentageComponent implements OnInit {
  displayedColumns = [
    'customerName',
    'fromDate',
    'toDate',
    'supplierPercentage',
    'status',
    'actions'
  ];
  dataSource: SupplierCustomerFixedForAllPercentage[] | null;
  supplierCustomerFixedPercentageForAllID: number;
  advanceTable: SupplierCustomerFixedForAllPercentage | null;
  SearchSupplierCustomerPercentageForAllID: number = 0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;

  SearchFromDate:string = '';
  SearchToDate:string='';
  SearchCustomer:string='';

  fromDate : FormControl = new FormControl();
  toDate : FormControl = new FormControl();
  customer:FormControl= new FormControl();

  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  public CustomerList?: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public supplierCustomerFixedForAllPercentageService: SupplierCustomerFixedForAllPercentageService,
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
    this.loadData();
    this.InitCustomer();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchSupplierCustomerPercentageForAllID=0;
    this.customer.setValue('');
    this.SearchFromDate='';
    this.SearchToDate='';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  public SearchData()
  {
   
    this.loadData();    
  }

  InitCustomer(){
    this._generalService.GetCustomers().subscribe(
      data=>
      {
        this.CustomerList=data;
        this.filteredCustomerOptions = this.customer.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerList.filter(
      customer => 
      {
        return customer.customerName.toLowerCase().indexOf(filterValue)===0;
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
          action: 'add'
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.supplierCustomerFixedPercentageForAllID = row.supplierCustomerFixedPercentageForAllID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.supplierCustomerFixedPercentageForAllID = row.id;
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
    if(this.SearchFromDate!==""){
      this.SearchFromDate=moment(this.SearchFromDate).format('MMM DD yyyy');
    }
    if(this.SearchToDate!==""){
      this.SearchToDate=moment(this.SearchToDate).format('MMM DD yyyy');
    }  
      this.supplierCustomerFixedForAllPercentageService.getTableData(
        this.SearchSupplierCustomerPercentageForAllID,
        this.customer.value,
        this.SearchFromDate,
        this.SearchToDate,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        // this.dataSource?.forEach((ele)=>{
        //   if(ele.activationStatus===true){
        //     this.activeData="Active";
        //   }
        // })
       
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
  onContextMenu(event: MouseEvent, item: SupplierCustomerFixedForAllPercentage) {
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
          if(this.MessageArray[0]=="SupplierCustomerFixedForAllPercentageCreate")
          {
            if(this.MessageArray[1]=="SupplierCustomerFixedForAllPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Customer Fixed For All Percentage Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierCustomerFixedForAllPercentageUpdate")
          {
            if(this.MessageArray[1]=="SupplierCustomerFixedForAllPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Customer Fixed For All Percentage Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierCustomerFixedForAllPercentageDelete")
          {
            if(this.MessageArray[1]=="SupplierCustomerFixedForAllPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Customer Fixed For All Percentage Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierCustomerFixedForAllPercentageAll")
          {
            if(this.MessageArray[1]=="SupplierCustomerFixedForAllPercentageView")
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
    this.supplierCustomerFixedForAllPercentageService.getTableDataSort(
      this.SearchSupplierCustomerPercentageForAllID,
      this.SearchCustomer,
      this.SearchFromDate,
      this.SearchToDate,
      this.SearchActivationStatus, 
      this.PageNumber,
      coloumName.active,
      this.sortType).subscribe
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




