// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CustomerMeetingService } from './customerMeeting.service';
import { CustomerMeeting } from './customerMeeting.model';
import { GeneralService } from '../general/general.service';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { StatusDialogComponent } from './dialogs/status-dialog/status-dialog.component';
import { RemarkDialogComponent } from './dialogs/remark-dialog/remark-dialog.component';
import { CustomerMeetingDropDown } from './customerMeetingDropDown.model';
import { CustomerGroupMeetingDropDown } from './customerGroupMeetingDropDown.model';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-customerMeeting',
  templateUrl: './customerMeeting.component.html',
  styleUrls: ['./customerMeeting.component.sass']
})
export class CustomerMeetingComponent implements OnInit {
  displayedColumns = [
    'customerGroup',
    'employeeName',
    'modeOfMeeting',
    'meetingDate',
    'metWithName',
    'meetingSubject',
    'meetingStatus',
    'recordCreatedOnDate',
    'actions'
  ];

  dataSource: CustomerMeeting[] = [];
  PageNumber: number = 0;
  sortingData: number = 1;
  sortType: string = 'Descending';

  searchCustomerGroupID: number = 0;
  searchCustomerGroupName: string = '';
  searchModeOfMeeting: string = '';
  searchMeetingDate: string = '';
  searchMeetingStatus: string = '';
  searchEmployeeName: string = '';

  modeOfMeetingList: CustomerMeetingDropDown[] = [];
  meetingStatusList: CustomerMeetingDropDown[] = [];

  customerGroupFilter = new FormControl('');
  filteredCustomerGroupOptions: Observable<CustomerGroupMeetingDropDown[]>;

  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription;

  constructor(
    public dialog: MatDialog,
    public customerMeetingService: CustomerMeetingService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  ngOnInit() {
    this.loadDropdowns();
    this.initCustomerGroupFilter();
    this.loadData();
    this.SubscribeUpdateService();
  }

  loadDropdowns() {
    this.customerMeetingService.getModeOfMeetingForDropDown().subscribe(data => {
      this.modeOfMeetingList = data || [];
    });
    this.customerMeetingService.getMeetingStatusForDropDown().subscribe(data => {
      this.meetingStatusList = data || [];
    });
  }

  initCustomerGroupFilter() {
    const userID = this._generalService.getUserID();
    this.filteredCustomerGroupOptions = this.customerGroupFilter.valueChanges.pipe(
      debounceTime(300),
      switchMap((value: string) => this.customerMeetingService.getCustomerGroupForDropDownPrefix(userID, value || ''))
    );
  }

  onCustomerGroupSelected(option: CustomerGroupMeetingDropDown) {
    if (option) {
      this.searchCustomerGroupID = option.customerGroupID;
      this.searchCustomerGroupName = option.customerGroup;
    }
  }

  displayCustomerGroup(option?: CustomerGroupMeetingDropDown): string {
    return option ? option.customerGroup : this.searchCustomerGroupName || '';
  }

  refresh() {
    this.searchCustomerGroupID = 0;
    this.searchCustomerGroupName = '';
    this.searchModeOfMeeting = '';
    this.searchMeetingDate = '';
    this.searchMeetingStatus = '';
    this.searchEmployeeName = '';
    this.customerGroupFilter.setValue('');
    this.PageNumber = 0;
    this.loadData();
  }

  addNew() {
    this.dialog.open(FormDialogComponent, {
      width: '920px',
      maxWidth: '96vw',
      data: {
        advanceTable: null,
        action: 'add'
      }
    });
  }

  updateStatus(row: CustomerMeeting) {
    setTimeout(() => {
      this.dialog.open(StatusDialogComponent, {
        width: '600px',
        maxWidth: '96vw',
        data: {
          advanceTable: this.normalizeRow(row)
        }
      });
    });
  }

  openMeetingRemarks(row: CustomerMeeting) {
    setTimeout(() => {
      this.dialog.open(RemarkDialogComponent, {
        width: '820px',
        maxWidth: '96vw',
        data: {
          advanceTable: this.normalizeRow(row)
        }
      });
    });
  }

  viewDetails(row: CustomerMeeting) {
    setTimeout(() => {
      this.dialog.open(FormDialogComponent, {
        width: '920px',
        maxWidth: '96vw',
        maxHeight: '95vh',
        data: {
          advanceTable: this.normalizeRow(row),
          action: 'view'
        }
      });
    });
  }

  public Filter() {
    this.PageNumber = 0;
    this.loadData();
  }

  private normalizeRow(row: any): CustomerMeeting {
    return {
      customerMeetingID: row?.customerMeetingID ?? row?.CustomerMeetingID,
      customerGroupID: row?.customerGroupID ?? row?.CustomerGroupID,
      customerGroup: row?.customerGroup ?? row?.CustomerGroup,
      employeeID: row?.employeeID ?? row?.EmployeeID,
      employeeName: row?.employeeName ?? row?.EmployeeName,
      modeOfMeeting: row?.modeOfMeeting ?? row?.ModeOfMeeting,
      meetingDate: row?.meetingDate ?? row?.MeetingDate,
      meetingDateString: row?.meetingDateString ?? row?.MeetingDateString,
      metWithName: row?.metWithName ?? row?.MetWithName,
      metWithDesignation: row?.metWithDesignation ?? row?.MetWithDesignation,
      meetingSubject: row?.meetingSubject ?? row?.MeetingSubject,
      meetingDetails: row?.meetingDetails ?? row?.MeetingDetails,
      recordCreatedOnDate: row?.recordCreatedOnDate ?? row?.RecordCreatedOnDate,
      recordCreatedOnTime: row?.recordCreatedOnTime ?? row?.RecordCreatedOnTime,
      recordCreatedByID: row?.recordCreatedByID ?? row?.RecordCreatedByID,
      recordCreatedByName: row?.recordCreatedByName ?? row?.RecordCreatedByName,
      meetingStatus: row?.meetingStatus ?? row?.MeetingStatus,
      meetingStatusRemark: row?.meetingStatusRemark ?? row?.MeetingStatusRemark,
      userID: row?.userID ?? row?.UserID
    };
  }

  public loadData() {
    const userID = this._generalService.getUserID();
    this.customerMeetingService.getTableData(
      userID,
      this.searchCustomerGroupID,
      this.searchModeOfMeeting,
      this.searchMeetingDate,
      this.searchMeetingStatus,
      this.searchEmployeeName,
      this.PageNumber,
      'CustomerMeetingID',
      this.sortType
    ).subscribe(
      data => {
        const rows = Array.isArray(data) ? data : [];
        this.dataSource = rows.map(row => this.normalizeRow(row));
      },
      (error: HttpErrorResponse) => {
        this.dataSource = [];
        console.error('CustomerMeeting list failed', error);
      }
    );
  }

  SortingData(coloumName: any) {
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    const userID = this._generalService.getUserID();
    this.customerMeetingService.getTableData(
      userID,
      this.searchCustomerGroupID,
      this.searchModeOfMeeting,
      this.searchMeetingDate,
      this.searchMeetingStatus,
      this.searchEmployeeName,
      this.PageNumber,
      coloumName.active,
      this.sortType
    ).subscribe(
      data => {
        const rows = Array.isArray(data) ? data : [];
        this.dataSource = rows.map(row => this.normalizeRow(row));
      },
      (error: HttpErrorResponse) => {
        this.dataSource = [];
        console.error('CustomerMeeting sort failed', error);
      }
    );
  }

  NextCall() {
    if (this.dataSource && this.dataSource.length > 0) {
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

  showNotification(customerMeetingName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: customerMeetingName
    });
  }

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe(message => {
      this.messageReceived = message.text;
      this.MessageArray = this.messageReceived.split(':');
      if (this.MessageArray.length == 3) {
        if (this.MessageArray[0] == 'CustomerMeetingCreate' && this.MessageArray[2] == 'Success') {
          this.refresh();
          this.showNotification('snackbar-success', 'Customer Meeting Created ...!!!', 'bottom', 'center');
        } else if (this.MessageArray[0] == 'CustomerMeetingUpdate' && this.MessageArray[2] == 'Success') {
          this.loadData();
          this.showNotification('snackbar-success', 'Customer Meeting Status Updated ...!!!', 'bottom', 'center');
        } else if (this.MessageArray[0] == 'CustomerMeetingRemarkCreate' && this.MessageArray[2] == 'Success') {
          this.showNotification('snackbar-success', 'Meeting Remark Saved ...!!!', 'bottom', 'center');
        } else if (this.MessageArray[0] == 'CustomerMeetingAll' && this.MessageArray[2] == 'Failure') {
          this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
        }
      }
    });
  }
}
