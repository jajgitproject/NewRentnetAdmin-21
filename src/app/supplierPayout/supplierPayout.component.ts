// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { SupplierDropDown } from '../organizationalEntity/supplierDropDown.model';
import { SupplierPayoutService } from './supplierPayout.service';
import {
  SupplierPayoutDutySlipRow,
  SupplierPayoutGroupSummary,
  SupplierPayoutHistoryRow,
} from './supplierPayout.model';

@Component({
  standalone: false,
  selector: 'app-supplier-payout',
  templateUrl: './supplierPayout.component.html',
  styleUrls: ['./supplierPayout.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class SupplierPayoutComponent implements OnInit {
  activeTab = 0;

  supplierCtrl = new FormControl('');
  supplierList: SupplierDropDown[] = [];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;
  selectedSupplierID = 0;
  selectedSupplierName = '';

  SearchFromDate: Date = moment().utcOffset('+05:30').subtract(90, 'days').toDate();
  SearchToDate: Date = moment().utcOffset('+05:30').toDate();
  includePaid = false;
  paymentStatus = 'UnPaid';

  dutyRows: SupplierPayoutDutySlipRow[] = [];
  selection = new SelectionModel<SupplierPayoutDutySlipRow>(true, []);
  processDisplayedColumns = [
    'select',
    'dutySlipID',
    'gfbStatus',
    'reservationID',
    'customerName',
    'dateOfDuty',
    'payoutEcoRevenue',
    'supplierRevenue',
    'currentEcoRevenue',
    'mismatchAmount',
    'paymentStatus',
  ];

  groupAmount: number | null = null;
  previousGroupAdjustmentAmount = 0;
  previousGroupNumber = '';
  markingPaid = false;
  loadingDuties = false;
  lastSummary: SupplierPayoutGroupSummary | null = null;

  historyRows: SupplierPayoutHistoryRow[] = [];
  historyDisplayedColumns = [
    'groupNumber',
    'groupDate',
    'supplierName',
    'groupAmount',
    'previousGroupAdjustmentAmount',
    'netSettlementAmount',
    'dutyCount',
    'totalMismatchAmount',
    'isSquaredOff',
    'actions',
  ];
  loadingHistory = false;
  selectedHistoryGroup: SupplierPayoutGroupSummary | null = null;
  groupDetailColumns = [
    'dutySlipID',
    'gfbStatus',
    'reservationID',
    'customerName',
    'payoutEcoRevenue',
    'supplierRevenue',
    'currentEcoRevenue',
    'mismatchAmount',
  ];

  private supplierRevenuePreviewCacheKey = '';
  private supplierRevenuePreviewMap = new Map<number, number>();
  private lastGroupAmountBlurConfirmed: number | null = null;

  reportFromDate: Date = moment().utcOffset('+05:30').subtract(30, 'days').toDate();
  reportToDate: Date = moment().utcOffset('+05:30').toDate();
  reportSupplierCtrl = new FormControl('');
  reportSupplierList: SupplierDropDown[] = [];
  filteredReportSupplierOptions: Observable<SupplierDropDown[]>;
  reportSupplierID = 0;
  downloadingReport = false;

  historySupplierCtrl = new FormControl('');
  historySupplierList: SupplierDropDown[] = [];
  filteredHistorySupplierOptions: Observable<SupplierDropDown[]>;
  historySupplierID = 0;
  historyFromDate: Date = moment().utcOffset('+05:30').toDate();
  historyToDate: Date = moment().utcOffset('+05:30').toDate();
  historySearched = false;

  constructor(
    private service: SupplierPayoutService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initSuppliers();
    this.initReportSuppliers();
    this.initHistorySuppliers();
  }

  private initSuppliers(): void {
    this.generalService.GetAllSuppliers().subscribe((data) => {
      this.supplierList = data || [];
      this.filteredSupplierOptions = this.supplierCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterSuppliers(value || ''))
      );
    });
  }

  private initReportSuppliers(): void {
    this.generalService.GetAllSuppliers().subscribe((data) => {
      this.reportSupplierList = data || [];
      this.filteredReportSupplierOptions = this.reportSupplierCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterReportSuppliers(value || ''))
      );
    });
  }

  private initHistorySuppliers(): void {
    this.generalService.GetAllSuppliers().subscribe((data) => {
      this.historySupplierList = data || [];
      this.filteredHistorySupplierOptions = this.historySupplierCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterHistorySuppliers(value || ''))
      );
    });
  }

  private filterHistorySuppliers(value: string): SupplierDropDown[] {
    const filterValue = String(value).toLowerCase();
    if (!filterValue) {
      return [];
    }
    return this.historySupplierList.filter((s) => s.supplierName?.toLowerCase().includes(filterValue));
  }

  private filterSuppliers(value: string): SupplierDropDown[] {
    const filterValue = String(value).toLowerCase();
    if (!filterValue) {
      return [];
    }
    return this.supplierList.filter((s) => s.supplierName?.toLowerCase().includes(filterValue));
  }

  private filterReportSuppliers(value: string): SupplierDropDown[] {
    const filterValue = String(value).toLowerCase();
    if (!filterValue) {
      return [];
    }
    return this.reportSupplierList.filter((s) => s.supplierName?.toLowerCase().includes(filterValue));
  }

  onSupplierSelect(name: string): void {
    const match = this.supplierList.find((s) => s.supplierName === name);
    this.selectedSupplierID = match?.supplierID || 0;
    this.selectedSupplierName = match?.supplierName || '';
    this.selection.clear();
    this.lastSummary = null;
    this.previousGroupAdjustmentAmount = 0;
    this.previousGroupNumber = '';
    this.lastGroupAmountBlurConfirmed = null;
    if (this.selectedSupplierID) {
      this.loadPreviousGroupContext();
    }
  }

  private loadPreviousGroupContext(): void {
    this.service.getPreviousGroupContext(this.selectedSupplierID).subscribe(
      (context) => {
        this.previousGroupAdjustmentAmount = context?.previousGroupAdjustmentAmount || 0;
        this.previousGroupNumber = context?.previousGroupNumber || '';
      },
      () => {
        this.previousGroupAdjustmentAmount = 0;
        this.previousGroupNumber = '';
      }
    );
  }

  onReportSupplierSelect(name: string): void {
    const match = this.reportSupplierList.find((s) => s.supplierName === name);
    this.reportSupplierID = match?.supplierID || 0;
  }

  onHistorySupplierSelect(name: string): void {
    const match = this.historySupplierList.find((s) => s.supplierName === name);
    this.historySupplierID = match?.supplierID || 0;
  }

  formatDate(value: Date | null | undefined): string | null {
    if (!value) {
      return null;
    }
    return moment(value).utcOffset('+05:30').format('YYYY-MM-DD');
  }

  searchDuties(): void {
    if (!this.selectedSupplierID) {
      this.showNotification('Select a supplier first.');
      return;
    }
    this.loadingDuties = true;
    this.selection.clear();
    this.service
      .searchDutySlips({
        supplierID: this.selectedSupplierID,
        includePaid: this.includePaid,
        fromDate: this.formatDate(this.SearchFromDate),
        toDate: this.formatDate(this.SearchToDate),
        paymentStatus: this.paymentStatus,
      })
      .subscribe(
        (rows) => {
          this.loadingDuties = false;
          this.dutyRows = rows || [];
        },
        () => {
          this.loadingDuties = false;
          this.showNotification('Failed to load duty slips.');
        }
      );
  }

  isAllSelected(): boolean {
    const selectable = this.dutyRows.filter((r) => r.selectable);
    return selectable.length > 0 && this.selection.selected.length === selectable.length;
  }

  masterToggle(): void {
    const selectable = this.dutyRows.filter((r) => r.selectable);
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...selectable);
    }
    this.lastGroupAmountBlurConfirmed = null;
  }

  get selectedEcoTotal(): number {
    return this.selection.selected.reduce((sum, row) => sum + (row.payoutEcoRevenue || 0), 0);
  }

  get maxAllowedGroupAmount(): number {
    return Number((this.selectedEcoTotal * 0.8 + (this.previousGroupAdjustmentAmount || 0)).toFixed(2));
  }

  get projectedGroupAmountShortfall(): number {
    if (!this.groupAmount || this.groupAmount <= 0 || !this.selection.hasValue()) {
      return 0;
    }
    const shortfall = Number((this.maxAllowedGroupAmount - Number(this.groupAmount)).toFixed(2));
    return shortfall > 0 ? shortfall : 0;
  }

  onGroupAmountBlur(): void {
    if (this.groupAmount == null || this.groupAmount === '') {
      this.lastGroupAmountBlurConfirmed = null;
      return;
    }
    const amount = Number(this.groupAmount);
    const validation = this.validateGroupAmount(amount);
    if (!validation.valid) {
      this.showNotification(validation.message, 'snackbar-danger');
      this.groupAmount = null;
      this.lastGroupAmountBlurConfirmed = null;
      this.supplierRevenuePreviewCacheKey = '';
      return;
    }
    if (this.lastGroupAmountBlurConfirmed === amount) {
      return;
    }
    const confirmed = window.confirm('Are You Sure. This Amount will become non editable after saving');
    if (!confirmed) {
      this.groupAmount = null;
      this.lastGroupAmountBlurConfirmed = null;
      this.supplierRevenuePreviewCacheKey = '';
      return;
    }
    this.lastGroupAmountBlurConfirmed = amount;
  }

  private validateGroupAmount(amount: number): { valid: boolean; message?: string } {
    if (!amount || amount <= 0) {
      return { valid: false, message: 'Group amount cannot be zero.' };
    }
    const maxAllowed = this.maxAllowedGroupAmount;
    if (amount > maxAllowed) {
      return {
        valid: false,
        message: `Group amount cannot be greater than ${this.formatMoney(maxAllowed)} (80% of total payout eco revenue for selected duties plus previous group adjustment amount).`,
      };
    }
    return { valid: true };
  }

  getSupplierRevenueDisplay(row: SupplierPayoutDutySlipRow): string {
    const value = this.getSupplierRevenueValue(row);
    return value != null ? this.formatMoney(value) : '-';
  }

  getSupplierRevenueValue(row: SupplierPayoutDutySlipRow): number | null {
    if (row.supplierRevenue != null && row.paymentStatus === 'Paid') {
      return row.supplierRevenue;
    }
    const map = this.buildSupplierRevenuePreviewMap();
    if (!map.has(row.dutySlipID)) {
      return null;
    }
    return map.get(row.dutySlipID);
  }

  private buildSupplierRevenuePreviewMap(): Map<number, number> {
    const key = `${this.groupAmount}|${this.selection.selected
      .map((s) => s.dutySlipID)
      .sort((a, b) => a - b)
      .join(',')}`;
    if (key === this.supplierRevenuePreviewCacheKey) {
      return this.supplierRevenuePreviewMap;
    }
    this.supplierRevenuePreviewCacheKey = key;
    this.supplierRevenuePreviewMap = new Map<number, number>();
    if (!this.groupAmount || this.groupAmount <= 0) {
      return this.supplierRevenuePreviewMap;
    }
    const selected = this.selection.selected.filter((r) => r.selectable);
    if (!selected.length) {
      return this.supplierRevenuePreviewMap;
    }
    const totalEco = selected.reduce((sum, row) => sum + (row.payoutEcoRevenue || 0), 0);
    if (totalEco <= 0) {
      return this.supplierRevenuePreviewMap;
    }
    const amounts = this.allocateGroupAmount(this.groupAmount, selected);
    selected.forEach((row, index) => this.supplierRevenuePreviewMap.set(row.dutySlipID, amounts[index]));
    return this.supplierRevenuePreviewMap;
  }

  private allocateGroupAmount(groupAmount: number, rows: { payoutEcoRevenue: number }[]): number[] {
    const sum = rows.reduce((total, row) => total + (row.payoutEcoRevenue || 0), 0);
    if (sum <= 0) {
      return rows.map(() => 0);
    }
    const amounts: number[] = [];
    let allocated = 0;
    for (let i = 0; i < rows.length; i++) {
      if (i === rows.length - 1) {
        amounts.push(Number((groupAmount - allocated).toFixed(2)));
      } else {
        const share = Number(((groupAmount * rows[i].payoutEcoRevenue) / sum).toFixed(2));
        amounts.push(share);
        allocated += share;
      }
    }
    return amounts;
  }

  markAsPaid(): void {
    if (!this.selectedSupplierID) {
      this.showNotification('Select a supplier.');
      return;
    }
    const selected = this.selection.selected.filter((r) => r.selectable);
    if (!selected.length) {
      this.showNotification('Select at least one unpaid duty slip.');
      return;
    }
    const validation = this.validateGroupAmount(Number(this.groupAmount));
    if (!validation.valid) {
      this.showNotification(validation.message, 'snackbar-danger');
      return;
    }
    if (this.selectedEcoTotal <= 0) {
      this.showNotification('Selected duties must have payout eco revenue greater than zero.');
      return;
    }

    const msg =
      `Mark ${selected.length} duty slip(s) as paid?\n` +
      `Group Amount: ${this.groupAmount}\n` +
      `Previous Group Adjustment: ${this.previousGroupAdjustmentAmount || 0}`;
    if (!window.confirm(msg)) {
      return;
    }

    this.markingPaid = true;
    const performedBy = this.generalService.getUserID();
    this.service
      .markPaid(performedBy, {
        supplierID: this.selectedSupplierID,
        groupAmount: this.groupAmount,
        previousGroupAdjustmentAmount: this.previousGroupAdjustmentAmount || 0,
        dutySlipIDs: selected.map((r) => r.dutySlipID),
      })
      .subscribe(
        (summary) => {
          this.markingPaid = false;
          this.lastSummary = summary;
          this.groupAmount = null;
          this.previousGroupAdjustmentAmount = 0;
          this.previousGroupNumber = '';
          this.lastGroupAmountBlurConfirmed = null;
          this.selection.clear();
          this.showNotification(`Payout group ${summary.groupNumber} created.`, 'snackbar-success');
          this.searchDuties();
        },
        (err) => {
          this.markingPaid = false;
          const message = err?.error?.message || 'Failed to mark as paid.';
          this.showNotification(message, 'snackbar-danger');
        }
      );
  }

  searchHistory(): void {
    this.loadingHistory = true;
    this.historyRows = [];
    this.selectedHistoryGroup = null;
    this.historySearched = true;
    this.service
      .searchHistory({
        supplierID: this.historySupplierID || null,
        fromDate: this.formatDate(this.historyFromDate),
        toDate: this.formatDate(this.historyToDate),
      })
      .subscribe(
        (rows) => {
          this.loadingHistory = false;
          this.historyRows = rows || [];
        },
        () => {
          this.loadingHistory = false;
          this.showNotification('Failed to load history.');
        }
      );
  }

  viewGroup(row: SupplierPayoutHistoryRow): void {
    this.service.getGroup(row.supplierPayoutGroupID).subscribe(
      (group) => {
        this.selectedHistoryGroup = group;
      },
      () => this.showNotification('Failed to load group details.')
    );
  }

  printGroup(row: SupplierPayoutHistoryRow): void {
    this.service.printGroup(row.supplierPayoutGroupID).subscribe(
      (html) => {
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(html);
          win.document.close();
          win.focus();
          win.print();
        }
      },
      () => this.showNotification('Failed to open print view.')
    );
  }

  exportGroup(row: SupplierPayoutHistoryRow): void {
    this.service.exportGroup(row.supplierPayoutGroupID).subscribe(
      (blob) => this.triggerBlobDownload(blob, `SupplierPayout_${row.groupNumber}.csv`),
      () => this.showNotification('Failed to export group.')
    );
  }

  downloadReport(): void {
    this.downloadingReport = true;
    this.service
      .downloadReport({
        supplierID: this.reportSupplierID || null,
        fromDate: this.formatDate(this.reportFromDate),
        toDate: this.formatDate(this.reportToDate),
      })
      .subscribe(
        (blob) => {
          this.downloadingReport = false;
          if (!blob || blob.size === 0) {
            this.showNotification('No report data for selected filters.');
            return;
          }
          const timeStamp = moment().format('YYYYMMDD_HHmmss');
          this.triggerBlobDownload(blob, `SupplierPayoutReport_${timeStamp}.csv`);
        },
        () => {
          this.downloadingReport = false;
          this.showNotification('Failed to download report.');
        }
      );
  }

  onTabChange(index: number): void {
    this.activeTab = index;
  }

  formatDisplayDate(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return moment(value).utcOffset('+05:30').format('DD-MMM-YYYY');
  }

  formatGfbStatus(value: boolean | null | undefined): string {
    return value ? 'Yes' : 'No';
  }

  formatMoney(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toFixed(2);
  }

  private triggerBlobDownload(blob: Blob, fileName: string): void {
    const fileUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(fileUrl);
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
