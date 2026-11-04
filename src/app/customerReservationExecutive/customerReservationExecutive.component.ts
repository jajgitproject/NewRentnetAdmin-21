// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerReservationExecutiveService } from './customerReservationExecutive.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerReservationExecutive } from './customerReservationExecutive.model';
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
import { ActivatedRoute } from '@angular/router';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import moment from 'moment';
import { EmployeePrefixSearchField } from '../shared/employee-prefix-search.field';
@Component({
  standalone: false,
  selector: 'app-customerReservationExecutive',
  templateUrl: './customerReservationExecutive.component.html',
  styleUrls: ['./customerReservationExecutive.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerReservationExecutiveComponent implements OnInit {
  displayedColumns = [
    'employeeName',
    'fromDate',
    'toDate',

  //'GeoPoint.GeoPointName',
    'activationStatus',
    'actions'
  ];
  dataSource: CustomerReservationExecutive[] | null;
  customerReservationExecutiveID: number;
  advanceTable: CustomerReservationExecutive | null;
  SearchCustomerReservationExecutive: string = ''; 
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
  employeeSearch: EmployeePrefixSearchField;
  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    
    public customerReservationExecutiveService: CustomerReservationExecutiveService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {
    this.employeeSearch = new EmployeePrefixSearchField(this._generalService);
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.applyCustomerFromQuery(this.route.snapshot.queryParams);
    this.route.queryParams.subscribe((paramsData) => this.applyCustomerFromQuery(paramsData));
    this.loadData();
    this.SubscribeUpdateService();
  }

  private applyCustomerFromQuery(paramsData: Record<string, unknown>): void {
    const rawId = paramsData['CustomerID'] ?? paramsData['customerID'];
    if (rawId != null && String(rawId).trim() !== '') {
      this.customer_ID = this.resolveCustomerIdFromRoute(rawId);
    }
    const rawName = paramsData['CustomerName'] ?? paramsData['customerName'];
    if (rawName != null && String(rawName).trim() !== '') {
      this.customer_Name = this.resolveCustomerNameFromRoute(rawName);
    }
  }

  private normalizeEncryptedRouteValue(raw: unknown): string {
    if (raw == null) {
      return '';
    }
    return decodeURIComponent(String(raw).trim()).replace(/ /g, '+');
  }

  private resolveCustomerIdFromRoute(raw: unknown): number | undefined {
    const normalized = this.normalizeEncryptedRouteValue(raw);
    if (!normalized) {
      return undefined;
    }
    const decrypted = this._generalService.decrypt(normalized);
    const fromDecrypt = Number(String(decrypted).trim());
    if (Number.isFinite(fromDecrypt) && fromDecrypt > 0) {
      return fromDecrypt;
    }
    const plain = Number(normalized);
    if (Number.isFinite(plain) && plain > 0) {
      return plain;
    }
    return undefined;
  }

  private resolveCustomerNameFromRoute(raw: unknown): string {
    const normalized = this.normalizeEncryptedRouteValue(raw);
    if (!normalized) {
      return '';
    }
    const decrypted = this._generalService.decrypt(normalized);
    return decrypted || normalized;
  }

  private getRouteCustomerIdRaw(): string | undefined {
    const fromRoute =
      this.route.snapshot.queryParams['CustomerID'] ??
      this.route.snapshot.queryParams['customerID'];
    if (fromRoute != null && String(fromRoute).trim() !== '') {
      return String(fromRoute);
    }
    const hash = window.location.hash || '';
    const queryStart = hash.indexOf('?');
    if (queryStart < 0) {
      return undefined;
    }
    const params = new URLSearchParams(hash.substring(queryStart + 1));
    return params.get('CustomerID') ?? params.get('customerID') ?? undefined;
  }

  private getActiveCustomerId(): number {
    const fromState = this.resolveCustomerIdFromRoute(this.customer_ID);
    if (fromState) {
      return fromState;
    }
    const fromRoute = this.resolveCustomerIdFromRoute(this.getRouteCustomerIdRaw());
    if (fromRoute) {
      return fromRoute;
    }
    if (Array.isArray(this.dataSource) && this.dataSource.length > 0) {
      const rowId = Number(this.dataSource[0].customerID);
      if (Number.isFinite(rowId) && rowId > 0) {
        return rowId;
      }
    }
    return 0;
  }
  refresh() {
     
  
    this.SearchCustomerReservationExecutive = '';
    this.SearchEmployeeName='';
    this.employeeSearch.reset();
    this.SearchStartDate='';
    this.SearchEndDate='';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }
  addNew()
  {
    const customerId = this.getActiveCustomerId();
    const dialogRef = this.dialog.open(FormDialogComponentHolder, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          CustomerID: customerId,
          routeCustomerID: this.getRouteCustomerIdRaw(),
          CustomerName:this.customer_Name
        }
    });
  }
  editCall(row) {
    this.customerReservationExecutiveID =
      row.customerReservationExecutiveID ?? row.customerReservationExecutiveid ?? row.id;
    const customerId =
      this.getActiveCustomerId() || Number(row.customerID) || 0;
    const dialogRef = this.dialog.open(FormDialogComponentHolder, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerID: customerId,
        routeCustomerID: this.getRouteCustomerIdRaw(),
        CustomerName:this.customer_Name
      }
    });
    
  }
  public SearchData()
  {
    this.SearchEmployeeName = this.employeeSearch.apiSearchName || '';
    this.loadData();
  }
  
  deleteItem(row)
  {

    this.customerReservationExecutiveID = row.id;
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
    if(this.SearchStartDate!==""){
      this.SearchStartDate=moment(this.SearchStartDate).format('MMM DD yyyy');
    }
    if(this.SearchEndDate!==""){
      this.SearchEndDate=moment(this.SearchEndDate).format('MMM DD yyyy');
    }  
      this.customerReservationExecutiveService.getTableData(this.getActiveCustomerId(),this.SearchCustomerReservationExecutive,this.SearchEmployeeName,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerReservationExecutive) {
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
          if(this.MessageArray[0]=="CustomerReservationExecutiveCreate")
          {
            if(this.MessageArray[1]=="CustomerReservationExecutiveView")
            {
              if(this.MessageArray[2]=="Success")
              {
                 
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Reservation Executive Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerReservationExecutiveUpdate")
          {
            if(this.MessageArray[1]=="CustomerReservationExecutiveView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Reservation Executive Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerReservationExecutiveDelete")
          {
            if(this.MessageArray[1]=="CustomerReservationExecutiveView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Reservation Executive Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerReservationExecutiveAll")
          {
            if(this.MessageArray[1]=="CustomerReservationExecutiveView")
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
    this.customerReservationExecutiveService.getTableDataSort(this.getActiveCustomerId(),this.SearchCustomerReservationExecutive,this.SearchEmployeeName,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




