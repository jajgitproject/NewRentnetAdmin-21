// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BookingRefusalService } from './bookingRefusal.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BookingRefusal } from './bookingRefusal.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { BookingRefusalSearchDialogComponent } from './dialogs/search-dialog/search-dialog.component';
import { formatDate } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-booking-refusal',
  templateUrl: './bookingRefusal.component.html',
  styleUrls: ['./bookingRefusal.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BookingRefusalComponent implements OnInit {
  displayedColumns = [
    'customerName',
    'cityName',
    'dutyType',
    'vehicle',
    'pickUpDate',
    'pickUpTime',
    'locationName',
    'remarks',
    'activationStatus',
    'actions'
  ];
  dataSource: BookingRefusal[] | null;
  advanceTable: BookingRefusal | null;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  selectedFilter: string = 'search';
  searchTerm: any = '';
  searchField: string = 'search';
  searchValue: string = 'null';
  advancedSearchCriteria: any = null;
  listOrderByColumn = 'ReservationRefusalID';
  listOrder = 'Descending';
  csvDownloading = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public bookingRefusalService: BookingRefusalService,
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
    this.loadData();
    this.SubscribeUpdateService();
  }

  refresh() {
    this.selectedFilter = 'search';
    this.searchTerm = '';
    this.searchField = 'search';
    this.searchValue = 'null';
    this.advancedSearchCriteria = null;
    this.PageNumber = 0;
    this.loadData();
  }

  openSearchDialog() {
    const dialogRef = this.dialog.open(BookingRefusalSearchDialogComponent, {
      panelClass: 'booking-refusal-search-dialog-panel',
      width: '60vw',
      maxWidth: '60vw',
      maxHeight: '90vh',
      autoFocus: false,
      data: { criteria: this.advancedSearchCriteria }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.searched) {
        this.advancedSearchCriteria = result.criteria || {};
        this.PageNumber = 0;
        this.loadListData();
      }
    });
  }

  downloadCsv() {
    if (this.csvDownloading) {
      return;
    }
    const criteria = this.buildExportCriteria();
    this.csvDownloading = true;
    this.bookingRefusalService.exportSearch(criteria).subscribe(
      data => {
        this.csvDownloading = false;
        const rows = (data || []).map(r => new BookingRefusal(r));
        if (!rows.length) {
          this.showNotification(
            'snackbar-danger',
            'No records found for the selected criteria.',
            'bottom',
            'center'
          );
          return;
        }
        this.writeCsvDownload(rows);
        this.showNotification('snackbar-success', 'CSV downloaded successfully.', 'bottom', 'center');
      },
      () => {
        this.csvDownloading = false;
        this.showNotification('snackbar-danger', 'CSV export failed.', 'bottom', 'center');
      }
    );
  }

  private buildExportCriteria(): any {
    if (this.advancedSearchCriteria != null) {
      return { ...this.advancedSearchCriteria };
    }
    this.resolveSearchParams();
    const criteria: any = { activationStatus: true };
    const term = String(this.searchTerm || '').trim();
    if (!term || this.selectedFilter === 'search') {
      return criteria;
    }
    switch (this.selectedFilter) {
      case 'CustomerName':
        criteria.customerName = term;
        break;
      case 'City':
        criteria.cityName = term;
        break;
      case 'DutyType':
        criteria.dutyType = term;
        break;
      case 'Car':
        criteria.vehicle = term;
        break;
      case 'Date':
        criteria.pickUpDateString = term;
        break;
      case 'Location':
        criteria.locationName = term;
        break;
      default:
        break;
    }
    return criteria;
  }

  private writeCsvDownload(rows: BookingRefusal[]) {
    const headers = [
      'Customer Name',
      'City',
      'Duty Type',
      'Car',
      'Date',
      'Time',
      'Location',
      'Remarks',
      'Activation Status'
    ];
    const lines = rows.map(row => [
      row.customerName || '',
      row.cityName || '',
      row.dutyType || '',
      row.vehicle || '',
      this.formatCsvDate(row),
      row.pickUpTimeString || '',
      row.locationName || '',
      row.remarks || '',
      row.activationStatus === false ? 'Deactive' : 'Active'
    ]);
    const csv = [headers, ...lines]
      .map(line => line.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BookingRefusal_${formatDate(new Date(), 'yyyyMMdd-HHmmss', 'en-GB')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private formatCsvDate(row: BookingRefusal): string {
    if (row.pickUpDateString) {
      return row.pickUpDateString;
    }
    if (row.pickUpDate) {
      return String(row.pickUpDate).substring(0, 10);
    }
    return '';
  }

  addNew() {
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: 'add'
      }
    });
  }

  editCall(row) {
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
  }

  deleteItem(row) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.deleted && result.reservationRefusalID != null) {
        this.removeRowFromList(result.reservationRefusalID);
        this.showNotification(
          'snackbar-success',
          'Booking Refusal Deleted...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  private removeRowFromList(reservationRefusalID: number) {
    if (!this.dataSource?.length) {
      return;
    }
    const next = this.dataSource.filter(r => r.reservationRefusalID !== reservationRefusalID);
    this.dataSource = next.length ? next : null;
  }

  private mapListRecords(data: any[]): BookingRefusal[] {
    const rows = (data || []).map(r => new BookingRefusal(r));
    if (this.advancedSearchCriteria?.activationStatus === false) {
      return rows;
    }
    return rows.filter(r => r.activationStatus !== false);
  }

  private loadListData() {
    this.resolveSearchParams();
    const usingQuickFilter =
      (this.selectedFilter !== 'search' && this.searchTerm) ||
      (this.selectedFilter === 'search' && this.searchTerm && String(this.searchTerm).trim() !== '');

    if (usingQuickFilter) {
      this.advancedSearchCriteria = null;
      this.loadDataFromQuickFilter();
      return;
    }

    if (this.advancedSearchCriteria != null) {
      const payload = {
        ...this.advancedSearchCriteria,
        pageNumber: this.PageNumber,
        orderByColumn: this.listOrderByColumn,
        order: this.listOrder
      };
      this.bookingRefusalService.search(payload).subscribe(
        data => {
          const rows = this.mapListRecords(data);
          this.dataSource = rows.length ? rows : null;
        },
        () => {
          this.dataSource = null;
        }
      );
      return;
    }
    this.loadDataFromQuickFilter();
  }

  public loadData() {
    this.loadListData();
  }

  private loadDataFromQuickFilter() {
    this.resolveSearchParams();
    this.bookingRefusalService
      .getTableData(this.searchField, this.searchValue, this.PageNumber)
      .subscribe(
        data => {
          const rows = this.mapListRecords(data);
          this.dataSource = rows.length ? rows : null;
        },
        (error: HttpErrorResponse) => {
          this.dataSource = null;
        }
      );
  }

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  private resolveSearchParams() {
    if (this.selectedFilter === 'search' || !this.searchTerm) {
      this.searchField = 'search';
      this.searchValue = 'null';
    } else {
      this.searchField = this.selectedFilter;
      this.searchValue = this.searchTerm;
    }
  }

  onContextMenu(event: MouseEvent, item: BookingRefusal) {
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

  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription;

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe(message => {
      this.messageReceived = message.text;
      this.MessageArray = this.messageReceived.split(':');
      if (this.MessageArray.length == 3) {
        if (
          this.MessageArray[0] == 'BookingRefusalCreate' &&
          this.MessageArray[1] == 'BookingRefusalView' &&
          this.MessageArray[2] == 'Success'
        ) {
          this.refresh();
          this.showNotification('snackbar-success', 'Booking Refusal Created...!!!', 'bottom', 'center');
        } else if (
          this.MessageArray[0] == 'BookingRefusalUpdate' &&
          this.MessageArray[1] == 'BookingRefusalView' &&
          this.MessageArray[2] == 'Success'
        ) {
          this.refresh();
          this.showNotification('snackbar-success', 'Booking Refusal Updated...!!!', 'bottom', 'center');
        } else if (
          this.MessageArray[0] == 'BookingRefusalAll' &&
          this.MessageArray[1] == 'BookingRefusalView' &&
          this.MessageArray[2] == 'Failure'
        ) {
          this.refresh();
          this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
        }
      }
    });
  }

  SortingData(columnName: any) {
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.listOrderByColumn = columnName.active;
    this.listOrder = this.sortType;

    if (this.advancedSearchCriteria != null) {
      this.loadListData();
      return;
    }

    this.resolveSearchParams();
    this.bookingRefusalService
      .getTableDataSort(
        this.searchField,
        this.searchValue,
        this.PageNumber,
        columnName.active,
        this.sortType
      )
      .subscribe(
        data => {
          const rows = this.mapListRecords(data);
          this.dataSource = rows.length ? rows : null;
        },
        (error: HttpErrorResponse) => {
          this.dataSource = null;
        }
      );
  }

  formatDisplayDate(row: BookingRefusal): string {
    if (row.pickUpDateString) {
      return row.pickUpDateString;
    }
    if (row.pickUpDate) {
      return String(row.pickUpDate).substring(0, 10);
    }
    return '';
  }

  formatActivationStatus(row: BookingRefusal): string {
    return row.activationStatus === false ? 'Deactive' : 'Active';
  }
}
