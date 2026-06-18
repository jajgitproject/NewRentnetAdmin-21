// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { AttachOrDetachInvoicesToSummaryService } from './attachOrDetachInvoicesToSummary.service';
import { InvoiceSummaryInvoiceItem } from './attachOrDetachInvoicesToSummary.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  standalone: false,
  selector: 'app-attachOrDetachInvoicesToSummary',
  templateUrl: './attachOrDetachInvoicesToSummary.component.html',
  styleUrls: ['./attachOrDetachInvoicesToSummary.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AttachOrDetachInvoicesToSummaryComponent implements OnInit {
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
  selectedTabIndex = 0;

  attachSearchForm: FormGroup;
  detachSearchForm: FormGroup;

  attachDataSource: InvoiceSummaryInvoiceItem[] | null = null;
  detachDataSource: InvoiceSummaryInvoiceItem[] | null = null;

  attachSelectedInvoices: InvoiceSummaryInvoiceItem[] = [];
  detachSelectedInvoices: InvoiceSummaryInvoiceItem[] = [];

  attachSelectAll = false;
  detachSelectAll = false;

  attachPageNumber = 0;
  detachPageNumber = 0;

  isAttachLoading = false;
  isDetachLoading = false;
  isAttaching = false;
  isDetaching = false;

  attachTabLoaded = false;
  detachTabLoaded = false;
  detachNeedsRefresh = true;
  attachNeedsRefresh = false;

  constructor(
    private fb: FormBuilder,
    public invoiceService: AttachOrDetachInvoicesToSummaryService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) {
    this.attachSearchForm = this.createSearchForm();
    this.detachSearchForm = this.createSearchForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.summaryID = Number(params.SummaryID || params.summaryID || 0);
      this.customerID = Number(params.CustomerID || params.customerID || 0);
      this.detachNeedsRefresh = true;
      this.attachNeedsRefresh = false;
      this.attachTabLoaded = false;
      this.detachTabLoaded = false;

      if (this.selectedTabIndex === 1 && this.summaryID) {
        this.searchDetach();
      }
    });
  }

  createSearchForm(): FormGroup {
    return this.fb.group({
      invoiceDateFrom: [null],
      invoiceDateTo: [null],
      invoiceNumberWithPrefix: ['']
    });
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
    if (index === 0 && this.attachNeedsRefresh && this.attachTabLoaded) {
      this.searchAttach();
    } else if (index === 1) {
      if (!this.detachTabLoaded || this.detachNeedsRefresh) {
        this.searchDetach();
      }
    }
  }

  searchAttach() {
    if (!this.summaryID) {
      this.showNotification('snackbar-danger', 'Summary ID is missing in query string.', 'bottom', 'center');
      return;
    }
    if (!this.customerID) {
      this.showNotification('snackbar-danger', 'Customer ID is missing in query string.', 'bottom', 'center');
      return;
    }

    this.isAttachLoading = true;
    this.attachPageNumber = 0;
    this.attachSelectedInvoices = [];
    this.attachSelectAll = false;
    this.loadAttachData();
  }

  searchDetach() {
    if (!this.summaryID) {
      this.showNotification('snackbar-danger', 'Summary ID is missing in query string.', 'bottom', 'center');
      return;
    }

    this.isDetachLoading = true;
    this.detachPageNumber = 0;
    this.detachSelectedInvoices = [];
    this.detachSelectAll = false;
    this.loadDetachData();
  }

  loadAttachData() {
    if (!this.customerID) {
      return;
    }

    const { invoiceDateFrom, invoiceDateTo, invoiceNo } = this.getSearchValues(this.attachSearchForm);

    this.invoiceService
      .searchUnattachedInvoices(this.customerID, invoiceDateFrom, invoiceDateTo, invoiceNo, this.attachPageNumber)
      .subscribe(
        (data) => {
          this.isAttachLoading = false;
          this.attachTabLoaded = true;
          this.attachNeedsRefresh = false;
          this.attachDataSource = data;
          this.syncCheckedState(this.attachDataSource, this.attachSelectedInvoices);
        },
        () => {
          this.isAttachLoading = false;
          this.attachDataSource = null;
        }
      );
  }

  loadDetachData() {
    if (!this.summaryID) {
      return;
    }

    const { invoiceDateFrom, invoiceDateTo, invoiceNo } = this.getSearchValues(this.detachSearchForm);

    this.invoiceService
      .searchAttachedInvoices(this.summaryID, invoiceDateFrom, invoiceDateTo, invoiceNo, this.detachPageNumber)
      .subscribe(
        (data) => {
          this.isDetachLoading = false;
          this.detachTabLoaded = true;
          this.detachNeedsRefresh = false;
          this.detachDataSource = data;
          this.syncCheckedState(this.detachDataSource, this.detachSelectedInvoices);
        },
        () => {
          this.isDetachLoading = false;
          this.detachDataSource = null;
        }
      );
  }

  getSearchValues(form: FormGroup) {
    let invoiceDateFrom = '';
    let invoiceDateTo = '';
    if (form.get('invoiceDateFrom').value) {
      invoiceDateFrom = moment(form.get('invoiceDateFrom').value).format('YYYY-MM-DD');
    }
    if (form.get('invoiceDateTo').value) {
      invoiceDateTo = moment(form.get('invoiceDateTo').value).format('YYYY-MM-DD');
    }
    const invoiceNo = (form.get('invoiceNumberWithPrefix').value || '').trim();
    return { invoiceDateFrom, invoiceDateTo, invoiceNo };
  }

  resetAttach() {
    this.attachSearchForm.reset({
      invoiceDateFrom: null,
      invoiceDateTo: null,
      invoiceNumberWithPrefix: ''
    });
    this.attachDataSource = null;
    this.attachSelectedInvoices = [];
    this.attachSelectAll = false;
    this.attachPageNumber = 0;
    this.attachTabLoaded = false;
  }

  resetDetach() {
    this.detachSearchForm.reset({
      invoiceDateFrom: null,
      invoiceDateTo: null,
      invoiceNumberWithPrefix: ''
    });
    this.detachSelectedInvoices = [];
    this.detachSelectAll = false;
    this.detachPageNumber = 0;
    if (this.summaryID) {
      this.isDetachLoading = true;
      this.loadDetachData();
    } else {
      this.detachDataSource = null;
      this.detachTabLoaded = false;
    }
  }

  attachInvoices() {
    if (!this.summaryID) {
      this.showNotification('snackbar-danger', 'Summary ID is missing.', 'bottom', 'center');
      return;
    }
    if (!this.attachSelectedInvoices.length) {
      this.showNotification('snackbar-danger', 'Please select at least one invoice.', 'bottom', 'center');
      return;
    }

    this.isAttaching = true;
    const invoiceIDs = this.attachSelectedInvoices.map((x) => x.invoiceID);
    this.invoiceService.attachInvoices(this.summaryID, invoiceIDs).subscribe(
      () => {
        this.isAttaching = false;
        this.showNotification('snackbar-success', 'Invoices attached successfully.', 'bottom', 'center');
        this.attachSelectedInvoices = [];
        this.attachSelectAll = false;
        this.detachNeedsRefresh = true;
        this.searchAttach();
        if (this.detachTabLoaded) {
          this.searchDetach();
        }
      },
      () => {
        this.isAttaching = false;
        this.showNotification('snackbar-danger', 'Failed to attach invoices.', 'bottom', 'center');
      }
    );
  }

  detachInvoices() {
    if (!this.summaryID) {
      this.showNotification('snackbar-danger', 'Summary ID is missing.', 'bottom', 'center');
      return;
    }
    if (!this.detachSelectedInvoices.length) {
      this.showNotification('snackbar-danger', 'Please select at least one invoice.', 'bottom', 'center');
      return;
    }

    this.isDetaching = true;
    const invoiceIDs = this.detachSelectedInvoices.map((x) => x.invoiceID);
    this.invoiceService.detachInvoices(this.summaryID, invoiceIDs).subscribe(
      () => {
        this.isDetaching = false;
        this.showNotification('snackbar-success', 'Invoices detached successfully.', 'bottom', 'center');
        this.detachSelectedInvoices = [];
        this.detachSelectAll = false;
        this.attachNeedsRefresh = true;
        this.searchDetach();
        if (this.attachTabLoaded) {
          this.searchAttach();
        }
      },
      () => {
        this.isDetaching = false;
        this.showNotification('snackbar-danger', 'Failed to detach invoices.', 'bottom', 'center');
      }
    );
  }

  syncCheckedState(dataSource: InvoiceSummaryInvoiceItem[], selected: InvoiceSummaryInvoiceItem[]) {
    if (!dataSource) {
      return;
    }
    dataSource.forEach((row) => {
      row.checked = selected.some((x) => x.invoiceID === row.invoiceID);
    });
  }

  checkAllAttach(checked: boolean) {
    this.attachSelectAll = checked;
    this.updateSelection(checked, this.attachDataSource, this.attachSelectedInvoices);
  }

  checkAllDetach(checked: boolean) {
    this.detachSelectAll = checked;
    this.updateSelection(checked, this.detachDataSource, this.detachSelectedInvoices);
  }

  onCheckBoxAttach(checked: boolean, row: InvoiceSummaryInvoiceItem) {
    row.checked = checked;
    this.toggleRowSelection(checked, row, this.attachSelectedInvoices, 'attach');
  }

  onCheckBoxDetach(checked: boolean, row: InvoiceSummaryInvoiceItem) {
    row.checked = checked;
    this.toggleRowSelection(checked, row, this.detachSelectedInvoices, 'detach');
  }

  updateSelection(checked: boolean, dataSource: InvoiceSummaryInvoiceItem[], selected: InvoiceSummaryInvoiceItem[]) {
    dataSource?.forEach((row) => {
      row.checked = checked;
      const index = selected.findIndex((x) => x.invoiceID === row.invoiceID);
      if (checked && index === -1) {
        selected.push(row);
      } else if (!checked && index > -1) {
        selected.splice(index, 1);
      }
    });
  }

  toggleRowSelection(
    checked: boolean,
    row: InvoiceSummaryInvoiceItem,
    selected: InvoiceSummaryInvoiceItem[],
    tab: 'attach' | 'detach'
  ) {
    const index = selected.findIndex((x) => x.invoiceID === row.invoiceID);
    if (checked && index === -1) {
      selected.push(row);
    } else if (!checked && index > -1) {
      selected.splice(index, 1);
      if (tab === 'attach') {
        this.attachSelectAll = false;
      } else {
        this.detachSelectAll = false;
      }
    }
    const dataSource = tab === 'attach' ? this.attachDataSource : this.detachDataSource;
    if (dataSource?.length) {
      if (tab === 'attach') {
        this.attachSelectAll = dataSource.every((r) => r.checked);
      } else {
        this.detachSelectAll = dataSource.every((r) => r.checked);
      }
    }
  }

  isIndeterminateAttach() {
    const checkedCount = this.attachDataSource?.filter((r) => r.checked).length || 0;
    return checkedCount > 0 && checkedCount < (this.attachDataSource?.length || 0);
  }

  isIndeterminateDetach() {
    const checkedCount = this.detachDataSource?.filter((r) => r.checked).length || 0;
    return checkedCount > 0 && checkedCount < (this.detachDataSource?.length || 0);
  }

  attachNextCall() {
    if (this.attachDataSource?.length > 0) {
      this.attachPageNumber++;
      this.loadAttachData();
    }
  }

  attachPreviousCall() {
    if (this.attachPageNumber > 0) {
      this.attachPageNumber--;
      this.loadAttachData();
    }
  }

  detachNextCall() {
    if (this.detachDataSource?.length > 0) {
      this.detachPageNumber++;
      this.loadDetachData();
    }
  }

  detachPreviousCall() {
    if (this.detachPageNumber > 0) {
      this.detachPageNumber--;
      this.loadDetachData();
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
