// @ts-nocheck
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import Swal from 'sweetalert2';
import { GeneralService } from '../general/general.service';
import { ForcedCreditNoteRebillingService } from './forcedCreditNoteRebilling.service';
import { ForcedCreditNoteRebilling } from './forcedCreditNoteRebilling.model';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';

@Component({
  standalone: false,
  selector: 'app-forcedCreditNoteRebilling',
  templateUrl: './forcedCreditNoteRebilling.component.html',
  styleUrls: ['./forcedCreditNoteRebilling.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ForcedCreditNoteRebillingComponent implements OnInit {
  displayedColumns = [
    'customerName',
    'creditNoteNumberWithPrefix',
    'creditNoteDate',
    'creditNoteAmount',
    'invoiceNumberWithPrefix',
    'invoiceTotalAmountAfterGST',
    'actions'
  ];

  dataSource: ForcedCreditNoteRebilling[] | null = null;
  hasSearched: boolean = false;
  isProcessing: boolean = false;
  pageNumber: number = 0;

  // Customer autocomplete
  customer: FormControl = new FormControl('');
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  public CustomerList?: CustomerDropDown[] = [];
  searchCustomerID: any = '';

  // Other search criteria
  searchCreditNoteDateFrom: string = '';
  searchCreditNoteDateTo: string = '';
  searchCreditNoteNumberWithPrefix: string = '';
  searchInvoiceNumberWithPrefix: string = '';

  constructor(
    public httpClient: HttpClient,
    public forcedCreditNoteRebillingService: ForcedCreditNoteRebillingService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    // No data is loaded on page load. Data loads only on search.
    this.filteredCustomerOptions = this.customer.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCustomers(value || ''))
    );
  }

  // ---------- Customer (AutoComplete based on three characters) ----------
  InitCustomer() {
    const prefix = this.customer.value;
    if (!prefix || prefix.toString().trim().length < 3) {
      this.searchCustomerID = '';
      this.CustomerList = [];
      return;
    }
    this._generalService.getCustomerForInvoice(prefix).subscribe((data) => {
      this.CustomerList = data || [];
      this.filteredCustomerOptions = this.customer.valueChanges.pipe(
        startWith(prefix || ''),
        map((value) => this._filterCustomers(value || ''))
      );
    });
  }

  private _filterCustomers(value: string): any {
    const filterValue = (value || '').toString().toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return (this.CustomerList || []).filter((data) => data.customerName.toLowerCase().includes(filterValue));
  }

  onCustomerSelected(customerName: string) {
    const selected = (this.CustomerList || []).find((data) => data.customerName === customerName);
    if (selected) {
      this.searchCustomerID = selected.customerID;
    }
  }

  public SearchData() {
    this.pageNumber = 0;
    this.loadData();
  }

  public loadData() {
    // If the customer field was cleared manually, drop the captured id.
    if (!this.customer.value || this.customer.value.toString().trim() === '') {
      this.searchCustomerID = '';
    }

    const fromDate = this.searchCreditNoteDateFrom ? moment(this.searchCreditNoteDateFrom).format('yyyy-MM-DD') : '';
    const toDate = this.searchCreditNoteDateTo ? moment(this.searchCreditNoteDateTo).format('yyyy-MM-DD') : '';

    this.hasSearched = true;
    this.forcedCreditNoteRebillingService
      .getTableData(
        this.searchCustomerID,
        fromDate,
        toDate,
        this.searchCreditNoteNumberWithPrefix,
        this.searchInvoiceNumberWithPrefix,
        this.pageNumber
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

  refresh() {
    this.customer.setValue('');
    this.searchCustomerID = '';
    this.searchCreditNoteDateFrom = '';
    this.searchCreditNoteDateTo = '';
    this.searchCreditNoteNumberWithPrefix = '';
    this.searchInvoiceNumberWithPrefix = '';
    this.CustomerList = [];
    this.pageNumber = 0;
    this.dataSource = null;
    this.hasSearched = false;
  }

  // ---------- Action: Force Credit Note Rebilling ----------
  forceRebill(row: ForcedCreditNoteRebilling) {
    if (this.isProcessing) {
      return;
    }

    Swal.fire({
      title: 'Force Credit Note Rebilling?',
      text: 'Credit Note: ' + (row.creditNoteNumberWithPrefix || row.invoiceCreditNoteID),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.isProcessing = true;
        this.forcedCreditNoteRebillingService.forcedRebilling(row.invoiceCreditNoteID).subscribe(
          (response: string) => {
            this.isProcessing = false;
            const message = (response || '').toString();
            if (message.toLowerCase().includes('success')) {
              Swal.fire('Success', message, 'success');
              this.showNotification('snackbar-success', 'Credit Note rebilled successfully...!!!', 'bottom', 'center');
              this.loadData();
            } else {
              Swal.fire('Failed', message || 'Operation failed', 'error');
              this.showNotification('snackbar-danger', 'Operation Failed...!!!', 'bottom', 'center');
            }
          },
          (error: HttpErrorResponse) => {
            this.isProcessing = false;
            const message = (error && error.error ? error.error : 'Operation failed').toString();
            Swal.fire('Failed', message, 'error');
            this.showNotification('snackbar-danger', 'Operation Failed...!!!', 'bottom', 'center');
          }
        );
      }
    });
  }

  NextCall() {
    if (this.dataSource && this.dataSource.length > 0) {
      this.pageNumber++;
      this.loadData();
    }
  }

  PreviousCall() {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.loadData();
    }
  }

  formatDate(value: any): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString('en-GB');
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
