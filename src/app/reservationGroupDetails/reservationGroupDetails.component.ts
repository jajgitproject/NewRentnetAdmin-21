// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReservationGroupDetailsService } from './reservationGroupDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReservationGroup } from './reservationGroupDetails.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../reservationGroupDetails/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NewDuplicateDialogComponent } from './dialogs/new-duplicate-dialog/new-duplicate-dialog.component';
import { DuplicateWithRangeDialogComponent } from './dialogs/duplicate-with-range-dialog/duplicate-with-range-dialog.component';
@Component({
  standalone: false,
  selector: 'app-reservationGroupDetails',
  templateUrl: './reservationGroupDetails.component.html',
  styleUrls: ['./reservationGroupDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ReservationGroupDetailsComponent implements OnInit {
  displayedColumns = [
    'reservationID',
    'pickupCity',
    'vehicle',
    'primaryBooker',
    'primaryPassenger',
    'pickupDate',
    'pickupTime',
    'actions'
  ];
  dataSource: ReservationGroup[] | null;
  reservationGroupID: number;
  advanceTable: ReservationGroup | null;
  SearchReservationGroup: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search: FormControl = new FormControl();
  redirectedFrom: any;
  customer: any;
  customerGroupID: any;
  customerGroup: any;
  customerTypeID: any;
  customerID: any;
  customerType: any;
  primaryBookerID: any;
  primaryBooker: any;
  gender: any;
  customerForBooker: any;
  customerDesignation: any;
  phone: any;
  importance: any;
  customerDepartment: any;
  bookingCount: any;
  noOfBooking: any;
  reservationID: any;
  requestType = 'add';
  // Status gating
  status: string = '';
  buttonDisabled: boolean = false; // disables edit/save when status not "Changes allow"
  recentlyDuplicated: boolean = false; // Track if we just created duplicates
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public reservationGroupDetailsService: ReservationGroupDetailsService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public router: Router,
    public _generalService: GeneralService
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData => {
      // const encryptedCustomerID = paramsData.customerID;
      // const encryptedCustomerName = paramsData.customerName;

      // if (encryptedCustomerID && encryptedCustomerName) {

      //     this.customerID= this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
      //     this.customer = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      //   }
      // this.reservationGroupID = paramsData.reservationGroupID;
      const encryptedCustomerID = paramsData.customerID;
      const encryptedCustomerName = paramsData.customerName;
      const encryptedReservationGroupID = paramsData.reservationGroupID; // Adding reservationGroupID for decryption
      this.requestType = paramsData?.type || 'add'; // Default to 'add' if not provided

      if (encryptedCustomerID && encryptedCustomerName) {
        this.customerID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.customer = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      }

      // Decrypt reservationGroupID
      if (encryptedReservationGroupID) {
        this.reservationGroupID = Number(this._generalService.decrypt(decodeURIComponent(encryptedReservationGroupID)));
      }

      // Decrypt status if present (support multiple param names)
      const encryptedStatus = paramsData.status || paramsData.statusSearch || paramsData.formStatus;
      if (encryptedStatus) {
        try {
          const decrypted = this._generalService.decrypt(decodeURIComponent(encryptedStatus));
          this.status = this.extractStatus(decrypted);
        } catch (e) {
          this.status = '';
        }
      }
      // Set buttonDisabled (if no status provided keep enabled so legacy flows still work)
      if (this.status) {
        this.buttonDisabled = this.status.toLowerCase() !== 'changes allow';
      }

      //this.redirectedFrom=paramsData.formName;
      //   this.customerID=paramsData.customerID;
      // this.customer=paramsData.customerName;
      // console.log(this.customer)
      // this.customerGroupID=paramsData.customerGroupID;
      // this.customerGroup=paramsData.customerGroup;
      // this.customerTypeID=paramsData.customerTypeID;
      // this.customerType=paramsData.customerType;
      // this.primaryBookerID=paramsData.primaryBookerID;
      // this.primaryBooker=paramsData.primaryBooker;
      // this.gender=paramsData.gender;
      // this.importance=paramsData.importance;
      // this.phone=paramsData.phone;
      // this.customerDepartment=paramsData.customerDepartment;
      // this.customerDesignation=paramsData.customerDesignation;
      // this.customerForBooker=paramsData.customerForBooker;
    });
    //  if(this.redirectedFrom==='fromReservationGroup' || this.redirectedFrom==='fromControlPanel')
    //   {
    //     this.GetReservationGroupData();
    //   }
    this.GetReservationGroupData();
    this.loadData();
    this.GetNumberOfBookings();
    this.SubscribeUpdateService();
    if(this.requestType === 'add') { 
      this.addNew();
    }
  }

  OpenBookingScreen(item) {
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customer));
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(item.reservationGroupID.toString()));
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));
    const encryptedCustomerGroupID = encodeURIComponent(this._generalService.encrypt(item.customerGroupID.toString()));
    const encryptedAction = encodeURIComponent(this._generalService.encrypt('edit'));
    
    // Always allow changes for any booking accessed through this method
    const encryptedStatus = encodeURIComponent(this._generalService.encrypt('Changes allow'));
    
    const url = this.router.serializeUrl(this.router.createUrlTree(['/bookingScreen'], {
      queryParams: {

        reservationID: encryptedReservationID,
        reservationGroupID: encryptedReservationGroupID,
        customerGroupID: encryptedCustomerGroupID,
        customerID: encryptedCustomerID,
        customerName: encryptedCustomerName,
        action: encryptedAction,
        status: encryptedStatus
      }
    }));
    window.open(this._generalService.FormURL + url, '_blank');
  }

  BookingForEdit(item) {
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(item.reservationGroupID.toString()));
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customer));
    
    // Always allow changes when editing from reservation group details
    const encryptedStatus = encodeURIComponent(this._generalService.encrypt('Changes allow'));
    
    const url = this.router.serializeUrl(this.router.createUrlTree(['/bookingScreen'], {
      queryParams: {
        reservationID: encryptedReservationID,
        reservationGroupID: encryptedReservationGroupID,
        customerID: encryptedCustomerID,
        customerName: encryptedCustomerName,
        status: encryptedStatus
      }
    }));
    window.open(this._generalService.FormURL + url, '_blank');
  }
  refresh() {
    this.SearchReservationGroup = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent,
      {
        autoFocus: false,
        disableClose: true,
        data:
        {
          advanceTable: this.advanceTable,
          action: 'add',
          customer: this.customer,
          customerGroupID: this.customerGroupID,
          customerGroup: this.customerGroup,
          customerTypeID: this.customerTypeID,
          customerType: this.customerType,
          primaryBookerID: this.primaryBookerID,
          primaryBooker: this.primaryBooker,
          gender: this.gender,
          importance: this.importance,
          phone: this.phone,
          customerDepartment: this.customerDepartment,
          customerDesignation: this.customerDesignation,
          customerForBooker: this.customerForBooker,
          requestType: this.requestType, // Pass the request
          status: this.status
        }
      });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res !== undefined || res !== null) {
        this.reservationGroupID = res?.reservationGroupID;
        this.loadData();
        this.GetReservationGroupData();
        this.GetNumberOfBookings();
        this.noOfBooking = res?.numberOfBookings;
        if (this.noOfBooking === 1) {
          console.log(this.reservationGroupID);
          console.log(this.reservationID);
          this.showNotification(
            'snackbar-success',
            'Reservation Group Created...!!!',
            'bottom',
            'center'
          );
        }
      }
    })
  }

  navigateToNewForms() {
    // const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(this.reservationGroupID.toString()));
    // const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(this.ReservationID.toString()));
    // const encryptedCustomerGroupID = encodeURIComponent(this._generalService.encrypt(this.customerGroupID.toString()));
    // const url= this.router.serializeUrl(this.router.createUrlTree(['/newForm'], { queryParams: {
    //   reservationID:encryptedReservationID,     
    //   reservationGroupID: encryptedReservationGroupID ,
    //   customerGroupID:encryptedCustomerGroupID                 
    // } }));
    // window.open(this._generalService.FormURL+ url, '_blank');
  }

  edit(row, bookingCount: any) {
    row.numberOfBookings = bookingCount;
    this.reservationGroupID = row.reservationGroupID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customer: this.customer,
        customerGroupID: this.customerGroupID,
        customerGroup: this.customerGroup,
        customerTypeID: this.customerTypeID,
        customerType: this.customerType,
        primaryBookerID: this.primaryBookerID,
        primaryBooker: this.primaryBooker,
        gender: this.gender,
        importance: this.importance,
        phone: this.phone,
        customerDepartment: this.customerDepartment,
        customerDesignation: this.customerDesignation,
        customerForBooker: this.customerForBooker,
        status: this.status,
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        this.reservationGroupID = res;
        this.loadData();
        this.GetReservationGroupData();
      }
      else {
        this.loadData();
        this.GetReservationGroupData();
      }
    })
  }

  deleteItem(row) {
    this.reservationGroupID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent,
      {
        data: row
      });
  }

  public Filter() {
    this.PageNumber = 0;
    this.loadData();
  }

  public loadData() {
    if (this.reservationGroupID === undefined) {
      this.reservationGroupID = 0;
    }

    this.reservationGroupDetailsService.getTableData(this.reservationGroupID, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data => {
          this.dataSource = data;
          if (data && data.length > 0) {
            this.reservationID = data[0]?.reservationID;
          }
          // if(!this.dataSource)
          //   {
          //     this.addNew();
          //   } 
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  public GetReservationGroupData() {
    this.reservationGroupDetailsService.getReservationSourceData(this.reservationGroupID).subscribe
      (
        data => {
          this.advanceTable = data;
          if (data && data.length > 0) {
            this.reservationID = data[0]?.reservationID;
            console.log(this.reservationID);
          }
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  public GetNumberOfBookings() {
    this.reservationGroupDetailsService.getNumberOfBookings(this.reservationGroupID).subscribe
      (
        data => {
          this.bookingCount = data.bookingCount;
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
  onContextMenu(event: MouseEvent, item: ReservationGroup) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall() {
    if (this.dataSource?.length > 0) {
      this.PageNumber++;
      this.loadData();
    }
  }
  PreviousCall() {
    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  public SearchData() {
    this.loadData();
    //this.SearchReservationGroup='';

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
            if (this.MessageArray[0] == "ReservationGroupDetailsCreate") {
              if (this.MessageArray[1] == "ReservationGroupDetailsView") {
                if (this.MessageArray[2] == "Success") {
                  //this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Reservation Group Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "ReservationGroupDetailsUpdate") {
              if (this.MessageArray[1] == "ReservationGroupDetailsView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Reservation Group Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "ReservationGroupDetailsDelete") {
              if (this.MessageArray[1] == "ReservationGroupDetailsView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Reservation Group Deleted...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "ReservationGroupDetailsAll") {
              if (this.MessageArray[1] == "ReservationGroupDetailsView") {
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
    this.reservationGroupDetailsService.getTableDataSort(this.reservationGroupID, this.SearchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe
      (
        data => {
          this.dataSource = data;

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  //------- Add Duplicate Record ---------
  // duplicate(item:any)
  // {
  //   debugger;
  //   //item.numberOfBookings = item.numberOfBookings + 1;
  //   this.reservationGroupDetailsService.CreateDuplicate(item.reservationID)
  //   .subscribe(
  //     response => 
  //     {
  //       this.loadData();
  //       this.GetReservationGroupData();
  //       this._generalService.sendUpdate('ReservationGroupDetailsCreate:ReservationGroupDetailsView:Success');//To Send Updates  
  //     },
  //     error =>
  //     {
  //        this._generalService.sendUpdate('ReservationGroupDetailsAll:ReservationGroupDetailsView:Failure');//To Send Updates  
  //     }
  //   )
  // }

  duplicate(item: any) {
    const dialogRef = this.dialog.open(NewDuplicateDialogComponent,
      {
        data:
        {
          reservationID: item.reservationID,
          reservationGroupID: this.reservationGroupID,
          dataSource: item,
          // Don't pass restrictive status for duplicate operations
          status: 'Changes allow'
        }
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined || res !== null) {
        // Set flag to indicate recent duplication
        this.recentlyDuplicated = true;
        this.loadData();
        this.GetReservationGroupData();
        
        // Reset the flag after a short delay to allow for UI updates
        setTimeout(() => {
          this.recentlyDuplicated = false;
        }, 5000);
      }
    })
  }

  duplicateWithRange(item:any)
  {
    const dialogRef = this.dialog.open(DuplicateWithRangeDialogComponent, 
    {
      data: 
        {
          reservationID : item.reservationID,
          dataSource: item,
          // Allow changes for duplicate range operations
          status: 'Changes allow'
        }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res!==undefined || res !== null)
        {
          this.loadData();
          this.GetReservationGroupData();
        }
    })
  }

  // Normalize various possible status payload shapes
  private extractStatus(raw: any): string {
    if (!raw) return '';
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'object') {
      if (raw.status && typeof raw.status === 'string') return raw.status;
      if (raw.value && typeof raw.value === 'string') return raw.value;
    }
    return '';
  }

}



