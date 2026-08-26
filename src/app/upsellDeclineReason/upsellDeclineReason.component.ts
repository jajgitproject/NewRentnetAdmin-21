// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UpsellDeclineReasonService } from './upsellDeclineReason.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UpsellDeclineReason } from './upsellDeclineReason.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';

@Component({
  standalone: false,
  selector: 'app-upsellDeclineReason',
  templateUrl: './upsellDeclineReason.component.html',
  styleUrls: ['./upsellDeclineReason.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class UpsellDeclineReasonComponent implements OnInit {
  displayedColumns = [
    'reasonName',
    'displayOrder',
    'status',
    'actions'
  ];
  dataSource: UpsellDeclineReason[] | null;
  advanceTable: UpsellDeclineReason | null;
  SearchReasonName: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  selectedFilter: string = 'search';
  searchTerm: any = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public upsellDeclineReasonService: UpsellDeclineReasonService,
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
    this.SearchReasonName = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
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
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
  }

  deleteItem(row) {
    this.dialog.open(DeleteDialogComponent, {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.isActive !== false;
  }

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  public loadData() {
    if (this.selectedFilter === 'ReasonName') {
      this.SearchReasonName = this.searchTerm;
    }
    this.upsellDeclineReasonService.getTableData(this.SearchReasonName, this.SearchActivationStatus, this.PageNumber).subscribe(
      data => {
        this.dataSource = (data || []).map(r => new UpsellDeclineReason(r));
        if (!this.dataSource.length) {
          this.dataSource = null;
        }
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

  onContextMenu(event: MouseEvent, item: UpsellDeclineReason) {
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
  }

  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription;

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe(
      message => {
        this.messageReceived = message.text;
        this.MessageArray = this.messageReceived.split(':');
        if (this.MessageArray.length == 3) {
          if (this.MessageArray[0] == 'UpsellDeclineReasonCreate' && this.MessageArray[1] == 'UpsellDeclineReasonView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'UpSell Decline Reason Created...!!!', 'bottom', 'center');
          } else if (this.MessageArray[0] == 'UpsellDeclineReasonUpdate' && this.MessageArray[1] == 'UpsellDeclineReasonView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'UpSell Decline Reason Updated...!!!', 'bottom', 'center');
          } else if (this.MessageArray[0] == 'UpsellDeclineReasonDelete' && this.MessageArray[1] == 'UpsellDeclineReasonView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'UpSell Decline Reason Deleted...!!!', 'bottom', 'center');
          } else if (this.MessageArray[0] == 'UpsellDeclineReasonAll' && this.MessageArray[1] == 'UpsellDeclineReasonView' && this.MessageArray[2] == 'Failure') {
            this.refresh();
            this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
          } else if (this.MessageArray[0] == 'DataNotFound' && this.MessageArray[1] == 'DuplicacyError' && this.MessageArray[2] == 'Failure') {
            this.showNotification('snackbar-danger', 'Duplicate Value Found.....!!!', 'bottom', 'center');
          }
        }
      }
    );
  }

  SortingData(columnName: any) {
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.upsellDeclineReasonService.getTableDataSort(
      this.SearchReasonName,
      this.SearchActivationStatus,
      this.PageNumber,
      columnName.active,
      this.sortType
    ).subscribe(
      data => {
        this.dataSource = (data || []).map(r => new UpsellDeclineReason(r));
        if (!this.dataSource.length) {
          this.dataSource = null;
        }
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }
}
