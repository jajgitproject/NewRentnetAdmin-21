// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerPaymentMappingService } from './customerPaymentMapping.service';
import { CustomerPaymentMapping, CustomerPaymentMappingCustomerDropDown } from './customerPaymentMapping.model';
import { ModeOfPaymentDropDown } from '../modeOfPayment/modeOfPaymentDropDown.model';

@Component({
  standalone: false,
  selector: 'app-customerPaymentMapping',
  templateUrl: './customerPaymentMapping.component.html',
  styleUrls: ['./customerPaymentMapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerPaymentMappingComponent implements OnInit {
  displayedColumns = ['ModeOfPayment', 'activationStatus', 'actions'];
  dataSource: CustomerPaymentMapping[] | null;
  customerPaymentMappingID: number;
  advanceTable: CustomerPaymentMapping | null;
  searchModeOfPayment: string = '';
  modeOfPayment: FormControl = new FormControl();
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  public ModeOfPaymentList?: ModeOfPaymentDropDown[] = [];
  filteredModeOptions: Observable<ModeOfPaymentDropDown[]>;

  Applicable_To: any;
  Applicable_From: any;
  customerContract_ID: any;
  customerContract_Name: any;
  customer_ID: any;
  customer_Name: any;
  public CustomerList: CustomerPaymentMappingCustomerDropDown[] = [];
  showCustomerPicker: boolean = false;

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public customerPaymentMappingService: CustomerPaymentMappingService,
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
      const encryptedCustomerID = paramsData.CustomerID;
      const encryptedCustomerName = paramsData.CustomerName;
      const encryptedCustomerContractID = paramsData.CustomerContractID;
      const encryptedStartDate = paramsData.StartDate;
      const encryptedEndDate = paramsData.EndDate;
      const encryptedCustomerContractName = paramsData.CustomerContractName;

      if (encryptedCustomerID && encryptedCustomerName) {
        this.customer_ID = Number(this._generalService.decrypt(decodeURIComponent(encryptedCustomerID)));
        this.customer_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
        this.showCustomerPicker = false;
        this.loadData();
        return;
      }

      if (encryptedCustomerContractID && encryptedStartDate && encryptedEndDate && encryptedCustomerContractName) {
        this.customerContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractID));
        this.Applicable_From = this._generalService.decrypt(decodeURIComponent(encryptedStartDate));
        this.Applicable_To = this._generalService.decrypt(decodeURIComponent(encryptedEndDate));
        this.customerContract_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractName));
        this.resolveCustomerContext();
      }
    });
    this.InitModeOfPayment();
    this.SubscribeUpdateService();
  }

  resolveCustomerContext() {
    const contractId = Number(this.customerContract_ID);
    if (!contractId) {
      return;
    }
    this.customerPaymentMappingService.getCustomersForContract(contractId).subscribe(
      customers => {
        const list = Array.isArray(customers) ? customers : customers ? [customers] : [];
        if (list.length === 0) {
          this.CustomerList = [];
          this.showNotification(
            'snackbar-danger',
            'No active customer mapping found for this contract.',
            'bottom',
            'center'
          );
          return;
        }
        this.CustomerList = list.map(c => ({
          customerID: c.customerID ?? c.CustomerID,
          customerName: c.customerName ?? c.CustomerName
        }));
        if (this.CustomerList.length === 1) {
          this.customer_ID = Number(this.CustomerList[0].customerID);
          this.customer_Name = this.CustomerList[0].customerName;
          this.showCustomerPicker = false;
          this.loadData();
        } else {
          this.showCustomerPicker = true;
          this.customer_ID = Number(this.CustomerList[0].customerID);
          this.customer_Name = this.CustomerList[0].customerName;
          this.loadData();
        }
      },
      () => {
        this.CustomerList = [];
      }
    );
  }

  onCustomerChange(customerID: number) {
    const selected = this.CustomerList.find(c => c.customerID === +customerID);
    this.customer_ID = customerID;
    this.customer_Name = selected ? selected.customerName : '';
    this.loadData();
  }

  InitModeOfPayment() {
    this._generalService.GetModeOfPayment().subscribe(data => {
      this.ModeOfPaymentList = data;
      this.filteredModeOptions = this.modeOfPayment.valueChanges.pipe(
        startWith(''),
        map(value => this._filterMode(value || ''))
      );
    });
  }

  private _filterMode(value: string): any {
    const filterValue = value.toLowerCase();
    return this.ModeOfPaymentList.filter(customer => {
      return customer.modeOfPayment.toLowerCase().indexOf(filterValue) === 0;
    });
  }

  refresh() {
    this.modeOfPayment.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  addNew() {
    if (!this.customer_ID) {
      this.showNotification(
        'snackbar-danger',
        'Customer is not selected.',
        'bottom',
        'center'
      );
      return;
    }
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: 'add',
        CustomerID: this.customer_ID,
        CustomerContractID: this.customerContract_ID
      }
    });
  }

  editCall(row) {
    this.customerPaymentMappingID = row.customerPaymentMappingID;
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerID: this.customer_ID
      }
    });
  }

  deleteItem(row) {
    this.customerPaymentMappingID = row.id;
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
    if (!this.customer_ID) {
      return;
    }
    switch (this.selectedFilter) {
      case 'paymentType':
        this.modeOfPayment.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
    this.customerPaymentMappingService
      .getTableData(this.customer_ID, this.modeOfPayment.value, this.SearchActivationStatus, this.PageNumber)
      .subscribe(
        data => {
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

  onContextMenu(event: MouseEvent, item: CustomerPaymentMapping) {
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
    this.subscriptionName = this._generalService.getUpdate().subscribe(message => {
      this.messageReceived = message.text;
      this.MessageArray = this.messageReceived.split(':');
      if (this.MessageArray.length == 3) {
        if (this.MessageArray[0] == 'CustomerPaymentMappingCreate') {
          if (this.MessageArray[1] == 'CustomerPaymentMappingView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'Customer Payment Mapping Created...!!!', 'bottom', 'center');
          }
        } else if (this.MessageArray[0] == 'CustomerPaymentMappingUpdate') {
          if (this.MessageArray[1] == 'CustomerPaymentMappingView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'Customer Payment Mapping Updated...!!!', 'bottom', 'center');
          }
        } else if (this.MessageArray[0] == 'CustomerPaymentMappingDelete') {
          if (this.MessageArray[1] == 'CustomerPaymentMappingView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'Customer Payment Mapping Deleted...!!!', 'bottom', 'center');
          }
        } else if (this.MessageArray[0] == 'CustomerPaymentMappingAll') {
          if (this.MessageArray[1] == 'CustomerPaymentMappingView' && this.MessageArray[2] == 'Failure') {
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
    this.customerPaymentMappingService
      .getTableDataSort(
        this.customer_ID,
        this.searchModeOfPayment,
        this.SearchActivationStatus,
        this.PageNumber,
        coloumName.active,
        this.sortType
      )
      .subscribe(
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => {
          this.dataSource = null;
        }
      );
  }
}
