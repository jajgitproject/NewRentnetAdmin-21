// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ModeOfPaymentDropDown } from '../supplierContract/modeOfPaymentDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import moment from 'moment';
import { CustomerPersonDetailsDropDown } from '../passengerDetails/customerPersonDetailsDropDown.model';
import { GeoPointTypeDropDown } from '../geoPointType/geoPointTypeDropDown.model';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';
import { CustomerMISService } from './customerMIS.service';
import { CustomerMIS } from './customerMIS.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';

@Component({
  standalone: false,
  selector: 'app-customerMIS',
  templateUrl: './customerMIS.component.html',
  styleUrls: ['./customerMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerMISComponent implements OnInit {
  displayedColumns = [
      'CustomerGroupID',
      'CustomerCreationDate',
      'CustomerName',
      'ContactNo',
      'Email',
      'CompleteAddress',
      'MotherLocation',
      'CustomerGroup',
      'CompanyName',
      'CustomerPersonName',
      'Gender',
      'PrimaryEmail',
      'PrimaryMobile',
      'CustomerDesignation',
      'SalesPerson',
      'Country',
      'StateName',
      'City',
      'IsAdmin',
      'IsBooker',
      'IsPassenger',
      'IsContactPerson',
      'IsItBaseAddress'  
  ];

  dataSource: CustomerMIS[] | null;
  employeeID: number;
  row: CustomerMIS | null;
  SearchName: string = '';
  IsLockedOut:boolean=true;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  userType:string='Employee';
  dialogRef: MatDialogRef<any>;
  ActiveStatus: any;
  last: any;
   filteredCustomerOptions:Observable<CustomerDropDown[]>;
   public CustomerList?:CustomerDropDown[]=[];
   filteredOptions: Observable<CustomerGroupDropDown[]>;
   public customerGroupList?: CustomerGroupDropDown[] = [];

  searchTerm: any = '';
  selectedFilter: string = 'search';
  searchCustomerGroup:string='';
 customerGroup : FormControl=new FormControl();
  searchCustomerName:string='';
  customer : FormControl=new FormControl();
  geoPointTypeID: any;
  customerGroupID: any;


  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public customerMISService: CustomerMISService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    //this.loadData();
    this.initCustomerGroup();
    this.SubscribeUpdateService();

  }

  initCustomerGroup(){
    this._generalService.getCustomerGroup().subscribe(
      data=>{
        this.customerGroupList=data;
        this.filteredOptions = this.customerGroup.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );

      }
    )
  }
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.customerGroupList.filter(
      customer => 
      {
        return customer.customerGroup.toLowerCase().includes(filterValue);
      }
    );
    
  };

  onCustomerGroupSelected(customerGroup: string) {
    const selectedCustomerGroup = this.customerGroupList.find(
      data => data.customerGroup === customerGroup
    );
  
    if (selectedCustomerGroup) {
      this.getGroupID(selectedCustomerGroup.customerGroupID);
    }
  }

  getGroupID(customerGroupID: any) {
    this.customerGroupID=customerGroupID;
    this.initCustomer();
  }
  

  //-------Customer-------
  initCustomer(){
    this._generalService.GetCustomersForCP(this.customerGroupID).subscribe(
      data=>
      {
        this.CustomerList=data;
        this.filteredCustomerOptions = this.customer.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        ); 
      });
  }

  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CustomerList.filter(
      data => 
      {
        return data.customerName.toLowerCase().includes(filterValue);
      }
    );
  }

  onCustomerSelected(customer: string) {
    const selectedCustomer = this.CustomerList.find(
      data => data.customerName === customer
    );
  
    
  }


  refresh() {
    this.customerGroup.setValue('');
    this.customer.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData() {
    this.loadData();

  }
 
  public Filter() {
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
    debugger
    
    this.customerMISService.getTableData(this.customerGroup.value,this.customer.value,this.PageNumber).subscribe
      (
        data => {
          this.dataSource = data;
       
          console.log(this.dataSource)
          
       
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
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
  onContextMenu(event: MouseEvent, item: CustomerMIS) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall() {
    if (this.dataSource.length > 0) {

      this.PageNumber++;
      //alert(this.PageNumber + 'mohit')
      this.loadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall() {

    if (this.PageNumber > 0) {
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


  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe
      (
        message => {
          //message contains the data sent from service
          this.messageReceived = message.text;
          this.MessageArray = this.messageReceived.split(":");
          if (this.MessageArray.length == 3) {
            if (this.MessageArray[0] == "UnlockEmployeeCreate") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "UnlockEmployeeUpdate") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "UnlockEmployee") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Account successfully...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "UnlockEmployeeAll") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Failure") {
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
            else if (this.MessageArray[0] == "DataNotFound") {
              if (this.MessageArray[1] == "DuplicacyError") {
                if (this.MessageArray[2] == "Failure") {
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

  SortingData(coloumName: any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.customerMISService.getTableDataSort(
      this.searchCustomerGroup,this.searchCustomerName,this.PageNumber, coloumName.active, this.sortType).subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
}




