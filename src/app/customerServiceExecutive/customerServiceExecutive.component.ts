// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerServiceExecutiveService } from './customerServiceExecutive.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerServiceExecutive } from './customerServiceExecutive.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponentHolder } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import moment from 'moment';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerServiceExecutive',
  templateUrl: './customerServiceExecutive.component.html',
  styleUrls: ['./customerServiceExecutive.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerServiceExecutiveComponent implements OnInit {
  displayedColumns = [
    'salesPerson',
    'reservationExecutive',
    'collectionExecutive',
    'fromDate',
  //'GeoPoint.GeoPointName',
    'activationStatus',
    'actions'
  ];
  dataSource: CustomerServiceExecutive[] | null;
  customerServiceExecutiveID: number;
  advanceTable: CustomerServiceExecutive | null;
  SearchCustomerServiceExecutive: string = ''; 
  SearchGstNumber: string='';
  SearchPercentage:string='';
  SearchbillingName:string='';
  gstNumber : FormControl = new FormControl();
  billingName : FormControl = new FormControl();
  percentage: FormControl = new FormControl();
  searchEntity: FormControl = new FormControl();
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]>;
  searchCreatedBy: FormControl = new FormControl();
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]>;
  searchinstructedBy: FormControl = new FormControl();
  filteredExecutiveOptionss: Observable<EmployeeDropDown[]>;
  searchExecutiveBy: FormControl = new FormControl();
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

  SearchSalesPerson: string = '';
  salesPerson : FormControl = new FormControl();

  SearchReservationExecutive: string = '';
  reservationExecutive : FormControl = new FormControl();

  SearchCollectionExecutive: string = '';
  collectionExecutive : FormControl = new FormControl();
  public EmployeeList?: EmployeeDropDown[] = [];
  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    
    public customerServiceExecutiveService: CustomerServiceExecutiveService,
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
      this.customer_ID   = paramsData.CustomerID;
       this.customer_Name=paramsData.CustomerName;
    });
    this.loadData();

    this.InitEmployee();
    this.InitEmployees();
    this.InitEmployeeExecutive();
    this.SubscribeUpdateService();
  }
  refresh() {
     
    this.SearchCustomerServiceExecutive = '';
    this.salesPerson.setValue('');
    this.reservationExecutive.setValue('');
    this.collectionExecutive.setValue('');
    this.SearchActivationStatus = true;
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
    this.customerServiceExecutiveID = row.id;
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
    //this.SearchCustomerServiceExecutive='';
  }
  
  deleteItem(row)
  {

    this.customerServiceExecutiveID = row.id;
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
     
      this.customerServiceExecutiveService.getTableData(this.customer_ID,this.SearchCustomerServiceExecutive,this.salesPerson.value,this.reservationExecutive.value,this.collectionExecutive.value,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerServiceExecutive) {
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
          if(this.MessageArray[0]=="CustomerServiceExecutiveCreate")
          {
            if(this.MessageArray[1]=="CustomerServiceExecutiveView")
            {
              if(this.MessageArray[2]=="Success")
              {
                 
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Service Executive Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerServiceExecutiveUpdate")
          {
            if(this.MessageArray[1]=="CustomerServiceExecutiveView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Service Executive Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerServiceExecutiveDelete")
          {
            if(this.MessageArray[1]=="CustomerServiceExecutiveView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Service Executive Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerServiceExecutiveAll")
          {
            if(this.MessageArray[1]=="CustomerServiceExecutiveView")
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
  // InitEmployee(){
  //   this._generalService.GetEmployeesForVehicleCategory().subscribe
  //   (
  //     data =>   
  //     {
  //       this.EmployeeList = data; 
       
  //     }
  //   );
  // }

  InitEmployee(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe(
      data=>
      {
        this.EmployeeList=data;
        this.filteredCreatedByOptionss = this.salesPerson.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCreatedBy(value || ''))
        ); 
      });
  }
  
  private _filterCreatedBy(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeeList.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().indexOf(filterValue)===0;
        // return customer.lastName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  InitEmployees(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe(
      data=>
      {
        this.EmployeeList=data;
        this.filteredinstructedByOptionss = this.reservationExecutive.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCreatedBys(value || ''))
        ); 
      });
  }
  
  private _filterCreatedBys(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeeList.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().indexOf(filterValue)===0;
        // return customer.lastName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  InitEmployeeExecutive(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe(
      data=>
      {
        this.EmployeeList=data;
        this.filteredExecutiveOptionss = this.collectionExecutive.valueChanges.pipe(
          startWith(""),
          map(value => this._filterExecutive(value || ''))
        ); 
      });
  }
  
  private _filterExecutive(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeeList.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().indexOf(filterValue)===0;
        // return customer.lastName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  // InitEmployeeExecutive(){
  //   this._generalService.GetEmployeesForVehicleCategory().subscribe(
  //     data=>
  //     {
  //       this.EmployeesLists=data;
  //       this.filteredExecutiveOptionss = this.searchExecutiveBy.valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filterExecutive(value || ''))
  //       ); 
  //     });
  // }
  
  // private _filterExecutive(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.EmployeesLists.filter(
  //     customer => 
  //     {
  //       return customer.firstName.toLowerCase().indexOf(filterValue)===0;
  //       // return customer.lastName.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }
  SortingData(coloumName:any) {
     
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.customerServiceExecutiveService.getTableDataSort(this.customer_ID,this.SearchCustomerServiceExecutive,this.SearchSalesPerson,this.SearchReservationExecutive,this.SearchCollectionExecutive,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




