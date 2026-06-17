// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BulkChangeCustomerKAMService } from './bulkChangeCustomerKAM.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { BulkChangeCustomerKAM, BulkChangeCustomerKAMRequest } from './bulkChangeCustomerKAM.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { FormControl, Validators } from '@angular/forms';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChangeKamDialogComponent } from './dialogs/change-kam-dialog/change-kam-dialog.component';

@Component({
  standalone: false,
  selector: 'app-bulkChangeCustomerKAM',
  templateUrl: './bulkChangeCustomerKAM.component.html',
  styleUrls: ['./bulkChangeCustomerKAM.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BulkChangeCustomerKAMComponent implements OnInit {
  displayedColumns = [
    'check',
    'customerName',
    'employeeName',
    'city',
    'fromDate',
    'attachmentStatus'
  ];

  dataSource: BulkChangeCustomerKAM[] | null;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  selectAll: boolean = false;
  selectedRecords: BulkChangeCustomerKAM[] = [];

  searchKAMControl = new FormControl('', Validators.required);
  public kamSearchList: EmployeeDropDown[] = [];
  filteredKAMSearchOptions: Observable<EmployeeDropDown[]> = of([]);
  selectedKAMID: number = 0;
  selectedKAMName: string = '';

  private subscriptionName: Subscription;

  constructor(
    public dialog: MatDialog,
    public bulkChangeCustomerKAMService: BulkChangeCustomerKAMService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit() {
    this.initKAMSearch();
    this.SubscribeUpdateService();
  }

  initKAMSearch() {
    this._generalService.GetCustomerChangesKam().subscribe({
      next: (data) => {
        this.kamSearchList = data || [];
        this.filteredKAMSearchOptions = this.searchKAMControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterKAMSearch(value || ''))
        );
      },
      error: () => {
        this.kamSearchList = [];
        this.filteredKAMSearchOptions = of([]);
      }
    });
  }

  private _filterKAMSearch(value: string): EmployeeDropDown[] {
    const filterValue = String(value).toLowerCase();
    if (!value || value.length < 3) {
      return [];
    }
    return (this.kamSearchList || []).filter((item) => {
      const fullName = `${item.employeeFirstName || ''} ${item.employeeLastName || ''}`.toLowerCase();
      return fullName.includes(filterValue);
    });
  }

  onKAMSearchSelected(selectedName: string) {
    const kam = this.kamSearchList.find(
      (item) => `${item.employeeFirstName} ${item.employeeLastName}` === selectedName
    );
    if (kam) {
      this.selectedKAMID = kam.employeeID;
      this.selectedKAMName = selectedName;
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
    if (!this.selectedKAMID) {
      this.dataSource = null;
      return;
    }

    this.bulkChangeCustomerKAMService.getTableData(this.selectedKAMID, this.PageNumber).subscribe(
      (data) => {
        this.dataSource = data || [];
        this.dataSource.forEach((row) => {
          row.checked = this.selectedRecords.some(
            (x) => x.customerKeyAccountManagerID === row.customerKeyAccountManagerID
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
        if (!this.selectedRecords.some((x) => x.customerKeyAccountManagerID === row.customerKeyAccountManagerID)) {
          this.selectedRecords.push(row);
        }
      });
    } else {
      this.dataSource.forEach((row) => (row.checked = false));
      this.selectedRecords = [];
    }
  }

  onCheckBox(checkBoxValue: boolean, row: BulkChangeCustomerKAM) {
    row.checked = checkBoxValue;
    if (checkBoxValue) {
      if (!this.selectedRecords.some((x) => x.customerKeyAccountManagerID === row.customerKeyAccountManagerID)) {
        this.selectedRecords.push(row);
      }
    } else {
      this.selectAll = false;
      this.selectedRecords = this.selectedRecords.filter(
        (x) => x.customerKeyAccountManagerID !== row.customerKeyAccountManagerID
      );
    }
    this.selectAll = this.dataSource?.length > 0 && this.selectedRecords.length === this.dataSource.length;
  }

  openChangeKAMDialog() {
    if (this.selectedRecords.length === 0) {
      return;
    }

    const dialogRef = this.dialog.open(ChangeKamDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      disableClose: false,
      data: {
        selectedCount: this.selectedRecords.length
      }
    });

    dialogRef.afterClosed().subscribe((newEmployeeID) => {
      if (newEmployeeID) {
        this.bulkChangeCustomerKAMService
          .bulkChange({
            newEmployeeID,
            customerKeyAccountManagerIDs: this.selectedRecords.map((x) => x.customerKeyAccountManagerID)
          } as BulkChangeCustomerKAMRequest)
          .subscribe(
            () => {
              this._generalService.sendUpdate('BulkChangeCustomerKAM:BulkChangeCustomerKAMView:Success');
            },
            () => {
              this._generalService.sendUpdate('BulkChangeCustomerKAMAll:BulkChangeCustomerKAMView:Failure');
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
    if (!this.selectedKAMID) {
      return;
    }
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.bulkChangeCustomerKAMService
      .getTableDataSort(this.selectedKAMID, this.PageNumber, columnName.active, this.sortType)
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
        if (parts[0] === 'BulkChangeCustomerKAM' && parts[2] === 'Success') {
          this.showNotification('snackbar-success', 'KAM changed successfully for selected records...!!!', 'bottom', 'center');
          this.selectedRecords = [];
          this.selectAll = false;
          this.refresh();
        } else if (parts[0] === 'BulkChangeCustomerKAMAll' && parts[2] === 'Failure') {
          this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
        }
      }
    });
  }
}
