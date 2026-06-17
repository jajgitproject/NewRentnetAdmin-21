// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BulkChangeCustomerBillingExecutiveService } from './bulkChangeCustomerBillingExecutive.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import {
  BulkChangeCustomerBillingExecutive,
  BulkChangeCustomerBillingExecutiveRequest
} from './bulkChangeCustomerBillingExecutive.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { FormControl, Validators } from '@angular/forms';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChangeBillingExecutiveDialogComponent } from './dialogs/change-billing-executive-dialog/change-billing-executive-dialog.component';

@Component({
  standalone: false,
  selector: 'app-bulkChangeCustomerBillingExecutive',
  templateUrl: './bulkChangeCustomerBillingExecutive.component.html',
  styleUrls: ['./bulkChangeCustomerBillingExecutive.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BulkChangeCustomerBillingExecutiveComponent implements OnInit {
  displayedColumns = [
    'check',
    'customerName',
    'employeeName',
    'fromDate',
    'toDate',
    'activationStatus'
  ];

  dataSource: BulkChangeCustomerBillingExecutive[] | null;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  selectAll: boolean = false;
  selectedRecords: BulkChangeCustomerBillingExecutive[] = [];

  searchBillingExecutiveControl = new FormControl('', Validators.required);
  public billingExecutiveSearchList: EmployeeDropDown[] = [];
  filteredBillingExecutiveSearchOptions: Observable<EmployeeDropDown[]> = of([]);
  selectedBillingExecutiveID: number = 0;

  private subscriptionName: Subscription;

  constructor(
    public dialog: MatDialog,
    public bulkChangeCustomerBillingExecutiveService: BulkChangeCustomerBillingExecutiveService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit() {
    this.initBillingExecutiveSearch();
    this.SubscribeUpdateService();
  }

  initBillingExecutiveSearch() {
    this._generalService.GetCustomerChangesBillingExecutive().subscribe({
      next: (data) => {
        this.billingExecutiveSearchList = data || [];
        this.filteredBillingExecutiveSearchOptions = this.searchBillingExecutiveControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterBillingExecutiveSearch(value || ''))
        );
      },
      error: () => {
        this.billingExecutiveSearchList = [];
        this.filteredBillingExecutiveSearchOptions = of([]);
      }
    });
  }

  private _filterBillingExecutiveSearch(value: string): EmployeeDropDown[] {
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = String(value).toLowerCase();
    return (this.billingExecutiveSearchList || []).filter((item) => {
      const fullName = `${item.employeeFirstName || item.firstName || ''} ${item.employeeLastName || item.lastName || ''}`.toLowerCase();
      return fullName.includes(filterValue);
    });
  }

  onBillingExecutiveSearchSelected(selectedName: string) {
    const executive = this.billingExecutiveSearchList.find((item) => {
      const fullName = `${item.employeeFirstName || item.firstName} ${item.employeeLastName || item.lastName}`;
      return fullName === selectedName;
    });
    if (executive) {
      this.selectedBillingExecutiveID = executive.employeeID;
    }
  }

  refresh() {
    this.PageNumber = 0;
    this.selectedRecords = [];
    this.selectAll = false;
    this.loadData();
  }

  public SearchData() {
    this.PageNumber = 0;
    this.selectedRecords = [];
    this.selectAll = false;
    this.loadData();
  }

  public loadData() {
    if (!this.selectedBillingExecutiveID) {
      this.dataSource = null;
      return;
    }

    this.bulkChangeCustomerBillingExecutiveService
      .getTableData(this.selectedBillingExecutiveID, this.PageNumber)
      .subscribe(
        (data) => {
          this.dataSource = data || [];
          this.dataSource.forEach((row) => {
            row.checked = this.selectedRecords.some(
              (x) => x.customerBillingExecutiveID === row.customerBillingExecutiveID
            );
          });
          this.selectAll =
            this.dataSource.length > 0 &&
            this.selectedRecords.length === this.dataSource.length;
        },
        () => {
          this.dataSource = null;
        }
      );
  }

  checkAll(checkBoxValue: boolean) {
    this.selectAll = checkBoxValue;
    if (!this.dataSource) {
      return;
    }

    if (checkBoxValue) {
      this.dataSource.forEach((row) => {
        row.checked = true;
        if (!this.selectedRecords.some((x) => x.customerBillingExecutiveID === row.customerBillingExecutiveID)) {
          this.selectedRecords.push(row);
        }
      });
    } else {
      this.dataSource.forEach((row) => (row.checked = false));
      this.selectedRecords = [];
    }
  }

  onCheckBox(checkBoxValue: boolean, row: BulkChangeCustomerBillingExecutive) {
    row.checked = checkBoxValue;
    if (checkBoxValue) {
      if (!this.selectedRecords.some((x) => x.customerBillingExecutiveID === row.customerBillingExecutiveID)) {
        this.selectedRecords.push(row);
      }
    } else {
      this.selectAll = false;
      this.selectedRecords = this.selectedRecords.filter(
        (x) => x.customerBillingExecutiveID !== row.customerBillingExecutiveID
      );
    }
    this.selectAll = this.dataSource?.length > 0 && this.selectedRecords.length === this.dataSource.length;
  }

  openChangeBillingExecutiveDialog() {
    if (this.selectedRecords.length === 0) {
      return;
    }

    const dialogRef = this.dialog.open(ChangeBillingExecutiveDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      disableClose: false,
      data: {
        selectedCount: this.selectedRecords.length
      }
    });

    dialogRef.afterClosed().subscribe((newEmployeeID) => {
      if (newEmployeeID) {
        this.bulkChangeCustomerBillingExecutiveService
          .bulkChange({
            newEmployeeID,
            customerBillingExecutiveIDs: this.selectedRecords.map((x) => x.customerBillingExecutiveID)
          } as BulkChangeCustomerBillingExecutiveRequest)
          .subscribe(
            () => {
              this._generalService.sendUpdate('BulkChangeCustomerBillingExecutive:BulkChangeCustomerBillingExecutiveView:Success');
            },
            () => {
              this._generalService.sendUpdate('BulkChangeCustomerBillingExecutiveAll:BulkChangeCustomerBillingExecutiveView:Failure');
            }
          );
      }
    });
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

  SortingData(columnName: any) {
    if (!this.selectedBillingExecutiveID) {
      return;
    }
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.bulkChangeCustomerBillingExecutiveService
      .getTableDataSort(this.selectedBillingExecutiveID, this.PageNumber, columnName.active, this.sortType)
      .subscribe(
        (data) => {
          this.dataSource = data || [];
        },
        () => {
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

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe((message) => {
      const parts = message.text.split(':');
      if (parts.length === 3) {
        if (parts[0] === 'BulkChangeCustomerBillingExecutive' && parts[2] === 'Success') {
          this.showNotification(
            'snackbar-success',
            'Billing Executive changed successfully for selected records...!!!',
            'bottom',
            'center'
          );
          this.selectedRecords = [];
          this.selectAll = false;
          this.refresh();
        } else if (parts[0] === 'BulkChangeCustomerBillingExecutiveAll' && parts[2] === 'Failure') {
          this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
        }
      }
    });
  }
}
