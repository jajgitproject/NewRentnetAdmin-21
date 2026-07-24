// @ts-nocheck
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { CustomerBillToShipTo } from './customerBillToShipTo.model';
import { CustomerBillToShipToService } from './customerBillToShipTo.service';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';

@Component({
  standalone: false,
  selector: 'app-customer-bill-to-ship-to',
  templateUrl: './customerBillToShipTo.component.html',
  styleUrls: ['./customerBillToShipTo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class CustomerBillToShipToComponent implements OnInit {
  displayedColumns = [
    'address1',
    'stateName',
    'cityName',
    'pincode',
    'gstno',
    'startDate',
    'endDate',
    'status',
    'actions',
  ];

  dataSource: CustomerBillToShipTo[] | null = null;
  SearchID = 0;
  SearchActivationStatus: boolean = true;
  PageNumber = 0;
  Customer_ID: any;
  Customer_Name: any;
  private updateSubscription: Subscription;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public service: CustomerBillToShipToService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((paramsData) => {
      const encryptedCustomerID = paramsData.CustomerID;
      const encryptedCustomerName = paramsData.CustomerName;
      if (encryptedCustomerID && encryptedCustomerName) {
        this.Customer_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.Customer_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      }
      this.loadData();
    });
    this.SubscribeUpdateService();
  }

  SubscribeUpdateService(): void {
    this.updateSubscription = this._generalService
      .getUpdate()
      .subscribe((message: string) => {
        if (message && message.indexOf('CustomerBillToShipTo') >= 0 && message.indexOf('Success') >= 0) {
          this.loadData();
        }
      });
  }

  refresh(): void {
    this.SearchID = 0;
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.loadData();
  }

  SearchData(): void {
    this.PageNumber = 0;
    this.loadData();
  }

  loadData(): void {
    if (!this.Customer_ID) {
      this.dataSource = null;
      return;
    }
    this.service
      .getTableData(this.SearchID, this.Customer_ID, this.SearchActivationStatus, this.PageNumber)
      .subscribe(
        (data) => {
          this.dataSource = data && data.length ? data : null;
        },
        (_error: HttpErrorResponse) => {
          this.dataSource = null;
        }
      );
  }

  NextCall(): void {
    if (this.dataSource && this.dataSource.length > 0) {
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

  addNew(): void {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: new CustomerBillToShipTo({}),
        action: 'add',
        CustomerID: this.Customer_ID,
        CustomerName: this.Customer_Name,
      },
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  editCall(row: CustomerBillToShipTo): void {
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerID: this.Customer_ID,
        CustomerName: this.Customer_Name,
      },
    });
  }

  deleteItem(row: CustomerBillToShipTo): void {
    if (!window.confirm('Delete this Bill To / Ship To record?')) {
      return;
    }
    this.service.delete(row.customerConfigurationBillToShipToID).subscribe(
      () => {
        this.showNotification('Record deleted.');
        this._generalService.sendUpdate('CustomerBillToShipToDelete:CustomerBillToShipToView:Success');
        this.loadData();
      },
      () => this.showNotification('Failed to delete record.', 'snackbar-danger')
    );
  }

  shouldShowDeleteButton(item: CustomerBillToShipTo): boolean {
    return item?.activationStatus !== false;
  }

  onContextMenu(event: MouseEvent, item: CustomerBillToShipTo): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  formatDate(value: any): string {
    if (!value) {
      return '-';
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      return '-';
    }
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  private showNotification(message: string, panelClass = 'snackbar-success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [panelClass],
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
}
