// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerKeyAccountManagerService } from './customerKeyAccountManager.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerKeyAccountManager } from './customerKeyAccountManager.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponentHolder } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import moment from 'moment';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerKeyAccountManager',
  templateUrl: './customerKeyAccountManager.component.html',
  styleUrls: ['./customerKeyAccountManager.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerKeyAccountManagerComponent implements OnInit {
  displayedColumns = [
    'employeeName',
    'fromDate',
    'endDate',
    'attachmentStatus',
  'isDefaultKeyAccountManager',
    'activationStatus',
    'actions'
  ];
  dataSource: CustomerKeyAccountManager[] | null;
  customerKeyAccountManagerID: number;
  advanceTable: CustomerKeyAccountManager | null;
  SearchCustomerKeyAccountManager: string = ''; 

  SearchGstNumber: string='';
  SearchPercentage:string='';
  SearchbillingName:string='';
  gstNumber : FormControl = new FormControl();
  billingName : FormControl = new FormControl();
  percentage: FormControl = new FormControl();
  searchEntity: FormControl = new FormControl();
  SearchEntityType:string='';
   SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  ActiveStatus: any;
  employee_ID:any;
  EmployeeID:number=0;
  SupplierContractID:number=1;
  public CityList?: CityDropDown[] = [];
  customer_ID: any;
  customer_Name: any;

  SearchEmployeeName: string = '';
  next : FormControl = new FormControl();

  SearchStartDate: string = '';
  startDate : FormControl = new FormControl();

  SearchEndDate: string = '';
  endingDate : FormControl = new FormControl();
  public EmployeeList?: EmployeeDropDown[] = [];
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  menuItems: any[] = [
    { label: 'Customer Kam City' },
  ];


  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    
    public customerKeyAccountManagerService: CustomerKeyAccountManagerService,
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
      
        this.customer_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.customer_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      }
     
    });
    this.loadData();
    this.InitEmployee();
    this.SubscribeUpdateService();
  }
  refresh() {
     
    this.SearchCustomerKeyAccountManager = '';
    this.SearchEmployeeName='';
    this.SearchStartDate='';
    this.SearchEndDate='';
    this.SearchActivationStatus = true;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.PageNumber=0;
    this.loadData();
  }
  addNew()
  {
    
    const dialogRef = this.dialog.open(FormDialogComponentHolder, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          CustomerID:this.customer_ID,
          CustomerName:this.customer_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerKeyAccountManagerID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponentHolder, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerID:this.customer_ID,
        CustomerName:this.customer_Name
      }
    });
    
  }
  public SearchData()
  {
    this.loadData();
    //this.SearchCustomerKeyAccountManager='';
  }
  
  deleteItem(row)
  {

    this.customerKeyAccountManagerID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  openInNewTab(menuItem: any, rowItem: any) {
    console.log(menuItem);
    console.log(rowItem);
    let baseUrl = this._generalService.FormURL;
    if(menuItem.label.toLowerCase() === 'customer kam city') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/customerKAMCity'], { queryParams: {
        customerKeyAccountManagerID: rowItem.customerKeyAccountManagerID,
        employeeName:rowItem.employeeName
      } }));
      window.open(baseUrl + url, '_blank'); 
    } 
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
     
    if(this.SearchStartDate!==""){
      this.SearchStartDate=moment(this.SearchStartDate).format('MMM DD yyyy');
    }
    if(this.SearchEndDate!==""){
      this.SearchEndDate=moment(this.SearchEndDate).format('MMM DD yyyy');
    }  
    switch (this.selectedFilter)
    {
      case 'startDate':
        this.SearchStartDate = this.searchTerm;
        break;
        case 'endDate':
        this.SearchEndDate = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }  
      this.customerKeyAccountManagerService.getTableData(this.customer_ID,this.SearchCustomerKeyAccountManager,this.SearchEmployeeName,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerKeyAccountManager) {
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
          if(this.MessageArray[0]=="CustomerKeyAccountManagerCreate")
          {
            if(this.MessageArray[1]=="CustomerKeyAccountManagerView")
            {
              if(this.MessageArray[2]=="Success")
              {
                 
                this.refresh();
                this.showNotification(
                'snackbar-success',
                ' Customer Key Account Manager Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerKeyAccountManagerUpdate")
          {
            if(this.MessageArray[1]=="CustomerKeyAccountManagerView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                ' Customer Key Account Manager Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerKeyAccountManagerDelete")
          {
            if(this.MessageArray[1]=="CustomerKeyAccountManagerView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                ' Customer Key Account Manager Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerKeyAccountManagerAll")
          {
            if(this.MessageArray[1]=="CustomerKeyAccountManagerView")
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
  InitEmployee(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe
    (
      data =>   
      {
        this.EmployeeList = data; 
       
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
    this.customerKeyAccountManagerService.getTableDataSort(this.customer_ID,this.SearchCustomerKeyAccountManager,this.SearchEmployeeName,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus,this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




