// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MaxGarageInOutKMMinutes } from './maxGarageInOutKMMinutes.model';
import { MaxGarageInOutKMMinutesService } from './maxGarageInOutKMMinutes.service';

@Component({
  standalone: false,
  selector: 'app-maxGarageInOutKMMinutes',
  templateUrl: './maxGarageInOutKMMinutes.component.html',
  styleUrls: ['./maxGarageInOutKMMinutes.component.sass']
})
export class MaxGarageInOutKMMinutesComponent implements OnInit {
  displayedColumns = [
    'packageType',
    'maximumGarageToPickupKMs',
    'maximumGarageToPickupMinutes',
    'maximumDropoffToGarageKMs',
    'maximumDropoffToGarageMinutes',
    'status',
    'createdByID',
    'creationDateTime',
    'endDateTime',
    'actions'
  ];

  dataSource: MaxGarageInOutKMMinutes[] | null = null;
  customerContractID: number = 0;
  customerContractName: string = '';
  applicableFrom: string = '';
  applicableTo: string = '';
  PageNumber = 0;
  sortingData = 1;
  sortType = 'Descending';
  sortColumn = 'm.CustomerContractMaxG2GKMMinutesID';
  isTableLoading = false;

  constructor(
    private maxGarageService: MaxGarageInOutKMMinutesService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((paramsData) => {
      const encryptedCustomerContractID = paramsData.CustomerContractID;
      const encryptedStartDate = paramsData.StartDate;
      const encryptedEndDate = paramsData.EndDate;
      const encryptedCustomerContractName = paramsData.CustomerContractName;

      if (
        encryptedCustomerContractID &&
        encryptedStartDate &&
        encryptedEndDate &&
        encryptedCustomerContractName
      ) {
        this.customerContractID = Number(
          this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractID))
        );
        this.applicableFrom = this._generalService.decrypt(decodeURIComponent(encryptedStartDate));
        this.applicableTo = this._generalService.decrypt(decodeURIComponent(encryptedEndDate));
        this.customerContractName = this._generalService.decrypt(
          decodeURIComponent(encryptedCustomerContractName)
        );
      } else {
        this.customerContractID = Number(paramsData.CustomerContractID) || 0;
        this.customerContractName = paramsData.CustomerContractName || '';
      }

      this.PageNumber = 0;
      this.loadData();
    });
  }

  addNew(): void {
    if (!this.customerContractID || this.customerContractID <= 0) {
      this.showNotification(
        'snackbar-danger',
        'Customer Contract context is missing. Open this page from Customer Contract Actions.',
        'bottom',
        'center'
      );
      return;
    }

    const dialogRef = this.dialog.open(FormDialogComponent, {
      panelClass: 'max-garage-dialog-panel',
      autoFocus: false,
      restoreFocus: true,
      disableClose: false,
      data: {
        customerContractID: this.customerContractID
      }
    });

    dialogRef.afterClosed().subscribe((saved) => {
      if (saved) {
        this.PageNumber = 0;
        this.loadData();
      }
    });
  }

  deleteItem(row: MaxGarageInOutKMMinutes): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '420px',
      autoFocus: false,
      data: {
        customerContractMaxG2GKMMinutesID: row.customerContractMaxG2GKMMinutesID,
        packageType: row.packageType
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showNotification('snackbar-success', 'Record deleted successfully.', 'bottom', 'center');
        this.loadData();
      } else if (result?.error) {
        this.showNotification(
          'snackbar-danger',
          this.toErrorMessage(result.error, 'Failed to delete record.'),
          'bottom',
          'center'
        );
      }
    });
  }

  canDelete(row: MaxGarageInOutKMMinutes): boolean {
    return row?.activationStatus === true;
  }

  refresh(): void {
    this.PageNumber = 0;
    this.loadData();
  }

  loadData(): void {
    if (!this.customerContractID || this.customerContractID <= 0) {
      this.dataSource = null;
      return;
    }

    this.isTableLoading = true;
    this.maxGarageService
      .getTableDataSort(
        this.customerContractID,
        '',
        null,
        this.PageNumber,
        this.sortColumn,
        this.sortType
      )
      .subscribe(
        (data) => {
          this.dataSource = data && data.length ? data : null;
          this.isTableLoading = false;
        },
        (error) => {
          this.dataSource = null;
          this.isTableLoading = false;
          this.showNotification(
            'snackbar-danger',
            this.toErrorMessage(error, 'Failed to load records.'),
            'bottom',
            'center'
          );
        }
      );
  }

  SortingData(column: any): void {
    if (this.sortingData === 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.sortColumn = this.mapSortColumn(column.active);
    this.PageNumber = 0;
    this.loadData();
  }

  NextCall(): void {
    if (this.dataSource?.length > 0) {
      this.PageNumber++;
      this.loadData();
    }
  }

  PreviousCall(): void {
    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  formatDate(value: any): string {
    if (!value) {
      return '';
    }
    return moment(value).format('DD-MM-YYYY');
  }

  formatTime(value: any): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return '';
      }
      let timeToken = trimmed;
      if (trimmed.includes('T')) {
        timeToken = trimmed.split('T')[1] || '';
      }
      timeToken = timeToken.split('.')[0];
      const parsed = moment(timeToken, ['HH:mm:ss', 'H:mm:ss', 'hh:mm A', 'HH:mm'], true);
      return parsed.isValid() ? parsed.format('hh:mm A') : '';
    }

    if (typeof value === 'object' && value.hours !== undefined) {
      const parsed = moment({
        hour: value.hours,
        minute: value.minutes || 0,
        second: value.seconds || 0
      });
      return parsed.isValid() ? parsed.format('hh:mm A') : '';
    }

    const parsed = moment(value);
    return parsed.isValid() ? parsed.format('hh:mm A') : '';
  }

  formatDateTime(dateValue: any, timeValue: any): string {
    const datePart = this.formatDate(dateValue);
    const timePart = this.formatTime(timeValue);
    if (!datePart && !timePart) {
      return '';
    }
    if (datePart && timePart) {
      return `${datePart} ${timePart}`;
    }
    return datePart || timePart;
  }

  statusLabel(row: MaxGarageInOutKMMinutes): string {
    return row?.activationStatus === true ? 'Active' : 'Deactive';
  }

  private mapSortColumn(column: string): string {
    const map = {
      packageType: 'pt.PackageType',
      maximumGarageToPickupKMs: 'm.MaximumGarageToPickupKMs',
      maximumGarageToPickupMinutes: 'm.MaximumGarageToPickupMinutes',
      maximumDropoffToGarageKMs: 'm.MaximumDropoffToGarageKMs',
      maximumDropoffToGarageMinutes: 'm.MaximumDropoffToGarageMinutes',
      status: 'm.ActivationStatus',
      createdByID: 'm.CreatedByID',
      creationDateTime: 'm.CreationDate',
      endDateTime: 'm.EndDate'
    };
    return map[column] || 'm.CustomerContractMaxG2GKMMinutesID';
  }

  private toErrorMessage(error: any, fallback: string): string {
    if (typeof error === 'string' && error.trim()) {
      return error;
    }
    if (typeof error?.error === 'string' && error.error.trim()) {
      return error.error;
    }
    if (typeof error?.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }
    if (typeof error?.message === 'string' && error.message.trim()) {
      return error.message;
    }
    return fallback;
  }

  showNotification(colorName, text, placementFrom, placementAlign): void {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
