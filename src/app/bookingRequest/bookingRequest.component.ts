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
import { BookingRequestService } from './bookingRequest.service';
import { BookingRequest } from './bookingRequest.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-bookingRequest',
  templateUrl: './bookingRequest.component.html',
  styleUrls: ['./bookingRequest.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BookingRequestComponent implements OnInit {
  displayedColumns = [
    'IntegrationRequestID',
    'CustomerTravelRequestNumber',
    'CustomerName',
    'RequestDate',
    'PickupDate',
    'RequestStatus',
    'ReservationID',
    'PickupTime',
    'RequestTime',
    'CheckedByEco',
    'actions'
  ];

  dataSource: BookingRequest[] | null;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  dialogRef: MatDialogRef<any>;
  SearchFromDate: string = '';
  SearchToDate: string = '';
  SearchRequestFromDate: string = '';
  SearchRequestToDate: string = '';
  SearchTRN:string ='';
  SearchEcoBookingNo: string = '';
  SearchStatus:string ='';

  public CustomerList?:CustomerDropDown[]=[];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  customerName : FormControl=new FormControl();


  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public bookingRequestService: BookingRequestService,
    private snackBar: MatSnackBar,
    public router:Router,
    public _generalService: GeneralService
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
    this.InitCustomer();
    this.SubscribeUpdateService();

  }

   //-------------Mode of Payment ------------------
   InitCustomer(){
    this._generalService.GetCustomers().subscribe(
      data=>
      {                
        this.CustomerList=data;
        this.filteredCustomerOptions = this.customerName.valueChanges.pipe(
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

    return this.CustomerList?.filter(
      data => 
      {
        return data.customerName.toLowerCase().includes(filterValue);
      }
    );
  }

  refresh() {
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.SearchFromDate="";
    this.SearchToDate="";
    this.SearchTRN="";
    this.SearchEcoBookingNo="";
    this.SearchStatus="";
    this.customerName.setValue('');
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
    if(this.SearchFromDate!=="")
    {
      this.SearchFromDate=moment(this.SearchFromDate).format('MMM DD yyyy');
    }
    if(this.SearchToDate!=="")
    {
      this.SearchToDate=moment(this.SearchToDate).format('MMM DD yyyy');
    }
    if(this.SearchRequestFromDate!=="")
    {
      this.SearchRequestFromDate=moment(this.SearchRequestFromDate).format('MMM DD yyyy');
    }
    if(this.SearchRequestToDate!=="")
    {
      this.SearchRequestToDate=moment(this.SearchRequestToDate).format('MMM DD yyyy');
    }
    this.bookingRequestService.getTableData(this.SearchFromDate,this.SearchToDate,this.SearchRequestFromDate,this.SearchRequestToDate,this.SearchTRN,this.customerName.value,this.SearchEcoBookingNo,this.SearchStatus,this.PageNumber).subscribe(
        data => {
          this.dataSource = data;
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
  onContextMenu(event: MouseEvent, item: BookingRequest) {
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

  SortingData(coloumName: any) 
  {
    if (this.sortingData == 1) 
    {
      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else 
    {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.bookingRequestService.getTableDataSort(this.SearchFromDate,this.SearchToDate,this.SearchRequestFromDate,this.SearchRequestToDate,this.SearchTRN,this.customerName.value,this.SearchEcoBookingNo,this.SearchStatus,this.PageNumber, coloumName.active, this.sortType).subscribe(
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }


  openInNewTab(rowItem: any) {
    let baseUrl = this._generalService.FormURL;   
    const url = this.router.serializeUrl(this.router.createUrlTree(['/bookingConfiguration'], { queryParams: {
      BookingID:rowItem.integrationRequestID,
      } }));
      window.open(baseUrl + url, '_blank');
  }
}



