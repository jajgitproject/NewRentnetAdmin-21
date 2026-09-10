// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PostPickupCallMis, PostPickupCallMisSearchCriteria } from './postPickupCallMis.model';
import { PostPickupCallMisService } from './postPickupCallMis.service';

@Component({
  standalone: false,
  selector: 'app-postPickupCallMis',
  templateUrl: './postPickupCallMis.component.html',
  styleUrls: ['./postPickupCallMis.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PostPickupCallMisComponent implements OnInit {
  displayedColumns = [
    'bookingNo',
    'serviceLocation',
    'pickUpDate',
    'guestName',
    'customerName',
    'gender',
    'postPickupCallStatus',
    'postPickupCallCheckedBy',
    'postPickupCheckDatetime',
    'postPickupRemarks'
  ];

  columnTitleMap = {
    bookingNo: 'Booking No',
    serviceLocation: 'Service Location',
    pickUpDate: 'Pick up Date',
    guestName: 'Guest Name',
    customerName: 'Customer Name',
    gender: 'Gender',
    postPickupCallStatus: 'Post Pickup Call Status',
    postPickupCallCheckedBy: 'Post Pickup Call Checked By',
    postPickupCheckDatetime: 'Post Pickup Check Datetime',
    postPickupRemarks: 'Post Pickup Remarks'
  };

  dataSource: PostPickupCallMis[] = [];
  PageNumber = 0;
  hasManualSearch = false;

  searchPickupDateFrom: any = '';
  searchPickupDateTo: any = '';
  searchPostPickupCallFilter = 'All';

  constructor(
    private postPickupCallMisService: PostPickupCallMisService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  SearchData(): void {
    this.PageNumber = 0;
    this.hasManualSearch = true;
    this.loadData();
  }

  refresh(): void {
    this.searchPickupDateFrom = '';
    this.searchPickupDateTo = '';
    this.searchPostPickupCallFilter = 'All';
    this.PageNumber = 0;
    this.hasManualSearch = false;
    this.dataSource = [];
  }

  loadData(): void {
    const criteria = this.buildSearchCriteria();
    this.postPickupCallMisService.getTableData(criteria, this.PageNumber).subscribe(
      (data) => {
        const rows = Array.isArray(data) ? data : (data?.$values || data?.data || []);
        this.dataSource = (rows || []).map((row) => this.normalizeRow(row));
      },
      (error: HttpErrorResponse | string) => {
        this.dataSource = [];
        const message = typeof error === 'string'
          ? error
          : (error?.error || error?.message || 'Post Pickup Call MIS search failed');
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  private normalizeRow(row: any) {
    if (!row) {
      return row;
    }
    return {
      bookingNo: row.bookingNo ?? row.BookingNo,
      serviceLocation: row.serviceLocation ?? row.ServiceLocation,
      pickUpDate: row.pickUpDate ?? row.PickUpDate,
      guestName: row.guestName ?? row.GuestName,
      customerName: row.customerName ?? row.CustomerName,
      gender: row.gender ?? row.Gender,
      postPickupCallStatus: row.postPickupCallStatus ?? row.PostPickupCallStatus,
      postPickupCallCheckedBy: row.postPickupCallCheckedBy ?? row.PostPickupCallCheckedBy,
      postPickupCheckDatetime: row.postPickupCheckDatetime ?? row.PostPickupCheckDatetime,
      postPickupRemarks: row.postPickupRemarks ?? row.PostPickupRemarks
    };
  }

  NextCall(): void {
    if (this.dataSource?.length > 0) {
      this.PageNumber++;
      this.loadData();
    }
  }

  PreviousCall(): void {
    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  private buildSearchCriteria(): PostPickupCallMisSearchCriteria {
    return {
      pickupDateFrom: this.searchPickupDateFrom ? moment(this.searchPickupDateFrom).format('MMM DD yyyy') : '',
      pickupDateTo: this.searchPickupDateTo ? moment(this.searchPickupDateTo).format('MMM DD yyyy') : '',
      postPickupCallFilter: this.searchPostPickupCallFilter || 'All'
    };
  }

  private showNotification(colorName: string, text: string, placementFrom: any, placementAlign: any): void {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
