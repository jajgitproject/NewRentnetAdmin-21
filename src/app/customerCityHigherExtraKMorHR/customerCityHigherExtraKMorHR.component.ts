// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerCityHigherExtraKMorHRService } from './customerCityHigherExtraKMorHR.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { CustomerCityHigherExtraKMorHR } from './customerCityHigherExtraKMorHR.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-customerCityHigherExtraKMorHR',
  templateUrl: './customerCityHigherExtraKMorHR.component.html',
  styleUrls: ['./customerCityHigherExtraKMorHR.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerCityHigherExtraKMorHRComponent implements OnInit {
  displayedColumns = ['cityName', 'chargeHigherExtraKMorHR', 'activationStatus', 'actions'];
  dataSource: CustomerCityHigherExtraKMorHR[] | null;
  advanceTable: CustomerCityHigherExtraKMorHR | null;
  customer_ID: any;
  customer_Name: any;
  SearchCityName = '';
  SearchChargeHigherExtraKMorHR: string = '';
  SearchActivationStatus = true;
  PageNumber = 0;
  searchTerm = '';
  selectedFilter = 'search';
  sortingData: number;
  sortType: string;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public customerCityHigherExtraKMorHRService: CustomerCityHigherExtraKMorHRService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.route.queryParams.subscribe(() => {
      const encryptedCustomerID = this.route.snapshot.queryParamMap.get('CustomerID');
      const encryptedCustomerName = this.route.snapshot.queryParamMap.get('CustomerName');
      if (encryptedCustomerID && encryptedCustomerName) {
        this.customer_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.customer_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      }
    });
    this.loadData();
    this.SubscribeUpdateService();
  }

  refresh() {
    this.SearchCityName = '';
    this.SearchChargeHigherExtraKMorHR = '';
    this.SearchActivationStatus = true;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.PageNumber = 0;
    this.loadData();
  }

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  addNew() {
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: 'add',
        CustomerID: this.customer_ID,
        CustomerName: this.customer_Name
      }
    });
  }

  editCall(row) {
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerID: this.customer_ID,
        CustomerName: this.customer_Name
      }
    });
  }

  deleteItem(row) {
    this.dialog.open(DeleteDialogComponent, { data: row });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false;
  }

  SearchData() {
    this.PageNumber = 0;
    this.loadData();
  }

  loadData() {
    if (this.searchTerm && (!this.selectedFilter || this.selectedFilter === 'search')) {
      this.selectedFilter = 'city';
    }
    switch (this.selectedFilter) {
      case 'city':
        this.SearchCityName = this.searchTerm;
        break;
    }
    this.customerCityHigherExtraKMorHRService
      .getTableData(
        this.customer_ID,
        this.SearchCityName,
        this.SearchChargeHigherExtraKMorHR,
        this.SearchActivationStatus,
        this.PageNumber
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

  SortingData(columnName: any) {
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.customerCityHigherExtraKMorHRService
      .getTableDataSort(
        this.customer_ID,
        this.SearchCityName,
        this.SearchChargeHigherExtraKMorHR,
        this.SearchActivationStatus,
        this.PageNumber,
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onContextMenu(event: MouseEvent, item: CustomerCityHigherExtraKMorHR) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription;

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe((message) => {
      this.messageReceived = message.text;
      this.MessageArray = this.messageReceived.split(':');
      if (this.MessageArray.length == 3) {
        if (this.MessageArray[0] == 'CustomerCityHigherExtraKMorHRCreate') {
          if (this.MessageArray[1] == 'CustomerCityHigherExtraKMorHRView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'Record Created...!!!', 'bottom', 'center');
          }
        } else if (this.MessageArray[0] == 'CustomerCityHigherExtraKMorHRUpdate') {
          if (this.MessageArray[1] == 'CustomerCityHigherExtraKMorHRView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'Record Updated...!!!', 'bottom', 'center');
          }
        } else if (this.MessageArray[0] == 'CustomerCityHigherExtraKMorHRDelete') {
          if (this.MessageArray[1] == 'CustomerCityHigherExtraKMorHRView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'Record Deleted...!!!', 'bottom', 'center');
          }
        } else if (this.MessageArray[0] == 'CustomerCityHigherExtraKMorHRAll') {
          if (this.MessageArray[1] == 'CustomerCityHigherExtraKMorHRView' && this.MessageArray[2] == 'Failure') {
            this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
          }
        }
      }
    });
  }
}
