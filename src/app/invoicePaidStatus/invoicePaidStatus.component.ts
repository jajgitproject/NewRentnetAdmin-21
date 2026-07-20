// @ts-nocheck
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { InvoicePaidStatusService } from './invoicePaidStatus.service';
import { InvoicePaidStatusRow } from './invoicePaidStatus.model';
import { InvoicePaidStatusHistoryDialogComponent } from './invoicePaidStatusHistoryDialog.component';

@Component({
  standalone: false,
  selector: 'app-invoice-paid-status',
  templateUrl: './invoicePaidStatus.component.html',
  styleUrls: ['./invoicePaidStatus.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class InvoicePaidStatusComponent implements OnInit {
  customerGroup = new FormControl('');
  customer = new FormControl('');
  customerGroupList: CustomerGroupDropDown[] = [];
  filteredOptions: Observable<CustomerGroupDropDown[]> = of([]);
  CustomerList: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]> = of([]);
  customerGroupID: number | null = null;
  customerID: number | null = null;

  invoiceDate: Date | null = null;
  paidStatus = 'No';

  rows: InvoicePaidStatusRow[] = [];
  selection = new SelectionModel<InvoicePaidStatusRow>(true, []);
  displayedColumns = [
    'select',
    'customerName',
    'invoiceNumber',
    'invoiceDate',
    'invoiceAmount',
    'paidStatus',
    'paidStatusBy',
    'paidMarkedDate',
    'paidMarkedTime',
  ];

  loading = false;
  marking = false;
  searched = false;
  markProgressCurrent = 0;
  markProgressTotal = 0;
  markProgressLabel = '';

  pageNumber = 0;
  pageSize = 50;
  totalCount = 0;
  pageSizeOptions = [50];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private service: InvoicePaidStatusService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.InitCustomerGroup();
  }

  InitCustomerGroup(): void {
    this.generalService.getCustomerGroup().subscribe((data) => {
      this.customerGroupList = data || [];
      this.filteredOptions = this.customerGroup.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCustomerGroup(value || ''))
      );
    });
  }

  private _filterCustomerGroup(value: string): CustomerGroupDropDown[] {
    const filterValue = String(value).toLowerCase();
    if (!filterValue || filterValue.length < 3) {
      return [];
    }
    return this.customerGroupList.filter((cg) =>
      cg.customerGroup?.toLowerCase().includes(filterValue)
    );
  }

  onCustomerGroupSelected(customerGroupName: string): void {
    const selected = this.customerGroupList.find((cg) => cg.customerGroup === customerGroupName);
    if (selected) {
      this.customer.setValue('');
      this.customerID = null;
      this.getGroupID(selected.customerGroupID);
    } else {
      this.customerGroupID = null;
      this.customerID = null;
      this.customer.setValue('');
      this.CustomerList = [];
      this.filteredCustomerOptions = of([]);
    }
  }

  getGroupID(customerGroupID: number): void {
    this.customerGroupID = customerGroupID;
    this.InitCustomer();
  }

  onKeyupCustomerName(event?: any): void {
    const Prefix = this.getCustomerNameForSearch(event?.target?.value ?? this.customer?.value);
    if (Prefix.length < 3) {
      if (!this.customerGroupID) {
        this.CustomerList = [];
      }
      return;
    }
    this.generalService.getCustomerForInvoice(Prefix).subscribe((data) => {
      this.CustomerList = data || [];
      this.filteredCustomerOptions = merge(of(Prefix), this.customer.valueChanges).pipe(
        map((value) => this._filterCustomer((value || '').toString()))
      );
    });
  }

  InitCustomer(): void {
    if (!this.customerGroupID) {
      return;
    }
    this.generalService.GetCustomersForCP(this.customerGroupID).subscribe((data) => {
      this.CustomerList = data || [];
      this.filteredCustomerOptions = this.customer.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCustomer(value || ''))
      );
    });
  }

  private getCustomerDisplayValue(data: CustomerDropDown): string {
    return data.customerName + '##' + (data.customerIdentityNumber || '');
  }

  private getCustomerNameForSearch(value: any): string {
    const raw = (value || '').toString().trim();
    if (!raw) {
      return raw;
    }
    return raw.split('##')[0].trim();
  }

  private _filterCustomer(value: string): CustomerDropDown[] {
    const filterValue = this.getCustomerNameForSearch(value).toLowerCase();
    if (!filterValue || filterValue.length < 3) {
      return [];
    }
    return this.CustomerList.filter((data) => {
      const identity = (data.customerIdentityNumber || '').toString().toLowerCase();
      return (
        data.customerName?.toLowerCase().includes(filterValue) ||
        identity.includes(filterValue) ||
        this.getCustomerDisplayValue(data).toLowerCase().includes(filterValue)
      );
    });
  }

  onCustomerSelected(customerValue: string): void {
    const selected = this.CustomerList.find(
      (data) => this.getCustomerDisplayValue(data) === customerValue
    );
    this.customerID = selected?.customerID || null;
  }

  formatDate(value: Date | null | undefined): string | null {
    if (!value) {
      return null;
    }
    return moment(value).utcOffset('+05:30').format('YYYY-MM-DD');
  }

  search(resetPage = true): void {
    if (resetPage) {
      this.pageNumber = 0;
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
    }

    this.loading = true;
    this.searched = true;
    this.selection.clear();
    this.service
      .search({
        customerGroupID: this.customerGroupID || null,
        customerGroup: this.customerGroup.value || null,
        customerID: this.customerID || null,
        customerName: this.getCustomerNameForSearch(this.customer.value) || null,
        invoiceDate: this.formatDate(this.invoiceDate),
        paidStatus: this.paidStatus || null,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      })
      .subscribe(
        (result) => {
          this.loading = false;
          const payload = result || {};
          this.rows = payload.rows || payload.Rows || [];
          this.totalCount = payload.totalCount ?? payload.TotalCount ?? 0;
          this.pageNumber = payload.pageNumber ?? payload.PageNumber ?? this.pageNumber;
          this.pageSize = payload.pageSize ?? payload.PageSize ?? this.pageSize;
        },
        () => {
          this.loading = false;
          this.rows = [];
          this.totalCount = 0;
          this.showNotification('Failed to load invoices.', 'snackbar-danger');
        }
      );
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize || 50;
    this.search(false);
  }

  isAllSelected(): boolean {
    return this.rows.length > 0 && this.selection.selected.length === this.rows.length;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.rows);
    }
  }

  onRowClick(row: InvoicePaidStatusRow): void {
    const invoiceID = Number((row as any)?.invoiceID ?? (row as any)?.InvoiceID ?? 0);
    if (!invoiceID) {
      this.showNotification('Invoice ID not found for selected row.', 'snackbar-danger');
      return;
    }

    this.dialog.open(InvoicePaidStatusHistoryDialogComponent, {
      width: '95vw',
      maxWidth: '1200px',
      injector: this.injector,
      data: {
        invoiceID,
        invoiceNumber: (row as any)?.invoiceNumber || (row as any)?.InvoiceNumber || '',
        invoiceNumberWithPrefix: (row as any)?.invoiceNumber || (row as any)?.InvoiceNumber || '',
      },
    });
  }

  markAsPaid(): void {
    this.markPaidStatus(true);
  }

  markAsUnpaid(): void {
    this.markPaidStatus(false);
  }

  private markPaidStatus(paidStatus: boolean): void {
    const selected = this.selection.selected;
    if (!selected.length) {
      this.showNotification('Select at least one invoice.');
      return;
    }

    const verb = paidStatus ? 'Paid' : 'Unpaid';
    if (!window.confirm(`Mark ${selected.length} invoice(s) as ${verb}?`)) {
      return;
    }

    const invoiceIDs = selected
      .map((r) => Number((r as any)?.invoiceID ?? (r as any)?.InvoiceID ?? 0))
      .filter((id) => id > 0);

    if (!invoiceIDs.length) {
      this.showNotification('No valid Invoice IDs selected.', 'snackbar-danger');
      return;
    }

    this.marking = true;
    this.markProgressCurrent = 0;
    this.markProgressTotal = invoiceIDs.length;
    this.markProgressLabel = `Marking invoices as ${verb}...`;
    const performedBy = this.generalService.getUserID();
    let successCount = 0;
    let failureCount = 0;

    const processNext = (index: number): void => {
      if (index >= invoiceIDs.length) {
        this.marking = false;
        this.markProgressCurrent = this.markProgressTotal;
        this.markProgressLabel = '';
        this.selection.clear();
        const panelClass = failureCount > 0 ? 'snackbar-warning' : 'snackbar-success';
        const message =
          failureCount === 0
            ? `${successCount} invoice(s) marked as ${verb}.`
            : `${successCount} marked as ${verb}, ${failureCount} failed.`;
        this.showNotification(message, panelClass);
        this.search(false);
        return;
      }

      this.markProgressCurrent = index;
      this.markProgressLabel = `Marking invoice ${index + 1} of ${invoiceIDs.length} as ${verb}...`;

      this.service
        .markPaidStatus(performedBy, {
          invoiceIDs: [invoiceIDs[index]],
          paidStatus,
        })
        .subscribe(
          (result) => {
            successCount += result?.successCount || 0;
            failureCount += result?.failureCount || 0;
            this.markProgressCurrent = index + 1;
            processNext(index + 1);
          },
          () => {
            failureCount += 1;
            this.markProgressCurrent = index + 1;
            processNext(index + 1);
          }
        );
    };

    processNext(0);
  }

  get markProgressPercent(): number {
    if (!this.markProgressTotal) {
      return 0;
    }
    return Math.round((this.markProgressCurrent / this.markProgressTotal) * 100);
  }

  formatDisplayDate(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return moment(value).utcOffset('+05:30').format('DD-MMM-YYYY');
  }

  formatMoney(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toFixed(2);
  }

  private showNotification(message: string, panelClass = 'snackbar-warning'): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: [panelClass],
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
}
