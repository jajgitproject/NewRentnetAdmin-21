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
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { FeedbackEmailMIS } from './feedbackEmailMIS.model';
import { FeedbackEmailMISService } from './feedbackEmailMIS.service';
import { FormDialogSendFeedbackMailComponent } from '../sendFeedbackMail/dialogs/form-dialog/form-dialog.component';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-feedbackEmailMIS',
  templateUrl: './feedbackEmailMIS.component.html',
  styleUrls: ['./feedbackEmailMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FeedbackEmailMISComponent implements OnInit {
  displayedColumns = [
  'select',
  'PickupDate' ,
  'GuestName',
  'Gender',
  'DriverName' ,
  'City' , 
  'RegistrationNumber',
  'Vehicle',
  'VehicleCategory' ,
  'PrimaryEmail', 
  'PrimaryMobile' ,
  'DutySlipID', 
  'ReservationID',  
  'UserName',
  'CustomerName' ,
  'CustomerType',  
  'Message',
  'MessageType' ,
  'MessageSource', 

  ];


  dataSource: FeedbackEmailMIS[] | null;
  employeeID: number;
  row: FeedbackEmailMIS | null;
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

  searchTerm: any = '';
  selectedFilter: string = 'search';
  searchDutySlipID:any='';
  searchFromDate:string='';
  searchToDate:string='';
  selection = new SelectionModel<any>(true, []);

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public feedbackEmailMISService: FeedbackEmailMISService,
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
    this.loadData();
    this.SubscribeUpdateService();

  }


  refresh() {
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.searchTerm = '';
    this.searchFromDate='';
    this.searchToDate='';
    this.searchDutySlipID='';
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
  toggleRowSelection(row: any) {
    this.selection.toggle(row);
  }

  isRowSelected(row: any): boolean {
    return this.selection.isSelected(row);
  }

  toggleSelectAll(event: any) {
    if (event.checked) {
      this.selection.select(...this.dataSource);
    } else {
      this.selection.clear();
    }
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.length && this.dataSource.length > 0;
  }

  isIndeterminate(): boolean {
    return this.selection.selected.length > 0 && !this.isAllSelected();
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
    if(this.searchFromDate!=="")
      {
        this.searchFromDate=moment(this.searchFromDate).format('MMM DD yyyy');
      }
      if(this.searchToDate!=="")
      {
        this.searchToDate=moment(this.searchToDate).format('MMM DD yyyy');
      }
    
    this.feedbackEmailMISService.getTableData(this.searchDutySlipID,this.searchFromDate,this.searchToDate,this.PageNumber).subscribe
      (
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
  onContextMenu(event: MouseEvent, item: FeedbackEmailMIS) {
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
  
  // feedbackCall() {
  //   debugger;
  //   const selectedRows = this.selection.selected; // Get all selected rows
  //   if (selectedRows.length === 0) {
  //     // Show warning if no rows are selected
  //     Swal.fire({
  //       title: 'Please select atLeast one Guest',
  //       icon: 'warning',
  //     }).then((result) => {
  //       if (result.value) {
  //         // Additional actions if needed
  //       }
  //     });
  //     return;
  //   }
  
  //   // Handle multiple selections
  //   const dialogData = selectedRows.map(row => ({
  //     reservationID: row.reservationID,
  //     vehicle: row.vehicle,
  //     pickupDate: row.pickupDate,
  //     pickupTime: row.pickupTime,
  //     registrationNumber: row.registrationNumber,
  //     customerPersonName: row.customerPersonName,
  //     city: row.city,
  //     customerPersonID: row.customerPersonID,
  //     item: row
  //   }));
     
  //   this.dialog.open(FormDialogSendFeedbackMailComponent, {
  //     width: '70%',
  //     data: dialogData.length === 1 ? dialogData[0] : dialogData, // Single or multiple
  //   });
  // }

  feedbackCall() {
    debugger;
    const selectedRows = this.selection.selected; // Get all selected rows

    if (selectedRows.length === 0) {
        Swal.fire({
            title: 'please select at least one guest',
            icon: 'warning',
        });
        return;
    }

    this.dialog.open(FormDialogSendFeedbackMailComponent, {
        width: '70%',
        data: selectedRows // Pass all selected rows
    });
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
    this.feedbackEmailMISService.getTableDataSort(this.searchDutySlipID,this.searchFromDate,this.searchToDate,this.PageNumber, coloumName.active, this.sortType).subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
}




