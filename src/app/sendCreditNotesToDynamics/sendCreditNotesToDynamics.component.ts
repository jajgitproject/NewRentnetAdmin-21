// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, merge, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { SendCreditNotesToDynamicsService } from './sendCreditNotesToDynamics.service';
import { SendCreditNotesToDynamicsCreditNote } from './sendCreditNotesToDynamics.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';

@Component({
  standalone: false,
  selector: 'app-send-credit-notes-to-dynamics',
  templateUrl: './sendCreditNotesToDynamics.component.html',
  styleUrls: [
    '../sendDataToDynamics/sendDataToDynamics.component.scss',
    './sendCreditNotesToDynamics.component.scss'
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SendCreditNotesToDynamicsComponent implements OnInit {
  displayedColumns = [
    'select',
    'creditNoteNumberWithPrefix',
    'creditNoteDate',
    'creditNoteGstStatus',
    'invoiceType',
    'IRNStatus',
    'creditNoteSyncStatus',
    'customerName',
    'branchName',
    'invoiceNumberWithPrefix',
    'creditNoteAmount'
  ];

  dataSource: SendCreditNotesToDynamicsCreditNote[] | null = null;
  selection = new SelectionModel<SendCreditNotesToDynamicsCreditNote>(true, []);
  sending = false;
  loading = false;
  sendSummary = '';
  lastBatchId = 0;

  PageNumber = 0;
  sortingData = 1;
  sortType = 'Descending';
  searchActivationStatus = true;

  searchInvoiceNo = '';
  searchCreditNoteNo = '';
  SearchFromDate = '';
  SearchToDate = '';
  searchCreditNoteType = '';
  searchECreditNoteStatus = '';

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
    private sendCreditNotesToDynamicsService: SendCreditNotesToDynamicsService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private router: Router
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
    this.searchInvoiceNo = '';
    this.searchCreditNoteNo = '';
    this.searchCreditNoteType = '';
    this.searchECreditNoteStatus = '';
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.sendSummary = '';
    this.loadData();
  }

  loadData(): void {
    this.applyDefaultSearchDatesIfEmpty();

    if (this.SearchFromDate) {
      this.SearchFromDate = moment(this.SearchFromDate).format('YYYY-MM-DD');
    }
    if (this.SearchToDate) {
      this.SearchToDate = moment(this.SearchToDate).format('YYYY-MM-DD');
    }

    const customerName = this.getCustomerNameForSearch(this.customer.value);
    this.loading = true;
    this.sendCreditNotesToDynamicsService.getTableData(
      customerName,
      this.customerGroup.value,
      this.searchInvoiceNo,
      this.searchCreditNoteNo,
      this.branch.value,
      this.SearchFromDate,
      this.SearchToDate,
      this.searchCreditNoteType,
      this.searchECreditNoteStatus,
      this.searchActivationStatus,
      this.PageNumber
    ).subscribe({
      next: (data) => {
        this.loading = false;
        this.dataSource = (data || []).map((row) => new SendCreditNotesToDynamicsCreditNote(row));
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
    if (!this.searchInvoiceNo && !this.searchCreditNoteNo && !this.SearchFromDate && !this.SearchToDate) {
      this.SearchFromDate = moment().startOf('month').format('YYYY-MM-DD');
      this.SearchToDate = moment().format('YYYY-MM-DD');
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
    this.sendCreditNotesToDynamicsService.getTableDataSort(
      customerName,
      this.customerGroup.value,
      this.searchInvoiceNo,
      this.searchCreditNoteNo,
      this.branch.value,
      this.SearchFromDate,
      this.SearchToDate,
      this.searchCreditNoteType,
      this.searchECreditNoteStatus,
      this.searchActivationStatus,
      this.PageNumber,
      column.active,
      this.sortType
    ).subscribe({
      next: (data) => {
        this.loading = false;
        this.dataSource = (data || []).map((row) => new SendCreditNotesToDynamicsCreditNote(row));
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

  toggleRowSelection(row: SendCreditNotesToDynamicsCreditNote): void {
    if (!this.isRowSelectable(row)) {
      return;
    }
    this.selection.toggle(row);
  }

  isRowSelectable(row: SendCreditNotesToDynamicsCreditNote): boolean {
    return !!row?.canSelectForDynamics;
  }

  getSelectableRows(): SendCreditNotesToDynamicsCreditNote[] {
    return (this.dataSource || []).filter((row) => this.isRowSelectable(row));
  }

  getRowDisabledReason(row: SendCreditNotesToDynamicsCreditNote): string {
    if (!row || this.isRowSelectable(row)) {
      return '';
    }
    if ((row.creditNoteSyncStatus || '').toLowerCase() === 'successful') {
      return 'Already synced successfully to Dynamics';
    }
    if (String(row.approvalStatus || '').toLowerCase() !== 'approved') {
      return 'Credit note must be approved before syncing to Dynamics';
    }
    if (row.isGstCreditNote && String(row.irnStatus || '').trim().toLowerCase() !== 'generated') {
      return 'GST credit note requires E-Credit Note before syncing to Dynamics';
    }
    return 'This credit note cannot be sent to Dynamics';
  }

  getSelectedSelectableCount(): number {
    return this.selection.selected.filter((row) => this.isRowSelectable(row)).length;
  }

  sendCreditNotesToDynamics(): void {
    const selected = this.selection.selected.filter((row) => this.isRowSelectable(row));
    if (!selected.length) {
      this.showNotification('snackbar-danger', 'Please select at least one credit note.', 'bottom', 'center');
      return;
    }

    const confirmed = window.confirm(
      `Send ${selected.length} selected credit note(s) from RentNet to Dynamics?\n\n` +
      'Batch mode: processing runs in the background. Track progress on the Batch Monitor.'
    );
    if (!confirmed) {
      return;
    }

    const creditNoteIds = selected.map((row) => row.invoiceCreditNoteID).filter((id) => id > 0);
    this.sending = true;
    this.sendSummary = '';

    this.sendCreditNotesToDynamicsService
      .sendCreditNotesToDynamics(creditNoteIds, this.generalService.getUserID())
      .subscribe({
        next: (response) => {
          this.sending = false;
          const batchId = response?.dynamicsSyncBatchID ?? response?.DynamicsSyncBatchID ?? 0;
          const itemCount = response?.numberofItems ?? response?.NumberofItems ?? creditNoteIds.length;
          this.lastBatchId = batchId;
          this.sendSummary = batchId
            ? `Batch #${batchId} started in background for ${itemCount} credit note(s). Track progress on the DynamicsSyncBatch page.`
            : `Batch started in background for ${itemCount} credit note(s).`;
          this.showNotification('snackbar-success', this.sendSummary, 'bottom', 'center');
          this.selection.clear();
          this.loadData();
        },
        error: (err: unknown) => {
          this.sending = false;
          const message = this.resolveBatchStartErrorMessage(err);
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
        }
      });
  }

  openBatchMonitor(): void {
    const queryParams: { batchId?: number; syncSource: string } = { syncSource: 'creditNote' };
    if (this.lastBatchId > 0) {
      queryParams.batchId = this.lastBatchId;
    }
    this.router.navigate(['/dynamicsSyncBatch'], { queryParams });
  }

  private resolveBatchStartErrorMessage(err: unknown): string {
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
    return 'Failed to start credit note sync batch.';
  }

  private resolveSendErrorMessage(err: unknown, creditNoteNumberWithPrefix?: string): string {
    const friendlyAlreadySynced = this.formatAlreadySyncedMessage(creditNoteNumberWithPrefix);
    if (typeof err === 'string' && err.trim()) {
      if (this.isAlreadySyncedToDynamicsError(err)) {
        return friendlyAlreadySynced;
      }
      return err.trim();
    }
    const httpErr = err as HttpErrorResponse;
    const body = httpErr?.error;
    const bodyParts: string[] = [];
    if (typeof body === 'string' && body.trim()) {
      bodyParts.push(body.trim());
    } else if (body && typeof body === 'object') {
      const record = body as Record<string, unknown>;
      ['message', 'Message', 'result'].forEach((key) => {
        const value = record[key];
        if (typeof value === 'string' && value.trim()) {
          bodyParts.push(value.trim());
        }
      });
      const dynamicsApiResult = record.dynamicsApiResult || record.DynamicsApiResult;
      if (dynamicsApiResult && typeof dynamicsApiResult === 'object') {
        const dynamics = dynamicsApiResult as Record<string, unknown>;
        ['errorMessage', 'ErrorMessage', 'responseBody', 'ResponseBody'].forEach((key) => {
          const value = dynamics[key];
          if (typeof value === 'string' && value.trim()) {
            bodyParts.push(value.trim());
          }
        });
      }
    }
    const combined = bodyParts.join(' ');
    if (combined && this.isAlreadySyncedToDynamicsError(combined)) {
      return friendlyAlreadySynced;
    }
    if (combined) {
      const alreadySyncedPrefix = `${creditNoteNumberWithPrefix || ''}:- The record in table RentNet SalesCR Memo Header already exists.`;
      if (combined.includes(alreadySyncedPrefix)) {
        return combined.includes("It's Already Synced.") ? combined : friendlyAlreadySynced;
      }
      return combined;
    }
    if (httpErr?.message?.trim()) {
      if (this.isAlreadySyncedToDynamicsError(httpErr.message)) {
        return friendlyAlreadySynced;
      }
      return httpErr.message.trim();
    }
    return 'Dynamics API call failed';
  }

  private isAlreadySyncedToDynamicsError(text: string): boolean {
    const normalized = String(text || '').toLowerCase();
    return normalized.includes('already exists')
      && normalized.includes('rentnet salescr memo header');
  }

  private formatAlreadySyncedMessage(creditNoteNumberWithPrefix?: string): string {
    const cn = String(creditNoteNumberWithPrefix || '').trim();
    return `${cn}:- The record in table RentNet SalesCR Memo Header already exists. It's Already Synced.`;
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
      duration: 6000,
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
    if (status === 'active' || status === 'generated' || status === 'successful' || status === 'gst' || status === 'approved') {
      return 'sdd-badge sdd-badge--success';
    }
    if (status === 'void' || status === 'cancelled' || status === 'not created' || status === 'failed') {
      return 'sdd-badge sdd-badge--warning';
    }
    if (status === 'unprocessed' || status === 'nongst') {
      return 'sdd-badge sdd-badge--muted';
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

  getECreditNoteStatusLabel(irnStatus: string): string {
    const status = String(irnStatus || '').trim();
    return status || 'Not Created';
  }

  isRowSelected(row: SendCreditNotesToDynamicsCreditNote): boolean {
    return this.selection.isSelected(row);
  }

  getRecordCount(): number {
    return this.dataSource?.length || 0;
  }

  getSummaryClass(): string {
    const summary = (this.sendSummary || '').toLowerCase();
    if (summary.includes('failed') || summary.includes('0 of')) {
      return 'sdd-summary--warning';
    }
    if (summary.includes('sent successfully')) {
      return 'sdd-summary--success';
    }
    return '';
  }
}
