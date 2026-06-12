// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { DetachInvoicesFromSummaryService } from './detachInvoicesFromSummary.service';
import { DetachInvoicesFromSummary } from './detachInvoicesFromSummary.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  standalone: false,
  selector: 'app-detachInvoicesFromSummary',
  templateUrl: './detachInvoicesFromSummary.component.html',
  styleUrls: ['./detachInvoicesFromSummary.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DetachInvoicesFromSummaryComponent implements OnInit {
  displayedColumns = [
    'check',
    'invoiceNumberWithPrefix',
    'customerName',
    'invoiceDate',
    'placeOfSupply',
    'invoiceTotalAmountAfterGST'
  ];

  summaryID: number = 0;
  dataSource: DetachInvoicesFromSummary[] | null = null;
  searchForm: FormGroup;
  selectedInvoices: DetachInvoicesFromSummary[] = [];
  selectAll = false;
  pageNumber = 0;
  isLoading = false;
  isDetaching = false;

  constructor(
    private fb: FormBuilder,
    public detachService: DetachInvoicesFromSummaryService,
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
      if (this.summaryID) {
        this.pageNumber = 0;
        this.selectedInvoices = [];
        this.selectAll = false;
        this.isLoading = true;
        this.loadData();
      }
    });
  }

  search() {
    if (!this.summaryID) {
      this.showNotification('snackbar-danger', 'Summary ID is missing in query string.', 'bottom', 'center');
      return;
    }

    this.isLoading = true;
    this.pageNumber = 0;
    this.selectedInvoices = [];
    this.selectAll = false;
    this.loadData();
  }

  loadData() {
    if (!this.summaryID) {
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

    this.detachService
      .searchInvoices(this.summaryID, invoiceDateFrom, invoiceDateTo, invoiceNo, this.pageNumber)
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
    this.selectedInvoices = [];
    this.selectAll = false;
    this.pageNumber = 0;
    if (this.summaryID) {
      this.isLoading = true;
      this.loadData();
    } else {
      this.dataSource = null;
    }
  }

  detachInvoices() {
    if (!this.summaryID) {
      this.showNotification('snackbar-danger', 'Summary ID is missing.', 'bottom', 'center');
      return;
    }
    if (!this.selectedInvoices.length) {
      this.showNotification('snackbar-danger', 'Please select at least one invoice.', 'bottom', 'center');
      return;
    }

    this.isDetaching = true;
    const invoiceIDs = this.selectedInvoices.map((x) => x.invoiceID);
    this.detachService.detachInvoices(this.summaryID, invoiceIDs).subscribe(
      () => {
        this.isDetaching = false;
        this.showNotification('snackbar-success', 'Invoices detached successfully.', 'bottom', 'center');
        this.selectedInvoices = [];
        this.selectAll = false;
        this.search();
      },
      () => {
        this.isDetaching = false;
        this.showNotification('snackbar-danger', 'Failed to detach invoices.', 'bottom', 'center');
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

  onCheckBox(checked: boolean, row: DetachInvoicesFromSummary) {
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
