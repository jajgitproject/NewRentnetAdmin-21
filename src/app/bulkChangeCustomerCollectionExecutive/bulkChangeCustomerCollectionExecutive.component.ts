// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BulkChangeCustomerCollectionExecutiveService } from './bulkChangeCustomerCollectionExecutive.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import {
  BulkChangeCustomerCollectionExecutive,
  BulkChangeCustomerCollectionExecutiveRequest
} from './bulkChangeCustomerCollectionExecutive.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { FormControl, Validators } from '@angular/forms';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChangeCollectionExecutiveDialogComponent } from './dialogs/change-collection-executive-dialog/change-collection-executive-dialog.component';

@Component({
  standalone: false,
  selector: 'app-bulkChangeCustomerCollectionExecutive',
  templateUrl: './bulkChangeCustomerCollectionExecutive.component.html',
  styleUrls: ['./bulkChangeCustomerCollectionExecutive.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BulkChangeCustomerCollectionExecutiveComponent implements OnInit {
  displayedColumns = [
    'check',
    'customerName',
    'employeeName',
    'fromDate',
    'toDate',
    'activationStatus'
  ];

  dataSource: BulkChangeCustomerCollectionExecutive[] | null;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  selectAll: boolean = false;
  selectedRecords: BulkChangeCustomerCollectionExecutive[] = [];

  searchCollectionExecutiveControl = new FormControl('', Validators.required);
  public collectionExecutiveSearchList: EmployeeDropDown[] = [];
  filteredCollectionExecutiveSearchOptions: Observable<EmployeeDropDown[]> = of([]);
  selectedCollectionExecutiveID: number = 0;

  private subscriptionName: Subscription;

  constructor(
    public dialog: MatDialog,
    public bulkChangeCustomerCollectionExecutiveService: BulkChangeCustomerCollectionExecutiveService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit() {
    this.initCollectionExecutiveSearch();
    this.SubscribeUpdateService();
  }

  initCollectionExecutiveSearch() {
    this._generalService.GetCustomerChangesCollectionExecutive().subscribe({
      next: (data) => {
        this.collectionExecutiveSearchList = data || [];
        this.filteredCollectionExecutiveSearchOptions = this.searchCollectionExecutiveControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterCollectionExecutiveSearch(value || ''))
        );
      },
      error: () => {
        this.collectionExecutiveSearchList = [];
        this.filteredCollectionExecutiveSearchOptions = of([]);
      }
    });
  }

  private _filterCollectionExecutiveSearch(value: string): EmployeeDropDown[] {
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = String(value).toLowerCase();
    return (this.collectionExecutiveSearchList || []).filter((item) => {
      const fullName = `${item.employeeFirstName || item.firstName || ''} ${item.employeeLastName || item.lastName || ''}`.toLowerCase();
      return fullName.includes(filterValue);
    });
  }

  onCollectionExecutiveSearchSelected(selectedName: string) {
    const executive = this.collectionExecutiveSearchList.find((item) => {
      const fullName = `${item.employeeFirstName || item.firstName} ${item.employeeLastName || item.lastName}`;
      return fullName === selectedName;
    });
    if (executive) {
      this.selectedCollectionExecutiveID = executive.employeeID;
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
    if (!this.selectedCollectionExecutiveID) {
      this.dataSource = null;
      return;
    }

    this.bulkChangeCustomerCollectionExecutiveService
      .getTableData(this.selectedCollectionExecutiveID, this.PageNumber)
      .subscribe(
        (data) => {
          this.dataSource = data || [];
          this.dataSource.forEach((row) => {
            row.checked = this.selectedRecords.some(
              (x) => x.customerCollectionExecutiveID === row.customerCollectionExecutiveID
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
        if (!this.selectedRecords.some((x) => x.customerCollectionExecutiveID === row.customerCollectionExecutiveID)) {
          this.selectedRecords.push(row);
        }
      });
    } else {
      this.dataSource.forEach((row) => (row.checked = false));
      this.selectedRecords = [];
    }
  }

  onCheckBox(checkBoxValue: boolean, row: BulkChangeCustomerCollectionExecutive) {
    row.checked = checkBoxValue;
    if (checkBoxValue) {
      if (!this.selectedRecords.some((x) => x.customerCollectionExecutiveID === row.customerCollectionExecutiveID)) {
        this.selectedRecords.push(row);
      }
    } else {
      this.selectAll = false;
      this.selectedRecords = this.selectedRecords.filter(
        (x) => x.customerCollectionExecutiveID !== row.customerCollectionExecutiveID
      );
    }
    this.selectAll = this.dataSource?.length > 0 && this.selectedRecords.length === this.dataSource.length;
  }

  openChangeCollectionExecutiveDialog() {
    if (this.selectedRecords.length === 0) {
      return;
    }

    const dialogRef = this.dialog.open(ChangeCollectionExecutiveDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      disableClose: false,
      data: {
        selectedCount: this.selectedRecords.length
      }
    });

    dialogRef.afterClosed().subscribe((newEmployeeID) => {
      if (newEmployeeID) {
        this.bulkChangeCustomerCollectionExecutiveService
          .bulkChange({
            newEmployeeID,
            customerCollectionExecutiveIDs: this.selectedRecords.map((x) => x.customerCollectionExecutiveID)
          } as BulkChangeCustomerCollectionExecutiveRequest)
          .subscribe(
            () => {
              this._generalService.sendUpdate('BulkChangeCustomerCollectionExecutive:BulkChangeCustomerCollectionExecutiveView:Success');
            },
            () => {
              this._generalService.sendUpdate('BulkChangeCustomerCollectionExecutiveAll:BulkChangeCustomerCollectionExecutiveView:Failure');
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
    if (!this.selectedCollectionExecutiveID) {
      return;
    }
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.bulkChangeCustomerCollectionExecutiveService
      .getTableDataSort(this.selectedCollectionExecutiveID, this.PageNumber, columnName.active, this.sortType)
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
        if (parts[0] === 'BulkChangeCustomerCollectionExecutive' && parts[2] === 'Success') {
          this.showNotification(
            'snackbar-success',
            'Collection Executive changed successfully for selected records...!!!',
            'bottom',
            'center'
          );
          this.selectedRecords = [];
          this.selectAll = false;
          this.refresh();
        } else if (parts[0] === 'BulkChangeCustomerCollectionExecutiveAll' && parts[2] === 'Failure') {
          this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
        }
      }
    });
  }
}
