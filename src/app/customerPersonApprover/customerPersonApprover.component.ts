// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerPersonApproverService } from './customerPersonApprover.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerPersonApprover } from './customerPersonApprover.model';
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
import { DriverDropDown } from './driverDropDown.model';
import moment from 'moment';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerPersonApprover',
  templateUrl: './customerPersonApprover.component.html',
  styleUrls: ['./customerPersonApprover.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerPersonApproverComponent implements OnInit {
  displayedColumns = [
       'approverName',
    'startDate',
    'endDate',
    //'remark',
    // 'status',
    'actions'
  ];
  dataSource: CustomerPersonApprover[] | null;
  customerPersonApproverID: number;
  advanceTable: CustomerPersonApprover | null;
  SearchName: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  customerPerson_ID: any;
  customerPerson_Name: any;
  customerGroupID: any;
  public DriverList?: DriverDropDown[] = [];
  filteredOptions: Observable<DriverDropDown[]>;
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  public CustomerList?: CustomerDropDown[] = [];
  customer: FormControl = new FormControl();
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;
    searchStartDate: string = '';
  searchEndDate:string = '';
  searchcustomerPersonApproverStatus: boolean = true;
  customerGroup_ID: any;
  


  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerPersonApproverService: CustomerPersonApproverService,
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
  this.route.queryParams.subscribe(paramsData => {
    const encryptedCustomerPersonID = paramsData.CustomerPersonID;
    const encryptedCustomerPersonName = paramsData.CustomerPersonName;
    const encryptedCustomerGroupID = paramsData.CustomerGroupID;

    if (encryptedCustomerPersonID && encryptedCustomerPersonName) {
      this.customerPerson_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerPersonID));
      this.customerPerson_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerPersonName));
    }

    // Replace the old if-block with this line:
    this.customerGroupID = encryptedCustomerGroupID
      ? this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupID))
      : null;

  });

  this.loadData();
  this.SubscribeUpdateService();
  this.InitCustomer();
}


  InitDriver(){
    this._generalService.GetDriver().subscribe
    (
      data =>   
      {
        this.DriverList = data; 
        this.filteredOptions = this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );      
      }
    );
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3)
     {
        return [];   
      }
    return this.DriverList.filter(
      customer => 
      {
        return customer.driverName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  refresh() {
    this.search.setValue('');
     this.searchStartDate = '';
    this.searchEndDate = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
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
          CustomerPersonID:this.customerPerson_ID,
          CustomerPersonName:this.customerPerson_Name,
             customerGroupID: this.customerGroupID
 
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerPersonApproverID = row.customerPersonApproverID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerPersonID:this.customerPerson_ID,
        CustomerPersonName:this.customerPerson_Name,
        customerGroupID: row.customerGroupID
      }
    });

  }
  deleteItem(row)
  {

    this.customerPersonApproverID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
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
    
      if(this.searchStartDate!==""){
          this.searchStartDate=moment(this.searchStartDate).format('MMM DD yyyy');
        }
        if(this.searchEndDate!==""){
          this.searchEndDate=moment(this.searchEndDate).format('MMM DD yyyy');
        } 
        switch (this.selectedFilter)
        {
          case 'startDate':
            this.searchStartDate = this.searchTerm;
            break;
            case 'endDate':
            this.searchEndDate = this.searchTerm;
            break;
          default:
            this.searchTerm = '';
            break;
        } 
      
      this.customerPersonApproverService.getTableData(this.customer.value,this.customerPerson_ID,this.searchStartDate,this.searchEndDate,this.searchcustomerPersonApproverStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerPersonApprover) {
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
          if(this.MessageArray[0]=="CustomerPersonApproverCreate")
          {
            if(this.MessageArray[1]=="CustomerPersonApproverView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Person Driver Restriction Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonApproverUpdate")
          {
            if(this.MessageArray[1]=="CustomerPersonApproverView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Driver Restriction Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonApproverDelete")
          {
            if(this.MessageArray[1]=="CustomerPersonApproverView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Driver Restriction Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonApproverAll")
          {
            if(this.MessageArray[1]=="CustomerPersonApproverView")
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
    this.customerPersonApproverService.getTableDataSort(this.SearchName,this.customerPerson_ID, this.searchStartDate,this.searchEndDate,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
   InitCustomer() {
    this._generalService.GetCustomers().subscribe(
      data => {
        ;
        this.CustomerList = data;
        this.filteredCustomerOptions = this.customer.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        );
      },
      error => {

      }
    );
  }
 private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.CustomerList.filter(
      customer => 
      {
        return customer.customerName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
}




