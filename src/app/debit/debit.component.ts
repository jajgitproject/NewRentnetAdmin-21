// @ts-nocheck
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DebitService } from './debit.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DebitModel } from './debit.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DebitLogDialogComponent } from './dialogs/log-dialog/log-dialog.component';
import { formatDate } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-debit',
  templateUrl: './debit.component.html',
  styleUrls: ['./debit.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DebitComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'debitID',
    'driverName',
    'date',
    'locationName',
    'debitType',
    'amount',
    'debitFrom',
    'status',
    'actions'
  ];
  dataSource: DebitModel[] | null;
  PageNumber = 0;
  selectedFilter = 'search';
  searchTerm = '';
  searchField = 'search';
  sortingData = 0;
  sortType = 'Descending';
  sortColumn = 'DebitID';
  actionRow: DebitModel | null = null;

  useAdvancedSearch = false;
  activationStatusFilter = 'active';
  SearchDebitID = '';
  SearchDriver = '';
  SearchLocation = '';
  SearchDebitType = '';
  SearchSupplier = '';
  SearchRegistration = '';
  SearchDateFrom: Date | null = null;
  SearchDateTo: Date | null = null;

  private subscriptionName: Subscription;

  constructor(
    public dialog: MatDialog,
    public debitService: DebitService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  setActionRow(row: DebitModel): void {
    this.actionRow = row;
  }

  ngOnInit() {
    this.loadData();
    this.SubscribeUpdateService();
  }

  ngOnDestroy() {
    if (this.subscriptionName) {
      this.subscriptionName.unsubscribe();
    }
  }

  refresh() {
    this.selectedFilter = 'search';
    this.searchTerm = '';
    this.searchField = 'search';
    this.activationStatusFilter = 'active';
    this.useAdvancedSearch = false;
    this.SearchDebitID = '';
    this.SearchDriver = '';
    this.SearchLocation = '';
    this.SearchDebitType = '';
    this.SearchSupplier = '';
    this.SearchRegistration = '';
    this.SearchDateFrom = null;
    this.SearchDateTo = null;
    this.PageNumber = 0;
    this.loadData();
  }

  addNew() {
    this.dialog.open(FormDialogComponent, {
      width: '900px',
      data: { action: 'add' }
    });
  }

  editCall(row) {
    const debitId = row.debitID ?? row.DebitID;
    this.debitService.getById(debitId).subscribe(
      (detail) => {
        this.dialog.open(FormDialogComponent, {
          width: '900px',
          data: {
            advanceTable: detail || row,
            action: 'edit'
          }
        });
      },
      () => {
        this.dialog.open(FormDialogComponent, {
          width: '900px',
          data: { advanceTable: row, action: 'edit' }
        });
      }
    );
  }

  deleteItem(row) {
    if (row.readOnlyOnDebitScreen) {
      this.showNotification('snackbar-danger', 'Incidence debits cannot be deleted here.', 'bottom', 'center');
      return;
    }
    this.dialog.open(DeleteDialogComponent, { data: row });
  }

  restoreItem(row) {
    const debitId = row?.debitID ?? row?.DebitID;
    if (!debitId) {
      return;
    }
    this.debitService.setActivationStatus(debitId, true).subscribe(
      () => {
        this._generalService.sendUpdate('DebitUpdate:DebitView:Success');
        this.showNotification('snackbar-success', 'Debit restored...!!!', 'bottom', 'center');
        this.loadData();
      },
      () => {
        this._generalService.sendUpdate('DebitAll:DebitView:Failure');
        this.showNotification('snackbar-danger', 'Restore failed.', 'bottom', 'center');
      }
    );
  }

  viewLogs(row) {
    this.dialog.open(DebitLogDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      autoFocus: false,
      data: { debitID: row.debitID ?? row.DebitID }
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false && !item.readOnlyOnDebitScreen;
  }

  shouldShowRestoreButton(item: any): boolean {
    return item.activationStatus === false && !item.readOnlyOnDebitScreen;
  }

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  SearchData() {
    this.PageNumber = 0;
    this.useAdvancedSearch = true;
    this.loadData();
  }

  resolveActivationFilter(): boolean | null {
    if (this.activationStatusFilter === 'deleted') {
      return false;
    }
    if (this.activationStatusFilter === 'all') {
      return null;
    }
    return true;
  }

  private toSearchDateString(value: Date | null): string | null {
    if (!value) {
      return null;
    }
    try {
      const d = value instanceof Date ? value : new Date(value);
      if (!isNaN(d.getTime())) {
        return formatDate(d, 'yyyy-MM-dd', 'en-GB');
      }
    } catch (e) {
      /* ignore */
    }
    return null;
  }

  loadData() {
    if (!this.useAdvancedSearch) {
      if (this.selectedFilter === 'DebitID') {
        this.searchField = 'debitid';
      } else if (this.selectedFilter === 'Driver') {
        this.searchField = 'driver';
      } else if (this.selectedFilter === 'DebitType') {
        this.searchField = 'debittype';
      } else if (this.selectedFilter === 'Location') {
        this.searchField = 'location';
      } else {
        this.searchField = 'search';
      }

      const searchValue = this.searchTerm ? this.searchTerm : 'null';
      this.debitService
        .getTableData(
          this.searchField,
          searchValue,
          this.resolveActivationFilter(),
          this.PageNumber,
          this.sortColumn,
          this.sortType
        )
        .subscribe(
          (data) => {
            this.dataSource = (data || []).map((x) => new DebitModel(x));
          },
          () => {
            this.dataSource = null;
          }
        );
      return;
    }

    const criteria = {
      debitIdText: (this.SearchDebitID || '').trim() || null,
      driverName: (this.SearchDriver || '').trim() || null,
      locationName: (this.SearchLocation || '').trim() || null,
      debitTypeName: (this.SearchDebitType || '').trim() || null,
      supplierName: (this.SearchSupplier || '').trim() || null,
      registrationNumber: (this.SearchRegistration || '').trim() || null,
      dateFrom: this.toSearchDateString(this.SearchDateFrom),
      dateTo: this.toSearchDateString(this.SearchDateTo),
      activationStatus: this.resolveActivationFilter(),
      pageNumber: this.PageNumber,
      orderByColumn: this.sortColumn,
      order: this.sortType,
      useAdvancedSearch: true
    };

    this.debitService.advancedSearch(criteria).subscribe(
      (data) => {
        this.dataSource = (data || []).map((x) => new DebitModel(x));
      },
      () => {
        this.dataSource = null;
      }
    );
  }

  SortingData(coloumName: any) {
    if (this.sortingData === 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.sortColumn = coloumName.active || 'DebitID';
    this.loadData();
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

  formatDateCell(value: any): string {
    if (!value) {
      return '';
    }
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) {
      return value;
    }
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe((message) => {
      const messageReceived = message.text;
      const messageArray = messageReceived.split(':');
      if (messageArray.length !== 3) {
        return;
      }
      if (messageArray[0] === 'DebitCreate' && messageArray[2] === 'Success') {
        this.refresh();
        this.showNotification('snackbar-success', 'Debit Created...!!!', 'bottom', 'center');
      } else if (messageArray[0] === 'DebitUpdate' && messageArray[2] === 'Success') {
        this.loadData();
        this.showNotification('snackbar-success', 'Debit Updated...!!!', 'bottom', 'center');
      } else if (messageArray[0] === 'DebitDelete' && messageArray[2] === 'Success') {
        this.loadData();
        this.showNotification('snackbar-success', 'Debit Deleted...!!!', 'bottom', 'center');
      } else if (messageArray[0] === 'DebitAll' && messageArray[2] === 'Failure') {
        this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
      }
    });
  }
}