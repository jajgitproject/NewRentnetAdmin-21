// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceSyncDetailsDialogComponent } from './dialogs/invoice-sync-details-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, merge, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { SendDataToDynamicsService } from './sendDataToDynamics.service';
import { SendDataToDynamicsInvoice } from './sendDataToDynamics.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';

@Component({
  standalone: false,
  selector: 'app-send-data-to-dynamics',
  templateUrl: './sendDataToDynamics.component.html',
  styleUrls: ['./sendDataToDynamics.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SendDataToDynamicsComponent implements OnInit {
  displayedColumns = [
    'select',
    'invoiceNumberWithPrefix',
    'invoiceDate',
    'invoiceGstStatus',
    'invoiceType',
    'IRNStatus',
    'invoiceSyncStatus',
    'customerName',
    'branchName',
    'invoiceTotalAmountAfterGST'
  ];

  dataSource: SendDataToDynamicsInvoice[] | null = null;
  selection = new SelectionModel<SendDataToDynamicsInvoice>(true, []);
  sending = false;
  loading = false;
  sendSummary = '';
  lastBatchId = 0;

  PageNumber = 0;
  sortingData = 1;
  sortType = 'Descending';
  searchActivationStatus = true;

  searchGstCategory = 'Both';
  searchInvoiceType = 'All';
  searchInvoiceSyncStatus = '';
  searchInvoiceNo = '';
  searchDutySlip = '';
  searchReservationID = '';
  SearchFromDate = '';
  SearchToDate = '';
  SearchEInvoiceStatus = '';

  customerGroup = new FormControl();
  customer = new FormControl();
  branch = new FormControl();

  customerGroupID: any;
  public customerGroupList?: CustomerGroupDropDown[] = [];
  public CustomerList?: CustomerDropDown[] = [];
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  filteredOptions: Observable<CustomerGroupDropDown[]> = of([]);
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;

  constructor(
    private sendDataToDynamicsService: SendDataToDynamicsService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initCustomerGroup();
    this.initCompany();
  }

  searchData(): void {
    this.PageNumber = 0;
    this.loadData();
  }

  refresh(): void {
    this.PageNumber = 0;
    this.searchActivationStatus = true;
    this.customerGroup.setValue('');
    this.customer.setValue('');
    this.branch.setValue('');
    this.searchGstCategory = 'Both';
    this.searchInvoiceNo = '';
    this.searchInvoiceType = 'All';
    this.searchInvoiceSyncStatus = '';
    this.searchDutySlip = '';
    this.searchReservationID = '';
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.SearchEInvoiceStatus = '';
    this.sendSummary = '';
    this.lastBatchId = 0;
    this.loadData();
  }

  loadData(): void {
    this.applyDefaultSearchDatesIfEmpty();

    if (this.SearchFromDate) {
      this.SearchFromDate = moment(this.SearchFromDate).format('yyyy-MM-DD');
    }
    if (this.SearchToDate) {
      this.SearchToDate = moment(this.SearchToDate).format('yyyy-MM-DD');
    }

    const customerName = this.getCustomerNameForSearch(this.customer.value);
    this.loading = true;
    this.sendDataToDynamicsService.getTableData(
      this.searchGstCategory,
      this.searchInvoiceType,
      customerName,
      this.customerGroup.value,
      this.searchInvoiceNo,
      this.branch.value,
      this.SearchFromDate,
      this.SearchToDate,
      this.searchInvoiceSyncStatus,
      this.SearchEInvoiceStatus,
      this.searchDutySlip,
      this.searchReservationID,
      this.searchActivationStatus,
      this.PageNumber
    ).subscribe({
      next: (data) => {
        this.loading = false;
        this.dataSource = (data || []).map((row) => new SendDataToDynamicsInvoice(row));
        this.selection.clear();
      },
      error: () => {
        this.loading = false;
        this.dataSource = null;
        this.selection.clear();
        this.showNotification('snackbar-danger', 'Search failed. Please try again with a narrower date range or filters.', 'bottom', 'center');
      }
    });
  }

  private applyDefaultSearchDatesIfEmpty(): void {
    if (!this.searchInvoiceNo && !this.SearchFromDate && !this.SearchToDate) {
      this.SearchFromDate = moment().startOf('month').format('yyyy-MM-DD');
      this.SearchToDate = moment().format('yyyy-MM-DD');
    }
  }

  sortingDataHandler(column: any): void {
    if (this.sortingData === 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }

    const customerName = this.getCustomerNameForSearch(this.customer.value);
    this.loading = true;
    this.sendDataToDynamicsService.getTableDataSort(
      this.searchGstCategory,
      this.searchInvoiceType,
      customerName,
      this.customerGroup.value,
      this.searchInvoiceNo,
      this.branch.value,
      this.SearchFromDate,
      this.SearchToDate,
      this.searchInvoiceSyncStatus,
      this.SearchEInvoiceStatus,
      this.searchDutySlip,
      this.searchReservationID,
      this.searchActivationStatus,
      this.PageNumber,
      column.active,
      this.sortType
    ).subscribe({
      next: (data) => {
        this.loading = false;
        this.dataSource = (data || []).map((row) => new SendDataToDynamicsInvoice(row));
        this.selection.clear();
      },
      error: () => {
        this.loading = false;
        this.dataSource = null;
        this.selection.clear();
        this.showNotification('snackbar-danger', 'Search failed. Please try again with a narrower date range or filters.', 'bottom', 'center');
      }
    });
  }

  nextCall(): void {
    if (this.dataSource?.length > 0) {
      this.PageNumber++;
      this.loadData();
    }
  }

  previousCall(): void {
    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  isAllSelected(): boolean {
    const selectableRows = this.getSelectableRows();
    if (!selectableRows.length) {
      return false;
    }
    return selectableRows.every((row) => this.selection.isSelected(row));
  }

  hasPartialSelection(): boolean {
    const selectableRows = this.getSelectableRows();
    const selectedCount = selectableRows.filter((row) => this.selection.isSelected(row)).length;
    return selectedCount > 0 && selectedCount < selectableRows.length;
  }

  masterToggle(): void {
    const selectableRows = this.getSelectableRows();
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.clear();
    selectableRows.forEach((row) => this.selection.select(row));
  }

  toggleRowSelection(row: SendDataToDynamicsInvoice): void {
    if (!this.isRowSelectable(row)) {
      return;
    }
    this.selection.toggle(row);
  }

  isRowSelectable(row: SendDataToDynamicsInvoice): boolean {
    return !!row?.canSelectForDynamics;
  }

  getSelectableRows(): SendDataToDynamicsInvoice[] {
    return (this.dataSource || []).filter((row) => this.isRowSelectable(row));
  }

  getRowDisabledReason(row: SendDataToDynamicsInvoice): string {
    if (!row || this.isRowSelectable(row)) {
      return '';
    }
    if ((row.invoiceSyncStatus || '').toLowerCase() === 'successful') {
      return 'Already synced successfully to Dynamics';
    }
    if (row.isGstInvoice && String(row.irnStatus || '').trim().toLowerCase() !== 'generated') {
      return 'GST registered customer invoice requires E-Invoice before syncing to Dynamics';
    }
    return 'This invoice cannot be sent to Dynamics';
  }

  getSelectedSelectableCount(): number {
    return this.selection.selected.filter((row) => this.isRowSelectable(row)).length;
  }

  sendDataToDynamics(): void {
    const selected = this.selection.selected.filter((row) => this.isRowSelectable(row));
    if (!selected.length) {
      this.showNotification('snackbar-danger', 'Please select at least one invoice.', 'bottom', 'center');
      return;
    }

    const confirmed = window.confirm(
      `Send ${selected.length} selected invoice(s) from RentNet to Dynamics?\n\n` +
      'Batch mode: processing runs in the background. You do not need to stay on this page — ' +
      'invoices will be sent automatically. Track progress on the Batch Monitor.'
    );
    if (!confirmed) {
      return;
    }

    const invoiceIds = selected.map((row) => row.invoiceID).filter((id) => id > 0);
    this.sending = true;
    this.sendSummary = '';

    this.sendDataToDynamicsService.sendInvoicesToDynamics(invoiceIds, this.generalService.getUserID()).subscribe({
      next: (response) => {
        this.sending = false;
        const batchId = response?.dynamicsSyncBatchID ?? response?.DynamicsSyncBatchID ?? 0;
        const itemCount = response?.numberofItems ?? response?.NumberofItems ?? invoiceIds.length;
        this.lastBatchId = batchId;
        this.sendSummary = batchId
          ? `Batch #${batchId} started in background for ${itemCount} invoice(s). Track progress on the DynamicsSyncBatch page.`
          : `Batch started in background for ${itemCount} invoice(s).`;
        this.showNotification(
          'snackbar-success',
          this.sendSummary,
          'bottom',
          'center'
        );
        this.selection.clear();
        this.loadData();
      },
      error: (err: unknown) => {
        this.sending = false;
        const message = this.resolveSendErrorMessage(err);
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    });
  }

  private resolveSendErrorMessage(err: unknown): string {
    if (typeof err === 'string' && err.trim()) {
      return err.trim();
    }
    const httpErr = err as HttpErrorResponse;
    const body = httpErr?.error;
    const bodyMessage =
      (typeof body === 'string' && body.trim())
      || (body && typeof body === 'object' && (body.message || body.Message));
    if (typeof bodyMessage === 'string' && bodyMessage.trim()) {
      return bodyMessage.trim();
    }
    if (httpErr?.message?.trim()) {
      return httpErr.message.trim();
    }
    return 'Failed to send invoices to Dynamics.';
  }

  private getCustomerNameForSearch(value: any): string {
    const raw = (value || '').toString().trim();
    if (!raw) {
      return raw;
    }
    return raw.split('##')[0].trim();
  }

  initCustomerGroup(): void {
    this.filteredOptions = this.customerGroup.valueChanges.pipe(
      debounceTime(300),
      switchMap((value: string) => {
        const prefix = (value || '').trim();
        if (prefix.length < 3) {
          this.customerGroupList = [];
          return of([]);
        }
        return this.generalService.getCustomerGroupForDropDown(prefix);
      }),
      tap((data) => {
        this.customerGroupList = data || [];
      })
    );
  }

  onCustomerGroupSelected(customerGroup: string): void {
    const selected = (this.customerGroupList || []).find((g) => g.customerGroup === customerGroup);
    if (selected) {
      this.customer.setValue('');
      this.customerGroupID = selected.customerGroupID;
      this.initCustomer();
    } else {
      this.customerGroupID = null;
      this.customer.setValue('');
    }
  }

  onCustomerGroupOptionClick(option: CustomerGroupDropDown): void {
    if (!option) {
      return;
    }
    this.customerGroupID = option.customerGroupID;
    this.customer.setValue('');
    this.initCustomer();
  }

  onKeyupCustomerName(event?: any): void {
    const prefix = this.getCustomerNameForSearch(event?.target?.value ?? this.customer?.value);
    if (prefix.length < 3) {
      this.CustomerList = [];
      return;
    }
    this.generalService.getCustomerForInvoice(prefix).subscribe((data) => {
      this.CustomerList = data;
      this.filteredCustomerOptions = merge(of(prefix), this.customer.valueChanges).pipe(
        map((value) => this.filterCustomer((value || '').toString()))
      );
    });
  }

  initCustomer(): void {
    this.generalService.GetCustomersForCP(this.customerGroupID).subscribe((data) => {
      this.CustomerList = data;
      this.filteredCustomerOptions = this.customer.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterCustomer(value || ''))
      );
    });
  }

  private getCustomerDisplayValue(data: CustomerDropDown): string {
    return data.customerName + '##' + (data.customerIdentityNumber || '');
  }

  private filterCustomer(value: string): CustomerDropDown[] {
    const filterValue = this.getCustomerNameForSearch(value).toLowerCase();
    if (!filterValue || filterValue.length < 3) {
      return [];
    }
    return (this.CustomerList || []).filter((data) => {
      const identity = (data.customerIdentityNumber || '').toString().toLowerCase();
      return data.customerName.toLowerCase().includes(filterValue)
        || identity.includes(filterValue)
        || this.getCustomerDisplayValue(data).toLowerCase().includes(filterValue);
    });
  }

  initCompany(): void {
    this.generalService.GetOrganizationalBranch().subscribe((data) => {
      this.OrganizationalEntityList = data;
      this.filteredOrganizationalEntityOptions = this.branch.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterOrganizationalEntity(value || ''))
      );
    });
  }

  private filterOrganizationalEntity(value: string): OrganizationalEntityDropDown[] {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];
    }
    return (this.OrganizationalEntityList || []).filter((entity) =>
      entity.organizationalEntityName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  showNotification(colorName: string, text: string, placementFrom: string, placementAlign: string): void {
    this.snackBar.open(text, '', {
      duration: 4000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  getStatusBadgeClass(value: string): string {
    const status = String(value || '').trim().toLowerCase();
    if (!status || status === 'n/a') {
      return 'sdd-badge sdd-badge--muted';
    }
    if (status === 'active' || status === 'generated' || status === 'successful' || status === 'gst') {
      return 'sdd-badge sdd-badge--success';
    }
    if (status === 'void' || status === 'cancelled' || status === 'not created' || status === 'failed') {
      return 'sdd-badge sdd-badge--warning';
    }
    if (status === 'unprocessed' || status === 'nongst') {
      return 'sdd-badge sdd-badge--muted';
    }
    if (status === 'processing') {
      return 'sdd-badge sdd-badge--info';
    }
    return 'sdd-badge sdd-badge--info';
  }

  getInvoiceTypeLabel(invoiceType: string): string {
    const type = String(invoiceType || '').trim();
    if (type === 'InvoiceGeneral') {
      return 'General';
    }
    if (type === 'InvoiceSingleDuty') {
      return 'Single Duty';
    }
    if (type === 'InvoiceMultyDuty' || type === 'InvoiceMultiDuty') {
      return 'Multiple Duty';
    }
    return type || 'N/A';
  }

  getEInvoiceStatusLabel(irnStatus: string): string {
    const status = String(irnStatus || '').trim();
    return status || 'Not Created';
  }

  openInvoiceSyncDetails(row: SendDataToDynamicsInvoice, event?: MouseEvent): void {
    const invoiceId = row?.invoiceID || row?.InvoiceID || 0;
    if (!invoiceId) {
      return;
    }

    if (event) {
      const target = event.target as HTMLElement;
      if (target.closest('.sdd-col-select') || target.closest('mat-checkbox')) {
        return;
      }
    }

    this.dialog.open(InvoiceSyncDetailsDialogComponent, {
      width: '520px',
      maxWidth: '520px',
      maxHeight: '90vh',
      panelClass: 'sdd-invoice-sync-details-panel',
      autoFocus: false,
      data: { documentKind: 'invoice', invoiceId, row }
    });
  }

  isRowSelected(row: SendDataToDynamicsInvoice): boolean {
    return this.selection.isSelected(row);
  }

  getRecordCount(): number {
    return this.dataSource?.length || 0;
  }

  openBatchMonitor(): void {
    const queryParams: { batchId?: number; syncSource: string } = { syncSource: 'invoice' };
    if (this.lastBatchId > 0) {
      queryParams.batchId = this.lastBatchId;
    }
    this.router.navigate(['/dynamicsSyncBatch'], { queryParams });
  }

  getSummaryClass(): string {
    const summary = (this.sendSummary || '').toLowerCase();
    if (summary.includes('failed') && !summary.includes('0 failed')) {
      return 'sdd-summary--warning';
    }
    if (summary.includes('succeeded')) {
      return 'sdd-summary--success';
    }
    return '';
  }
}
