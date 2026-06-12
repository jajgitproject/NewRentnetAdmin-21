// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { AttachInvoicesToSummaryService } from './attachInvoicesToSummary.service';
import { AttachInvoicesToSummary } from './attachInvoicesToSummary.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  standalone: false,
  selector: 'app-attachInvoicesToSummary',
  templateUrl: './attachInvoicesToSummary.component.html',
  styleUrls: ['./attachInvoicesToSummary.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AttachInvoicesToSummaryComponent implements OnInit {
  displayedColumns = [
    'check',
    'invoiceNumberWithPrefix',
    'customerName',
    'invoiceDate',
    'placeOfSupply',
    'invoiceTotalAmountAfterGST'
  ];

  summaryID: number = 0;
  customerID: number = 0;
  dataSource: AttachInvoicesToSummary[] | null = null;
  searchForm: FormGroup;
  selectedInvoices: AttachInvoicesToSummary[] = [];
  selectAll = false;
  pageNumber = 0;
  isLoading = false;
  isAttaching = false;

  constructor(
    private fb: FormBuilder,
    public attachService: AttachInvoicesToSummaryService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      invoiceDateFrom: [null],
      invoiceDateTo: [null],
      invoiceNumberWithPrefix: ['']
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.summaryID = Number(params.SummaryID || params.summaryID || 0);
      this.customerID = Number(params.CustomerID || params.customerID || 0);
    });
  }

  search() {
    if (!this.summaryID) {
      this.showNotification('snackbar-danger', 'Summary ID is missing in query string.', 'bottom', 'center');
      return;
    }
    if (!this.customerID) {
      this.showNotification('snackbar-danger', 'Customer ID is missing in query string.', 'bottom', 'center');
      return;
    }

    this.isLoading = true;
    this.pageNumber = 0;
    this.selectedInvoices = [];
    this.selectAll = false;
    this.loadData();
  }

  loadData() {
    if (!this.customerID) {
      return;
    }

    let invoiceDateFrom = '';
    let invoiceDateTo = '';
    if (this.searchForm.get('invoiceDateFrom').value) {
      invoiceDateFrom = moment(this.searchForm.get('invoiceDateFrom').value).format('YYYY-MM-DD');
    }
    if (this.searchForm.get('invoiceDateTo').value) {
      invoiceDateTo = moment(this.searchForm.get('invoiceDateTo').value).format('YYYY-MM-DD');
    }

    const invoiceNo = (this.searchForm.get('invoiceNumberWithPrefix').value || '').trim();

    this.attachService
      .searchInvoices(this.customerID, invoiceDateFrom, invoiceDateTo, invoiceNo, this.pageNumber)
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.dataSource = data;
          if (this.dataSource) {
            this.dataSource.forEach((row) => {
              row.checked = this.selectedInvoices.some((x) => x.invoiceID === row.invoiceID);
            });
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.dataSource = null;
        }
      );
  }

  reset() {
    this.searchForm.reset({
      invoiceDateFrom: null,
      invoiceDateTo: null,
      invoiceNumberWithPrefix: ''
    });
    this.dataSource = null;
    this.selectedInvoices = [];
    this.selectAll = false;
    this.pageNumber = 0;
  }

  attachInvoices() {
    if (!this.summaryID) {
      this.showNotification('snackbar-danger', 'Summary ID is missing.', 'bottom', 'center');
      return;
    }
    if (!this.selectedInvoices.length) {
      this.showNotification('snackbar-danger', 'Please select at least one invoice.', 'bottom', 'center');
      return;
    }

    this.isAttaching = true;
    const invoiceIDs = this.selectedInvoices.map((x) => x.invoiceID);
    this.attachService.attachInvoices(this.summaryID, invoiceIDs).subscribe(
      () => {
        this.isAttaching = false;
        this.showNotification('snackbar-success', 'Invoices attached successfully.', 'bottom', 'center');
        this.selectedInvoices = [];
        this.selectAll = false;
        this.search();
      },
      () => {
        this.isAttaching = false;
        this.showNotification('snackbar-danger', 'Failed to attach invoices.', 'bottom', 'center');
      }
    );
  }

  checkAll(checked: boolean) {
    this.selectAll = checked;
    this.dataSource?.forEach((row) => {
      row.checked = checked;
      const index = this.selectedInvoices.findIndex((x) => x.invoiceID === row.invoiceID);
      if (checked && index === -1) {
        this.selectedInvoices.push(row);
      } else if (!checked && index > -1) {
        this.selectedInvoices.splice(index, 1);
      }
    });
  }

  onCheckBox(checked: boolean, row: AttachInvoicesToSummary) {
    row.checked = checked;
    const index = this.selectedInvoices.findIndex((x) => x.invoiceID === row.invoiceID);
    if (checked && index === -1) {
      this.selectedInvoices.push(row);
    } else if (!checked && index > -1) {
      this.selectedInvoices.splice(index, 1);
      this.selectAll = false;
    }
    if (this.dataSource?.length) {
      this.selectAll = this.dataSource.every((r) => r.checked);
    }
  }

  isIndeterminate() {
    const checkedCount = this.dataSource?.filter((r) => r.checked).length || 0;
    return checkedCount > 0 && checkedCount < (this.dataSource?.length || 0);
  }

  NextCall() {
    if (this.dataSource?.length > 0) {
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
    return moment(value).format('DD-MM-YYYY');
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
