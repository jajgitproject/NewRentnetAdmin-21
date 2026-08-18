// @ts-nocheck
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { FeedbackEmailMIS } from './feedbackEmailMIS.model';
import { FeedbackEmailMISService } from './feedbackEmailMIS.service';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-feedbackEmailMIS',
  templateUrl: './feedbackEmailMIS.component.html',
  styleUrls: ['./feedbackEmailMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FeedbackEmailMISComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'select',
    'IsFeedbackEmailSent',
    'ReservationID',
    'DutySlipID',
    'IsAllotted',
    'PickupDate',
    'Vehicle',
    'RegistrationNumber',
    'DriverName',
    'PickupCity',
    'PassengerName',
    'PassengerEmail',
    'PassengerID',
    'PassengerMobile',
    'PassengerFeedbackEmailAllowed',
    'CustomerName',
    'CustomerType',
    'CustomerFeedbackEmailAllowed',
    'KAM'
  ];


  dataSource: FeedbackEmailMIS[] | null;
  employeeID: number;
  row: FeedbackEmailMIS | null;
  SearchName: string = '';
  IsLockedOut: boolean = true;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  userType: string = 'Employee';
  dialogRef: MatDialogRef<any>;
  ActiveStatus: any;
  last: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  searchReservationID: any = '';
  searchDutySlipID: any = '';
  searchCustomerControl: FormControl = new FormControl('');
  customerOptions: any[] = [];
  searchIsAllotted: string = '';
  searchFromDate: string = '';
  searchToDate: string = '';
  selection = new SelectionModel<any>(true, []);

  sendJobId: string | null = null;
  sendJobStatus: any = null;
  sendJobRunning = false;
  sendJobError = '';
  sendJobStartedAt: number | null = null;
  private sendPollSub: Subscription;
  private customerAutocompleteSub: Subscription;

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
    this.initDefaultDates();
    this.setupCustomerAutocomplete();
    this.SubscribeUpdateService();
  }

  private initDefaultDates() {
    const today = moment();
    this.searchFromDate = today.clone().subtract(7, 'days').toDate();
    this.searchToDate = today.toDate();
  }

  private setupCustomerAutocomplete() {
    this.customerAutocompleteSub = this.searchCustomerControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        if (value && typeof value === 'object') {
          return of(this.customerOptions);
        }
        const term = (value || '').toString().trim();
        if (term.length < this._generalService.lengthToCheck) {
          this.customerOptions = [];
          return of([]);
        }
        return this._generalService.GetCustomerDropDownForControlPanel(term);
      })
    ).subscribe((list) => {
      this.customerOptions = list || [];
    });
  }

  displayCustomer(option: any): string {
    return option && typeof option === 'object' ? (option.customerName || '') : (option || '');
  }

  private getSelectedCustomerId(): string {
    const value = this.searchCustomerControl.value;
    const customerId = Number(value?.customerID ?? value?.CustomerID);
    return customerId > 0 ? String(customerId) : '';
  }

  private hasIncompleteCustomerSelection(): boolean {
    const value = this.searchCustomerControl.value;
    if (!value) {
      return false;
    }
    if (typeof value === 'object') {
      return !(Number(value.customerID ?? value.CustomerID) > 0);
    }
    return String(value).trim().length > 0;
  }

  ngOnDestroy() {
    this.stopSendPolling();
    if (this.customerAutocompleteSub) {
      this.customerAutocompleteSub.unsubscribe();
    }
    if (this.subscriptionName) {
      this.subscriptionName.unsubscribe();
    }
  }


  refresh() {
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.searchTerm = '';
    this.searchReservationID = '';
    this.searchDutySlipID = '';
    this.searchCustomerControl.setValue('');
    this.customerOptions = [];
    this.searchIsAllotted = '';
    this.selectedFilter = 'search';
    this.selection.clear();
    this.initDefaultDates();
    this.loadData();
  }

  public SearchData() {
    if (!this.searchFromDate || !this.searchToDate) {
      this.showNotification('snackbar-danger', 'From Date and To Date are required.', 'bottom', 'center');
      return;
    }
    if (this.hasIncompleteCustomerSelection()) {
      this.showNotification('snackbar-danger', 'Please select a customer from the list.', 'bottom', 'center');
      return;
    }
    this.PageNumber = 0;
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


  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  public loadData() {
    const fromDate = this.formatSearchDate(this.searchFromDate);
    const toDate = this.formatSearchDate(this.searchToDate);

    if (!fromDate || !toDate) {
      return;
    }

    this.feedbackEmailMISService.getTableData(
      this.searchReservationID,
      this.searchDutySlipID,
      this.getSelectedCustomerId(),
      this.searchIsAllotted,
      fromDate,
      toDate,
      this.PageNumber
    ).subscribe
      (
        data => {
          this.dataSource = data;
          this.selection.clear();
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  private formatSearchDate(value: any): string {
    if (!value) {
      return '';
    }
    return moment(value).format('MMM DD yyyy');
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

  formatYesNo(value: any): string {
    if (value === true || value === 1 || value === '1' || value === 'true') {
      return 'Yes';
    }
    return 'No';
  }

  getRecordCount(): number {
    return Array.isArray(this.dataSource) ? this.dataSource.length : 0;
  }

  getBookingNo(row: any): string {
    if (!row?.reservationID) {
      return 'N/A';
    }
    if (row.reservationGroupID) {
      return row.reservationGroupID + '.' + row.reservationID;
    }
    return String(row.reservationID);
  }

  feedbackCall() {
    const selectedRows = this.selection.selected;

    if (!selectedRows || selectedRows.length === 0) {
      Swal.fire({
        title: 'Please select at least one passenger',
        icon: 'warning',
      });
      return;
    }

    if (this.sendJobRunning) {
      Swal.fire({
        title: 'A feedback email job is already running',
        icon: 'info',
      });
      return;
    }

    const withEmail = selectedRows.filter(row =>
      (row.passengerEmail || '').toString().trim().includes('@')
    );
    const missingEmail = selectedRows.length - withEmail.length;

    Swal.fire({
      title: 'Send Feedback Email?',
      html: missingEmail > 0
        ? `Emails will be sent to <b>${withEmail.length}</b> selected passenger(s).<br/>${missingEmail} row(s) without a valid email will be skipped.`
        : `Feedback emails will be sent to <b>${withEmail.length}</b> selected passenger(s) in the background.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed || result.value) {
        this.startFeedbackEmailJob(selectedRows);
      }
    });
  }

  private startFeedbackEmailJob(selectedRows: any[]) {
    const reservationIDs = selectedRows
      .map(row => Number(row.reservationID))
      .filter(id => id > 0);

    if (reservationIDs.length === 0) {
      Swal.fire({
        title: 'No valid reservations selected',
        icon: 'warning',
      });
      return;
    }

    this.sendJobError = '';
    this.sendJobStartedAt = Date.now();
    this.sendJobRunning = true;
    this.showNotification('snackbar-info', 'Feedback email job started. Emails will be sent in batches.', 'bottom', 'center');

    this.feedbackEmailMISService.startSendJob(
      reservationIDs,
      this._generalService.getUserID()
    ).subscribe(
      (startResult: any) => {
        const jobId = startResult?.jobId ?? startResult?.JobId;
        if (!jobId) {
          this.sendJobRunning = false;
          this.sendJobError = 'Could not start feedback email job.';
          this.showNotification('snackbar-danger', this.sendJobError, 'bottom', 'center');
          return;
        }

        this.sendJobId = jobId;
        this.sendJobStatus = {
          jobId,
          status: startResult?.status ?? startResult?.Status ?? 'Pending',
          message: startResult?.message ?? startResult?.Message ?? 'Feedback email job queued'
        };
        this.startSendPolling(jobId);
      },
      async (error) => {
        this.sendJobRunning = false;
        this.sendJobError = await this.extractJobErrorMessage(error);
        this.showNotification('snackbar-danger', this.sendJobError, 'bottom', 'center');
      }
    );
  }

  isSendJobInProgress(): boolean {
    return this.sendJobRunning || this.feedbackEmailMISService.isSendJobRunning(this.sendJobStatus);
  }

  getSendJobStatusLabel(): string {
    return this.sendJobStatus?.status ?? this.sendJobStatus?.Status ?? '';
  }

  getSendJobMessage(): string {
    return this.sendJobStatus?.message ?? this.sendJobStatus?.Message ?? this.sendJobError ?? '';
  }

  getSendProcessedCount(): number {
    return this.sendJobStatus?.processedCount ?? this.sendJobStatus?.ProcessedCount ?? 0;
  }

  getSendTotalCount(): number {
    return this.sendJobStatus?.totalCount ?? this.sendJobStatus?.TotalCount ?? 0;
  }

  getSendElapsedTime(): string {
    if (!this.sendJobStartedAt) {
      return '—';
    }
    const elapsedSeconds = Math.floor((Date.now() - this.sendJobStartedAt) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  private startSendPolling(jobId: string) {
    this.stopSendPolling();
    this.sendPollSub = this.feedbackEmailMISService.pollSendJob(jobId).subscribe(
      (status: any) => {
        this.sendJobStatus = status;
        const current = String(status?.status ?? status?.Status ?? '').toLowerCase();

        if (current === 'failed') {
          this.sendJobRunning = false;
          this.sendJobError = status?.message ?? status?.Message ?? 'Feedback email job failed.';
          this.showNotification('snackbar-danger', this.sendJobError, 'bottom', 'center');
          this.stopSendPolling();
          return;
        }

        if (current === 'completed') {
          this.sendJobRunning = false;
          this.showNotification(
            'snackbar-success',
            status?.message ?? 'Feedback emails sent.',
            'bottom',
            'center'
          );
          this.stopSendPolling();
          this.selection.clear();
          this.loadData();
        }
      },
      async (error) => {
        this.sendJobRunning = false;
        this.sendJobError = await this.extractJobErrorMessage(error);
        this.showNotification('snackbar-danger', this.sendJobError, 'bottom', 'center');
        this.stopSendPolling();
      }
    );
  }

  private stopSendPolling() {
    if (this.sendPollSub) {
      this.sendPollSub.unsubscribe();
      this.sendPollSub = undefined;
    }
  }

  private async extractJobErrorMessage(error: any): Promise<string> {
    const fallback = 'Could not send feedback emails.';
    if (!error) {
      return fallback;
    }

    const blob = error?.error;
    if (blob instanceof Blob) {
      const text = await blob.text();
      try {
        const parsed = JSON.parse(text || '{}');
        return parsed.message || text || fallback;
      } catch {
        return text || fallback;
      }
    }

    return error?.error?.message || error?.message || fallback;
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
    this.feedbackEmailMISService.getTableDataSort(
      this.searchReservationID,
      this.searchDutySlipID,
      this.getSelectedCustomerId(),
      this.searchIsAllotted,
      this.formatSearchDate(this.searchFromDate),
      this.formatSearchDate(this.searchToDate),
      this.PageNumber,
      coloumName.active,
      this.sortType
    ).subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
}
