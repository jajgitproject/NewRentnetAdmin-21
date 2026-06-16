// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChangeCollectionExecutiveForCustomersService } from './changeCollectionExecutiveForCustomers.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ChangeCollectionExecutiveForCustomers } from './changeCollectionExecutiveForCustomers.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FormDialogComponentHolder } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';

@Component({
  standalone: false,
  selector: 'app-changeCollectionExecutiveForCustomers',
  templateUrl: './changeCollectionExecutiveForCustomers.component.html',
  styleUrls: ['./changeCollectionExecutiveForCustomers.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ChangeCollectionExecutiveForCustomersComponent implements OnInit {
  displayedColumns = [
    'oldCollectionExecutiveName',
    'newCollectionExecutiveName',
    'startDate',
    'updationDateTime',
    'actions'
  ];
  dataSource: ChangeCollectionExecutiveForCustomers[] | null;
  changeCollectionExecutiveForCustomersID: number;
  advanceTable: ChangeCollectionExecutiveForCustomers | null;
  SearchNewCollectionExecutiveActivationStatus: boolean = true;
  SearchNewCollectionExecutiveActivationFromDate: string = '';
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  SearchEmployeeName: string = '';
  SearchStartDate: string = '';
  public EmployeeList?: EmployeeDropDown[] = [];
  searchTerm: any = '';
  selectedFilter: string = 'search';
  SearchFromDate: string;
  SearchActivationStatus: boolean;
  menuItems: any[] = [];

  constructor(
    public route: ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    public changeCollectionExecutiveForCustomersService: ChangeCollectionExecutiveForCustomersService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.loadData();
    this.InitEmployee();
    this.SubscribeUpdateService();
  }

  refresh() {
    this.SearchEmployeeName = '';
    this.SearchStartDate = '';
    this.SearchNewCollectionExecutiveActivationStatus = true;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.PageNumber = 0;
    this.loadData();
  }

  addNew() {
    this.dialog.open(FormDialogComponentHolder, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: false,
      data: {
        advanceTable: this.advanceTable,
        action: 'add'
      }
    });
  }

  editCall(row) {
    this.changeCollectionExecutiveForCustomersID = row.id;
    this.dialog.open(FormDialogComponentHolder, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: false,
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
  }

  public SearchData() {
    this.loadData();
  }

  deleteItem(row) {
    this.changeCollectionExecutiveForCustomersID = row.id;
    this.dialog.open(DeleteDialogComponent, { data: row });
  }

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.newCollectionExecutiveActivationStatus !== false;
  }

  public Filter() {
    this.PageNumber = 0;
    this.loadData();
  }

  public loadData() {
    if (this.SearchStartDate !== '') {
      this.SearchStartDate = moment(this.SearchStartDate).format('MMM DD yyyy');
    }
    switch (this.selectedFilter) {
      case 'startDate':
        this.SearchStartDate = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
    this.changeCollectionExecutiveForCustomersService
      .getTableData(this.SearchEmployeeName, this.SearchFromDate, this.SearchActivationStatus, this.PageNumber)
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

  onContextMenu(event: MouseEvent, item: ChangeCollectionExecutiveForCustomers) {
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
    this.subscriptionName = this._generalService.getUpdate().subscribe((message) => {
      this.messageReceived = message.text;
      this.MessageArray = this.messageReceived.split(':');
      if (this.MessageArray.length == 3) {
        if (this.MessageArray[0] == 'ChangeCollectionExecutiveForCustomersCreate' && this.MessageArray[1] == 'ChangeCollectionExecutiveForCustomersView' && this.MessageArray[2] == 'Success') {
          this.refresh();
          this.showNotification('snackbar-success', 'Customer Collection Executive changed successfully...!!!', 'bottom', 'center');
        } else if (this.MessageArray[0] == 'ChangeCollectionExecutiveForCustomersAll' && this.MessageArray[1] == 'ChangeCollectionExecutiveForCustomersView' && this.MessageArray[2] == 'Failure') {
          this.refresh();
          this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
        }
      }
    });
  }

  InitEmployee() {
    this._generalService.GetEmployeesForVehicleCategory().subscribe((data) => {
      this.EmployeeList = data;
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
    this.changeCollectionExecutiveForCustomersService
      .getTableDataSort(this.SearchEmployeeName, this.SearchNewCollectionExecutiveActivationFromDate, this.SearchNewCollectionExecutiveActivationStatus, this.PageNumber, coloumName.active, this.sortType)
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
