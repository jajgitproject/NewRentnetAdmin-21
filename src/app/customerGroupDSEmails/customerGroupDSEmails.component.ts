// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerGroupDSEmailsService } from './customerGroupDSEmails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerGroupDSEmails } from './customerGroupDSEmails.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FormDialogComponentCustomerGroupDSEmails } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-customerGroupDSEmails',
  templateUrl: './customerGroupDSEmails.component.html',
  styleUrls: ['./customerGroupDSEmails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerGroupDSEmailsComponent implements OnInit {
  displayedColumns = [
    'emailID',
    'status',
    'actions'
  ];
  dataSource: CustomerGroupDSEmails[] | null;
  customerGroupDSEmailsID: number;
  advanceTable: CustomerGroupDSEmails | null;
  searchEmailID: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  sortingData: number;
  sortType: string;
  customerGroupID: any;
  customerGroup: any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected: boolean = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public customerGroupDSEmailsService: CustomerGroupDSEmailsService,
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
    this.route.queryParams.subscribe(paramsData => {
      const encryptedCustomerGroupID = paramsData.CustomerGroupID;
      const encryptedCustomerGroup = paramsData.CustomerGroup;

      if (encryptedCustomerGroupID && encryptedCustomerGroup) {
        this.customerGroupID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupID));
        this.customerGroup = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroup));
      }
    });
    this.loadData();
    this.SubscribeUpdateService();
  }

  refresh() {
    this.searchEmailID = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponentCustomerGroupDSEmails, {
      width: '720px',
      maxWidth: '96vw',
      data: {
        advanceTable: this.advanceTable,
        action: 'add',
        customerGroupID: this.customerGroupID,
        customerGroup: this.customerGroup,
      }
    });
  }

  editCall(row) {
    this.customerGroupDSEmailsID = row.customerGroupDSEmailsID;
    const dialogRef = this.dialog.open(FormDialogComponentCustomerGroupDSEmails, {
      width: '720px',
      maxWidth: '96vw',
      data: {
        advanceTable: row,
        action: 'edit',
        customerGroupID: this.customerGroupID,
        customerGroup: this.customerGroup,
      }
    });
  }

  deleteItem(row) {
    this.customerGroupDSEmailsID = row.customerGroupDSEmailsID;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: row
    });
  }

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false;
  }

  public Filter() {
    this.PageNumber = 0;
    this.loadData();
  }

  public loadData() {
    switch (this.selectedFilter) {
      case 'emailID':
        this.searchEmailID = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
    this.customerGroupDSEmailsService.getTableData(this.customerGroupID, this.searchEmailID, this.SearchActivationStatus, this.PageNumber).subscribe(
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

  onContextMenu(event: MouseEvent, item: CustomerGroupDSEmails) {
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
    this.subscriptionName = this._generalService.getUpdate().subscribe(
      message => {
        this.messageReceived = message.text;
        this.MessageArray = this.messageReceived.split(':');
        if (this.MessageArray.length == 3) {
          if (this.MessageArray[0] == 'CustomerGroupDSEmailsCreate') {
            if (this.MessageArray[1] == 'CustomerGroupDSEmailsView' && this.MessageArray[2] == 'Success') {
              this.refresh();
              this.showNotification('snackbar-success', 'Duty Slip Email Created ...!!!', 'bottom', 'center');
            }
          }
          else if (this.MessageArray[0] == 'CustomerGroupDSEmailsUpdate') {
            if (this.MessageArray[1] == 'CustomerGroupDSEmailsView' && this.MessageArray[2] == 'Success') {
              this.refresh();
              this.showNotification('snackbar-success', 'Duty Slip Email Updated ...!!!', 'bottom', 'center');
            }
          }
          else if (this.MessageArray[0] == 'CustomerGroupDSEmailsDelete') {
            if (this.MessageArray[1] == 'CustomerGroupDSEmailsView' && this.MessageArray[2] == 'Success') {
              this.refresh();
              this.showNotification('snackbar-success', 'Duty Slip Email Deleted ...!!!', 'bottom', 'center');
            }
          }
          else if (this.MessageArray[0] == 'CustomerGroupDSEmailsAll') {
            if (this.MessageArray[1] == 'CustomerGroupDSEmailsView' && this.MessageArray[2] == 'Failure') {
              this.refresh();
              this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
            }
          }
        }
      }
    );
  }

  SortingData(coloumName: any) {
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    }
    else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.customerGroupDSEmailsService.getTableDataSort(this.customerGroupID, this.searchEmailID, this.SearchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe(
      data => {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }
}
