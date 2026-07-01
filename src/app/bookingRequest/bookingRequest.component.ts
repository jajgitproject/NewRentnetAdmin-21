
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
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';

@Component({
  standalone: false,
  selector: 'app-bookingRequest',
  templateUrl: './bookingRequest.component.html',
  styleUrls: ['./bookingRequest.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BookingRequestComponent implements OnInit {
  columnDefinitions = [
    { key: 'IntegrationRequestID', label: 'Request No.', visible: true },
    { key: 'CustomerTravelRequestNumber', label: 'TR No.', visible: true },
    { key: 'CustomerName', label: 'Customer Name', visible: true },
    { key: 'RequestDate', label: 'Booking Date Time', visible: true },
    { key: 'PickupDate', label: 'Pickup Date Time', visible: true },
    { key: 'ConfirmationDateTime', label: 'Confirmation Date Time', visible: true },
    { key: 'ReservationID', label: 'Booking No.', visible: true },
    { key: 'reservationCreatedBy', label: 'Reservation Created By', visible: true },
    { key: 'RequestStatus', label: 'Status', visible: true },
  ];

  filtersCollapsed = false;
  actionRow: BookingRequest | null = null;

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
  SearchRequestFromDate: Date | null = null;
  SearchRequestToDate: Date | null = null;
  SearchTRN:string ='';
  SearchiTRN : string ='';
  SearchEcoBookingNo: string = '';
  SearchStatus:string ='';
  SearchConfirmByEco: 'all' | 'yes' | 'no' = 'all';

  public CustomerGroupList?:CustomerGroupDropDown[]=[];
  filteredCustomerGroupOptions: Observable<CustomerGroupDropDown[]>;
  customerGroupName : FormControl=new FormControl();


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
    this.InitCustomer();
    this.SubscribeUpdateService();
  }

  get visibleColumns(): string[] {
    return [
      ...this.columnDefinitions.filter(col => col.visible).map(col => col.key),
      'actions'
    ];
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.SearchRequestFromDate) count++;
    if (this.SearchRequestToDate) count++;
    if (this.SearchTRN?.trim()) count++;
    if (this.SearchEcoBookingNo?.trim()) count++;
    if (this.SearchiTRN?.trim()) count++;
    if (this.customerGroupName.value?.trim()) count++;
    if (this.SearchConfirmByEco !== 'all') count++;
    if (this.SearchStatus?.trim()) count++;
    if (this.SearchFromDate) count++;
    if (this.SearchToDate) count++;
    return count;
  }

  toggleFilters(): void {
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  toggleColumn(columnKey: string): void {
    const column = this.columnDefinitions.find(col => col.key === columnKey);
    if (column) {
      column.visible = !column.visible;
    }
  }

  setColumnVisible(columnKey: string, visible: boolean): void {
    const column = this.columnDefinitions.find(col => col.key === columnKey);
    if (column) {
      column.visible = visible;
    }
  }

  setActionRow(row: BookingRequest): void {
    this.actionRow = row;
  }

  formatDateTime(dateValue: any, timeValue?: any): string {
    if (!dateValue && !timeValue) {
      return 'N/A';
    }

    const parts: string[] = [];
    if (dateValue) {
      parts.push(moment(dateValue).format('DD/MM/YYYY'));
    }
    if (timeValue) {
      parts.push(moment(timeValue).format('h:mm A'));
    }
    return parts.join(' ').trim() || 'N/A';
  }

  getStatusLabel(status: string): string {
    if (!status) {
      return 'N/A';
    }
    if (status === 'Approved' || status === 'Confirmed') {
      return 'Confirmed';
    }
    return status;
  }

  getStatusClass(status: string): string {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'requested' || normalized === 'pending') {
      return 'br-status-requested';
    }
    if (normalized === 'approved' || normalized === 'confirmed' || normalized === 'accepted') {
      return 'br-status-confirmed';
    }
    if (normalized === 'rejected' || normalized === 'cancelled' || normalized === 'cancel') {
      return 'br-status-rejected';
    }
    return 'br-status-neutral';
  }

  downloadTable(): void {
    if (!this.dataSource?.length) {
      return;
    }

    const headers = [
      'Request No.',
      'TR No.',
      'Customer Name',
      'Booking Date Time',
      'Pickup Date Time',
      'Confirmation Date Time',
      'Booking No.',
      'Reservation Created By',
      'Status'
    ];

    const rows = this.dataSource.map(row => [
      `${row.integrationRequestGroupID || ''}${row.integrationRequestGroupID ? '.' : ''}${row.integrationRequestID}`,
      row.customerTravelRequestNumber || '',
      row.customerName || 'N/A',
      this.formatDateTime(row.requestDate, row.requestTime),
      this.formatDateTime(row.pickupDate, row.pickupTime),
      row.reservationCreatedOn ? moment(row.reservationCreatedOn).format('DD/MM/YYYY h:mm A') : 'N/A',
      row.reservationID ? `${row.reservationGroupID || ''}${row.reservationGroupID ? '.' : ''}${row.reservationID}` : 'N/A',
      row.reservationCreatedBy || 'N/A',
      this.getStatusLabel(row.requestStatus)
    ]);

    const csv = [headers, ...rows]
      .map(line => line.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `booking-request-${moment().format('YYYYMMDD-HHmmss')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

   //-------------Mode of Payment ------------------
   InitCustomer(){
    this._generalService.GetCustomersGroups().subscribe(
      data=>
      {                
        this.CustomerGroupList=data;
        this.filteredCustomerGroupOptions = this.customerGroupName.valueChanges.pipe(
         startWith(""),
         map(value => this._filterCustomerGroup(value || ''))
          );
      });
  }
  
  private _filterCustomerGroup(value: string): CustomerGroupDropDown[] {
    const filterValue = (value || '').trim().toLowerCase();

    if (filterValue.length < 3) {
      return [];
    }

    return this.CustomerGroupList?.filter(
      data => data.customerGroup.toLowerCase().includes(filterValue)
    ) || [];
  }

  refresh() {
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.SearchRequestFromDate = null;
    this.SearchRequestToDate = null;
    this.SearchTRN = '';
    this.SearchiTRN = '';
    this.SearchEcoBookingNo = '';
    this.SearchConfirmByEco = 'all';
    this.SearchStatus = '';
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.customerGroupName.setValue('');
    this.loadData();
  }

  public SearchData() {
    this.PageNumber = 0;
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

  private getFormattedSearchDates(): { fromDate: string; toDate: string } {
    let fromDate = '';
    let toDate = '';

    if (this.SearchRequestFromDate) {
      fromDate = moment(this.SearchRequestFromDate).format('YYYY-MM-DD');
    }

    if (this.SearchRequestToDate) {
      toDate = moment(this.SearchRequestToDate).format('YYYY-MM-DD');
    }

    return { fromDate, toDate };
  }

  private getConfirmByEcoApiValue(): boolean | null {
    if (this.SearchConfirmByEco === 'yes') {
      return true;
    }
    if (this.SearchConfirmByEco === 'no') {
      return false;
    }
    return null;
  }

  public loadData()
  {
    const { fromDate, toDate } = this.getFormattedSearchDates();
    this.bookingRequestService.getTableData(fromDate,toDate,this.SearchTRN,this.SearchiTRN,this.customerGroupName.value,this.SearchEcoBookingNo,this.getConfirmByEcoApiValue(),this.PageNumber).subscribe(
      data => {
        this.dataSource = data;
        console.log('dataSource', this.dataSource);
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
    this.setActionRow(item);
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
    const { fromDate, toDate } = this.getFormattedSearchDates();
    this.bookingRequestService.getTableDataSort(fromDate, toDate, this.SearchTRN, this.SearchiTRN, this.customerGroupName.value, this.SearchEcoBookingNo, this.getConfirmByEcoApiValue(), this.PageNumber, coloumName.active, this.sortType).subscribe(
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }


  openInNewTab(rowItem: any) {
    if (!rowItem) {
      return;
    }
    const baseUrl = this._generalService.FormURL;
    const url = this.router.serializeUrl(this.router.createUrlTree(['/bookingConfiguration'], { queryParams: {
      BookingID: rowItem.integrationRequestID,
      returnUrl: '/bookingRequest',
      } }));
      window.open(baseUrl + url, '_blank');
  }
}



