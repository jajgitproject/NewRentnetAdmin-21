// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerContractPackageTypePackageMappingService } from './customerContractPackageTypePackageMapping.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerContractPackageTypePackageMapping } from './customerContractPackageTypePackageMapping.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { PackageDropDown } from '../general/packageDropDown.model';

@Component({
  standalone: false,
  selector: 'app-customerContractPackageTypePackageMapping',
  templateUrl: './customerContractPackageTypePackageMapping.component.html',
  styleUrls: [],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerContractPackageTypePackageMappingComponent implements OnInit {
  displayedColumns = [
    'package',
    'customerPackageName',
    'customerPackageCodeForIntegration',
    'status',
    'actions'
  ];
  dataSource: CustomerContractPackageTypePackageMapping[] | null;
  customerContractPackageTypePackageMappingID: number;
  advanceTable: CustomerContractPackageTypePackageMapping | null;
  searchPackage: string = '';
  searchcustomerPackageName: string = '';
  searchcustomerPackageCodeForIntegration: string = '';
  searchCustomerContractPackageTypePackageMappingID: number = 0;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  package: FormControl = new FormControl();
  customerPackageName: FormControl = new FormControl();
  customerPackageCodeForIntegration: FormControl = new FormControl();
  sortingData: number;
  sortType: string;
  public CityList?: CitiesDropDown[] = [];
  public PackageList?: PackageDropDown[] = [];
  customerContractPackageTypeID: any;
  customerContractPackageType: any;
  customerContractName: any;
  customerContractID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public customerContractPackageTypePackageMappingService: CustomerContractPackageTypePackageMappingService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.route.queryParams.subscribe(paramsData => {
      const encryptedCustomerContractPackageTypeID = paramsData.CustomerContractPackageTypeID;
      const encryptedCustomerContractID = paramsData.CustomerContractID;
      const encryptedCustomerContractPackageType = paramsData.CustomerContractPackageType;
      const encryptedCustomerContractName = paramsData.CustomerContractName;

      if (encryptedCustomerContractID) {
        this.customerContractID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractID));
      }
      if (encryptedCustomerContractPackageTypeID && encryptedCustomerContractPackageType && encryptedCustomerContractName) {
        this.customerContractPackageTypeID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractPackageTypeID));
        this.customerContractPackageType = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractPackageType));
        this.customerContractName = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractName));
      }
    });
    this.InitCities();
    this.initPackage();
    this.loadData();
    this.SubscribeUpdateService();
  }

  refresh() {
    this.searchPackage = '';
    this.searchcustomerPackageName = '';
    this.searchcustomerPackageCodeForIntegration = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.loadData();
  }

  InitCities() {
    this._generalService.GetCitiessAll().subscribe(data => {
      this.CityList = data;
    });
  }

  initPackage() {
    this._generalService.GetPackages().subscribe(data => {
      this.PackageList = data;
    });
  }

  SearchData() {
    this.loadData();
  }

  addNew() {
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: 'add',
        customerContractPackageTypeID: this.customerContractPackageTypeID,
        customerContractPackageType: this.customerContractPackageType,
        customerContractName: this.customerContractName,
        customerContractID: this.customerContractID,
      }
    });
  }

  editCall(row) {
    this.customerContractPackageTypePackageMappingID = row.customerContractPackageTypePackageMappingID;
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerContractPackageTypeID: this.customerContractPackageTypeID,
        customerContractPackageType: this.customerContractPackageType,
        customerContractName: this.customerContractName,
        customerContractID: this.customerContractID,
      }
    });
  }

  deleteItem(row) {
    this.customerContractPackageTypePackageMappingID = row.id;
    this.dialog.open(DeleteDialogComponent, { data: row });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false;
  }

  Filter() {
    this.PageNumber = 0;
    this.loadData();
  }

  loadData() {
    this.customerContractPackageTypePackageMappingService.getTableData(
      this.customerContractID,
      this.customerContractPackageTypeID,
      this.searchCustomerContractPackageTypePackageMappingID,
      this.searchPackage,
      this.searchcustomerPackageName,
      this.searchcustomerPackageCodeForIntegration,
      this.SearchActivationStatus,
      this.PageNumber
    ).subscribe(
      data => { this.dataSource = data; },
      () => { this.dataSource = null; }
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

  onContextMenu(event: MouseEvent, item: CustomerContractPackageTypePackageMapping) {
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
    this.subscriptionName = this._generalService.getUpdate().subscribe(message => {
      this.messageReceived = message.text;
      this.MessageArray = this.messageReceived.split(':');
      if (this.MessageArray.length == 3) {
        if (this.MessageArray[0] == 'CustomerContractPackageTypePackageMappingCreate' && this.MessageArray[1] == 'CustomerContractPackageTypePackageMappingView' && this.MessageArray[2] == 'Success') {
          this.refresh();
          this.showNotification('snackbar-success', 'Customer Contract Package Type Package Mapping Created...!!!', 'bottom', 'center');
        } else if (this.MessageArray[0] == 'CustomerContractPackageTypePackageMappingUpdate' && this.MessageArray[1] == 'CustomerContractPackageTypePackageMappingView' && this.MessageArray[2] == 'Success') {
          this.refresh();
          this.showNotification('snackbar-success', 'Customer Contract Package Type Package Mapping Updated...!!!', 'bottom', 'center');
        } else if (this.MessageArray[0] == 'CustomerContractPackageTypePackageMappingDelete' && this.MessageArray[1] == 'CustomerContractPackageTypePackageMappingView' && this.MessageArray[2] == 'Success') {
          this.refresh();
          this.showNotification('snackbar-success', 'Customer Contract Package Type Package Mapping Deleted...!!!', 'bottom', 'center');
        } else if (this.MessageArray[0] == 'CustomerContractPackageTypePackageMappingAll' && this.MessageArray[1] == 'CustomerContractPackageTypePackageMappingView' && this.MessageArray[2] == 'Failure') {
          this.refresh();
          this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
        } else if (this.MessageArray[0] == 'DataNotFound' && this.MessageArray[1] == 'DuplicacyError' && this.MessageArray[2] == 'Failure') {
          this.refresh();
          this.showNotification('snackbar-danger', 'Duplicate Value Found.....!!!', 'bottom', 'center');
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
    this.customerContractPackageTypePackageMappingService.getTableDataSort(
      this.customerContractID,
      this.customerContractPackageTypeID,
      this.searchCustomerContractPackageTypePackageMappingID,
      this.searchPackage,
      this.searchcustomerPackageName,
      this.searchcustomerPackageCodeForIntegration,
      this.SearchActivationStatus,
      this.PageNumber,
      coloumName.active,
      this.sortType
    ).subscribe(
      data => { this.dataSource = data; },
      () => { this.dataSource = null; }
    );
  }
}
