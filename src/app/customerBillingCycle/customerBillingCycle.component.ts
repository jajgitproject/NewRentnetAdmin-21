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
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { ActivatedRoute } from '@angular/router';
import { CustomerBillingCycleService } from './customerBillingCycle.service';
import { CustomerBillingCycle } from './customerBillingCycle.model';
import { BillingTypeDropDown } from '../billingType/billingTypeDropDown.model';
import { BillingCycleNameDropDown } from '../billingCycleName/billingCycleNameDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerBillingCycle',
  templateUrl: './customerBillingCycle.component.html',
  styleUrls: ['./customerBillingCycle.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerBillingCycleComponent implements OnInit {
  displayedColumns = [
    'billingCycleName',
    'billingTypeName',
    'status',
    'actions'
  ];
  dataSource: CustomerBillingCycle[] | null;
  customerBillingCycleID:number=0;
  advanceTable: CustomerBillingCycle | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  public BillingCycleNameList?: BillingCycleNameDropDown[] = [];
  public BillingTypeList?: BillingTypeDropDown[] = [];
  filteredBillingCycleNameOptions: Observable<BillingCycleNameDropDown[]>;
  filteredBillingTypeOptions: Observable<BillingTypeDropDown[]>;
  searchBillingCycleName: string = '';
  billingCycleName : FormControl = new FormControl();

  searchBillingTypeName: string = '';
  billingTypeName : FormControl = new FormControl();
  Customer_ID: any;
  Customer_Name: any;
  roleID:any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  SearchAddress: any = '';
  completeAddress : FormControl = new FormControl();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerBillingCycleService: CustomerBillingCycleService,
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
      
        this.Customer_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.Customer_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      }
      
    });
    this.loadData();
    this.SubscribeUpdateService();
    this.InitBillingType();
     this.roleID = localStorage.getItem('roleID');
  }

  InitBillingType(){
    this._generalService.getBillingType().subscribe(
      data =>
      {
        this.BillingTypeList = data;
        this.filteredBillingTypeOptions = this.billingTypeName.valueChanges.pipe(
          startWith(""),
          map(value => this._filterbillingTypeName(value || ''))
        );              
      },
      error=>{}
    );
  }
  private _filterbillingTypeName(value: string): any {
  const filterValue = value.toLowerCase();
  return this.BillingTypeList?.filter(
    customer =>
    {
      return customer.billingTypeName.toLowerCase().indexOf(filterValue)===0;
    });
  }
 InitBillingCycleName(){
   this._generalService.getBillingCycleName().subscribe(
     data=>
     {
       this.BillingCycleNameList=data;       
       this.filteredBillingCycleNameOptions = this.billingCycleName.valueChanges.pipe(
         startWith(""),
         map(value => this._filterbillingCycleName(value || ''))
       );
     });
 }
 private _filterbillingCycleName(value: string): any {
   const filterValue = value.toLowerCase();
   return this.BillingCycleNameList.filter(
     customer =>
     {
       return customer.billingCycleName.toLowerCase().includes(filterValue);
     });
 }

  refresh() {
    this.billingCycleName.setValue('');
     this.billingTypeName.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.SearchAddress='';
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
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
          CustomerID:this.Customer_ID,
          CustomerName:this.Customer_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerBillingCycleID = row.customerBillingCycleID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerID:this.Customer_ID,
        CustomerName:this.Customer_Name
      }
    });

  }
  deleteItem(row)
  {

    this.customerBillingCycleID = row.customerBillingCycleID;
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

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'billingCycleName':
        this.billingCycleName.setValue(this.searchTerm);
        break;
      case 'billingTypeName':
        this.billingTypeName.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.customerBillingCycleService.getTableData(
        this.Customer_ID,
        this.billingCycleName.value,
        this.billingTypeName.value,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerBillingCycle) {
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
          if(this.MessageArray[0]=="CustomerBillingCycleCreate")
          {
            if(this.MessageArray[1]=="CustomerBillingCycleView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Billing Cycle Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerBillingCycleUpdate")
          {
            if(this.MessageArray[1]=="CustomerBillingCycleView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Billing Cycle Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerBillingCycleDelete")
          {
            if(this.MessageArray[1]=="CustomerBillingCycleView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Billing Cycle Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerBillingCycleAll")
          {
            if(this.MessageArray[1]=="CustomerBillingCycleView")
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
    this.customerBillingCycleService.getTableDataSort(this.Customer_ID,
      this.searchBillingCycleName,
      this.searchBillingTypeName,
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



