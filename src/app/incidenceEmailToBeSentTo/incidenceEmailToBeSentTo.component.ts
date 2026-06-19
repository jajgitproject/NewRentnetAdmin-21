// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IncidenceEmailToBeSentToService } from './incidenceEmailToBeSentTo.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IncidenceEmailToBeSentTo } from './incidenceEmailToBeSentTo.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-incidence-email-to-be-sent-to',
  templateUrl: './incidenceEmailToBeSentTo.component.html',
  styleUrls: ['./incidenceEmailToBeSentTo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class IncidenceEmailToBeSentToComponent implements OnInit {
  displayedColumns = [
    'IncidenceEmailToBeSentTo',
    'IncidenceEmailToBeSentToType',
    'status',
    'actions'
  ];
  dataSource: IncidenceEmailToBeSentTo[] | null;
  incidenceEmailToBeSentToID: number;
  advanceTable: IncidenceEmailToBeSentTo | null;
  SearchIncidenceEmailToBeSentTo: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  search: FormControl = new FormControl();
  selectedFilter: string = 'search';
  searchTerm: any = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public incidenceEmailToBeSentToService: IncidenceEmailToBeSentToService,
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
    this.SearchIncidenceEmailToBeSentTo = '';
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
    this.incidenceEmailToBeSentToID = row.id;
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
  }

  deleteItem(row) {
    this.incidenceEmailToBeSentToID = row.id;
    this.dialog.open(DeleteDialogComponent, {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false;
  }

  public Filter() {
    this.PageNumber = 0;
    this.loadData();
  }

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  public loadData() {
    if (this.selectedFilter === 'IncidenceEmailToBeSentTo') {
      this.SearchIncidenceEmailToBeSentTo = this.searchTerm;
    }
    this.incidenceEmailToBeSentToService
      .getTableData(this.SearchIncidenceEmailToBeSentTo, this.SearchActivationStatus, this.PageNumber)
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

  onContextMenu(event: MouseEvent, item: IncidenceEmailToBeSentTo) {
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
    this.subscriptionName = this._generalService.getUpdate().subscribe((message) => {
      this.messageReceived = message.text;
      this.MessageArray = this.messageReceived.split(':');
      if (this.MessageArray.length == 3) {
        if (this.MessageArray[0] == 'IncidenceEmailToBeSentToCreate') {
          if (this.MessageArray[1] == 'IncidenceEmailToBeSentToView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'Incidence Email To Be Sent To Created...!!!', 'bottom', 'center');
          }
        } else if (this.MessageArray[0] == 'IncidenceEmailToBeSentToUpdate') {
          if (this.MessageArray[1] == 'IncidenceEmailToBeSentToView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'Incidence Email To Be Sent To Updated...!!!', 'bottom', 'center');
          }
        } else if (this.MessageArray[0] == 'IncidenceEmailToBeSentToDelete') {
          if (this.MessageArray[1] == 'IncidenceEmailToBeSentToView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'Incidence Email To Be Sent To Deleted...!!!', 'bottom', 'center');
          }
        } else if (this.MessageArray[0] == 'IncidenceEmailToBeSentToAll') {
          if (this.MessageArray[1] == 'IncidenceEmailToBeSentToView' && this.MessageArray[2] == 'Failure') {
            this.refresh();
            this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
          }
        }
      }
    });
  }

  SortingData(coloumName: any) {
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.incidenceEmailToBeSentToService
      .getTableDataSort(
        this.SearchIncidenceEmailToBeSentTo,
        this.SearchActivationStatus,
        this.PageNumber,
        coloumName.active,
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
}
