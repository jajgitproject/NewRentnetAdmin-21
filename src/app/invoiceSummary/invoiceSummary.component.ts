// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InvoiceSummaryService } from './invoiceSummary.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { InvoiceSummary } from './invoiceSummary.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-invoiceSummary',
  templateUrl: './invoiceSummary.component.html',
  styleUrls: ['./invoiceSummary.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InvoiceSummaryComponent implements OnInit {
  displayedColumns = [
    'invoiceSummaryID',
    'customer',
    'state',
    'invoiceSummaryDate',
    'billSubmittedTo',
    'summaryDispatchStatus',
    'dispatchedBy',
    'dispatchDate',
    'createdBy',
    'activationStatus',
    'actions'
  ];
  dataSource: InvoiceSummary[] | null;
  invoiceSummaryID: number;
  advanceTable: InvoiceSummary | null;
  searchBillSubmittedTo: string = '';
  searchSummaryDispatchStatus: string = '';
  searchActivationStatus: boolean = true;
  pageNumber: number = 0;
  sortType: string = 'Descending';
  sortingData: number = 1;
  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public invoiceSummaryService: InvoiceSummaryService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public router: Router
  ) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.loadData();
    this.SubscribeUpdateService();
  }

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  refresh() {
    this.searchBillSubmittedTo = '';
    this.searchSummaryDispatchStatus = '';
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.searchActivationStatus = true;
    this.pageNumber = 0;
    this.sortType = 'Descending';
    this.sortingData = 1;
    this.loadData();
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
    this.invoiceSummaryID = row.invoiceSummaryID;
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
  }

  deleteItem(row) {
    this.invoiceSummaryID = row.invoiceSummaryID;
    this.dialog.open(DeleteDialogComponent, {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false;
  }

  public SearchData() {
    this.loadData();
  }

  public loadData() {
    switch (this.selectedFilter) {
      case 'billSubmittedTo':
        this.searchBillSubmittedTo = this.searchTerm;
        break;
      default:
        break;
    }

    this.invoiceSummaryService
      .getTableData(
        this.searchBillSubmittedTo,
        this.searchSummaryDispatchStatus,
        this.searchActivationStatus,
        this.pageNumber
      )
      .subscribe(
        (data) => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => {
          this.dataSource = null;
        }
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

  onContextMenu(event: MouseEvent, item: InvoiceSummary) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  attachOrDetachInvoices(item: InvoiceSummary) {
    const baseUrl = this._generalService.FormURL;
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/attachOrDetachInvoicesToSummary'], {
        queryParams: {
          SummaryID: item.invoiceSummaryID,
          CustomerID: item.customerID
        }
      })
    );
    window.open(baseUrl + url, '_blank');
  }

  printInvoiceSummary(item: InvoiceSummary) {
    const baseUrl = this._generalService.FormURL;
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/printInvoiceSummary'], {
        queryParams: {
          SummaryID: item.invoiceSummaryID
        }
      })
    );
    window.open(baseUrl + url, '_blank');
  }

  NextCall() {
    if (this.dataSource.length > 0) {
      this.pageNumber++;
      this.loadData();
    }
  }

  PreviousCall() {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.loadData();
    }
  }

  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription;

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe((message) => {
      this.messageReceived = message.text;
      this.MessageArray = this.messageReceived.split(':');
      if (this.MessageArray.length == 3) {
        if (this.MessageArray[0] == 'InvoiceSummaryCreate' && this.MessageArray[2] == 'Success') {
          this.refresh();
          this.showNotification('snackbar-success', 'Invoice Summary Created...!!!', 'bottom', 'center');
        } else if (this.MessageArray[0] == 'InvoiceSummaryUpdate' && this.MessageArray[2] == 'Success') {
          this.refresh();
          this.showNotification('snackbar-success', 'Invoice Summary Updated...!!!', 'bottom', 'center');
        } else if (this.MessageArray[0] == 'InvoiceSummaryDelete' && this.MessageArray[2] == 'Success') {
          this.refresh();
          this.showNotification('snackbar-success', 'Invoice Summary Deleted...!!!', 'bottom', 'center');
        } else if (this.MessageArray[0] == 'InvoiceSummaryAll' && this.MessageArray[2] == 'Failure') {
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
    this.invoiceSummaryService
      .getTableDataSort(
        this.searchBillSubmittedTo,
        this.searchSummaryDispatchStatus,
        this.searchActivationStatus,
        this.pageNumber,
        columnName.active,
        this.sortType
      )
      .subscribe(
        (data) => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => {
          this.dataSource = null;
        }
      );
  }

  formatDate(value: any): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString('en-GB');
  }

  getActivationLabel(value: boolean): string {
    return value === true ? 'Yes' : 'No';
  }
}
