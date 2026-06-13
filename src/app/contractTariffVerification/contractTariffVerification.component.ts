// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { GeneralService } from '../general/general.service';
import { ContractTariffVerificationService } from './contractTariffVerification.service';
import {
  buildDisplayedColumns,
  ColumnDef,
  DutyTypeTableConfig,
  getConfigForPackageType,
} from './contract-tariff-column.config';
import { VerificationHistoryDialogComponent } from './dialogs/verification-history-dialog/verification-history-dialog.component';
import { RateRowDetailsDialogComponent } from './dialogs/rate-row-details-dialog/rate-row-details-dialog.component';
import {
  formatVerificationStatusDisplay,
  isPendingVerificationStatus,
  isRejectedStatus,
  isVerifiedStatus,
  normalizeStatusValue,
} from './contract-tariff-status.util';

@Component({
  standalone: false,
  selector: 'app-contract-tariff-verification',
  templateUrl: './contractTariffVerification.component.html',
  styleUrls: ['./contractTariffVerification.component.scss'],
})
export class ContractTariffVerificationComponent implements OnInit {
  contractControl = new FormControl('');
  contractOptions: any[] = [];
  filteredContracts: Observable<any[]>;
  selectedContractId: number | null = null;

  dutyTypes: any[] = [];
  selectedPackageTypeId: number | null = null;
  selectedPackageTypeName = '';
  /** Duty type label frozen when Search is clicked (used in section headers). */
  searchedDutyTypeName = '';
  dutyConfig: DutyTypeTableConfig | null = null;

  fixedDataSource = new MatTableDataSource<any>([]);
  rateDataSource = new MatTableDataSource<any>([]);
  fixedSelection = new SelectionModel<any>(true, []);
  rateSelection = new SelectionModel<any>(true, []);

  fixedDisplayedColumns: string[] = [];
  rateDisplayedColumns: string[] = [];
  fixedDynamicColumns: ColumnDef[] = [];
  rateDynamicColumns: ColumnDef[] = [];

  role = '';
  isAuditor = false;
  isVerifier = false;
  loading = false;
  hasSearched = false;

  cityTiers: { customerContractCityTiersID: number; customerContractCityTier: string }[] = [];
  selectedCityTierId: number | null = null;
  selectedAuditorStatusFilter = '';
  selectedVerifierStatusFilter = '';
  readonly statusFilterOptions = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
  ];
  private allFixedRows: any[] = [];
  private allRateRows: any[] = [];

  constructor(
    public service: ContractTariffVerificationService,
    public generalService: GeneralService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  private swalFire(options: any) {
    return Swal.fire({ scrollbarPadding: false, ...options });
  }

  private showNotification(colorName: string, text: string, placementFrom: string, placementAlign: string) {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  private restorePageLayoutAfterDialog(): void {
    document.body.classList.remove('cdk-global-scrollblock');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('position');
  }

  private onFullscreenDialogClosed(result?: { refresh?: boolean; success?: boolean; action?: string }): void {
    setTimeout(() => this.restorePageLayoutAfterDialog(), 0);
    if (result?.refresh) {
      this.search();
    }
    if (result?.success) {
      this.showNotification(
        'snackbar-success',
        `${result.action || 'Action'} completed.`,
        'bottom',
        'center'
      );
    }
  }

  ngOnInit() {
    this.role = (localStorage.getItem('role') || '').trim();
    this.isAuditor = this.generalService.canActAsContractTariffAuditor();
    this.isVerifier = this.generalService.canActAsContractTariffVerifier();
    this.loadContracts('');
    this.filteredContracts = this.contractControl.valueChanges.pipe(
      startWith(''),
      map((v) => this.filterContracts(typeof v === 'string' ? v : v?.compositeLabel || ''))
    );
  }

  loadContracts(searchText: string) {
    this.service.getContractsForAutocomplete(searchText).subscribe((data) => {
      this.contractOptions = data || [];
    });
  }

  filterContracts(value: string): any[] {
    const filter = (value || '').toLowerCase();
    return this.contractOptions.filter(
      (o) =>
        (o.compositeLabel || '').toLowerCase().includes(filter) ||
        (o.compositeKey || '').toLowerCase().includes(filter)
    );
  }

  displayContractFn(item: any): string {
    return item && item.compositeLabel ? item.compositeLabel : item || '';
  }

  onContractSelected(item: any) {
    const contractId = item?.customerContractID ?? item?.CustomerContractID;
    if (!item || !contractId) return;
    this.selectedContractId = contractId;
    this.contractControl.setValue(item);
    this.selectedPackageTypeId = null;
    this.dutyTypes = [];
    this.cityTiers = [];
    this.selectedCityTierId = null;
    this.clearGrids();
    this.loadCityTiersForContract(contractId);
    this.service.getDutyTypes(contractId).subscribe((types) => {
      const normalized = (types || []).map((t: any) => ({
        packageTypeID: t.packageTypeID ?? t.PackageTypeID,
        packageType: t.packageType ?? t.PackageType,
      }));
      this.dutyTypes = normalized;
    });
  }

  onContractInputFocus() {
    this.loadContracts(this.contractControl.value?.compositeLabel || this.contractControl.value || '');
  }

  onDutyTypeChange() {
    const pt = this.dutyTypes.find((d) => d.packageTypeID === this.selectedPackageTypeId);
    this.selectedPackageTypeName = pt ? pt.packageType : '';
    this.dutyConfig = getConfigForPackageType(this.selectedPackageTypeName);
    this.clearGrids();
  }

  clearGrids() {
    this.hasSearched = false;
    this.searchedDutyTypeName = '';
    this.allFixedRows = [];
    this.allRateRows = [];
    this.fixedDataSource.data = [];
    this.rateDataSource.data = [];
    this.fixedSelection.clear();
    this.rateSelection.clear();
    if (this.dutyConfig?.fixedColumns) {
      this.fixedDynamicColumns = this.dutyConfig.fixedColumns;
      this.fixedDisplayedColumns = buildDisplayedColumns(this.fixedDynamicColumns);
    } else {
      this.fixedDynamicColumns = [];
      this.fixedDisplayedColumns = [];
    }
    if (this.dutyConfig) {
      this.rateDynamicColumns = this.dutyConfig.rateColumns;
      this.rateDisplayedColumns = buildDisplayedColumns(this.rateDynamicColumns);
    } else {
      this.rateDynamicColumns = [];
      this.rateDisplayedColumns = [];
    }
  }

  loadCityTiersForContract(contractId: number) {
    this.generalService.GetCCCityTiersForCD(contractId).subscribe((data) => {
      this.cityTiers = (data || []).map((t: any) => ({
        customerContractCityTiersID: t.customerContractCityTiersID ?? t.CustomerContractCityTiersID,
        customerContractCityTier: t.customerContractCityTier ?? t.CustomerContractCityTier ?? '',
      }));
    });
  }

  onFilterChange() {
    if (this.hasSearched) {
      this.applyGridFilters();
    }
  }

  clearFilters() {
    this.contractControl.setValue('');
    this.selectedContractId = null;
    this.selectedPackageTypeId = null;
    this.selectedPackageTypeName = '';
    this.searchedDutyTypeName = '';
    this.dutyTypes = [];
    this.cityTiers = [];
    this.selectedCityTierId = null;
    this.selectedAuditorStatusFilter = '';
    this.selectedVerifierStatusFilter = '';
    this.allFixedRows = [];
    this.allRateRows = [];
    this.dutyConfig = null;
    this.fixedDynamicColumns = [];
    this.rateDynamicColumns = [];
    this.fixedDisplayedColumns = [];
    this.rateDisplayedColumns = [];
    this.clearGrids();
    this.loadContracts('');
  }

  search() {
    if (!this.selectedContractId || !this.selectedPackageTypeId) {
      this.swalFire({ title: 'Validation', text: 'Please select Customer Contract and Duty Type.', icon: 'warning' });
      return;
    }
    const pt = this.dutyTypes.find((d) => d.packageTypeID === this.selectedPackageTypeId);
    this.searchedDutyTypeName = pt ? pt.packageType : this.selectedPackageTypeName || '';

    this.loading = true;
    this.service.search(this.selectedContractId, this.selectedPackageTypeId, this.role).subscribe(
      (res) => {
        let payload = res;
        if (typeof payload === 'string') {
          try {
            payload = JSON.parse(payload);
          } catch {
            payload = {};
          }
        }
        const fixedRows = this.toArray(payload?.fixedDetailsRows ?? payload?.FixedDetailsRows);
        const rateRows = this.toArray(payload?.rateRows ?? payload?.RateRows);
        this.allFixedRows = fixedRows.map((r: any) => this.normalizeRow(r));
        this.allRateRows = rateRows.map((r: any) => this.normalizeRow(r));
        this.applyGridFilters();
        this.fixedSelection.clear();
        this.rateSelection.clear();
        this.hasSearched = true;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.swalFire({
          title: 'Error',
          text: err?.error?.message || 'Search failed. Ensure database migration has been run.',
          icon: 'error',
        });
      }
    );
  }

  applyGridFilters() {
    const fixedFiltered = this.allFixedRows.filter((row) => this.rowMatchesFilters(row, false));
    const rateFiltered = this.allRateRows.filter((row) => this.rowMatchesFilters(row, true));
    this.fixedDataSource.data = fixedFiltered;
    this.rateDataSource.data = rateFiltered;
  }

  rowMatchesFilters(row: any, includeCityTier: boolean): boolean {
    if (includeCityTier && this.selectedCityTierId != null) {
      const tierId = row.customerContractCityTiersID ?? row.CustomerContractCityTiersID;
      if (tierId == null || Number(tierId) !== Number(this.selectedCityTierId)) {
        return false;
      }
    }
    if (!this.rowMatchesStatusFilter(row.auditorVerificationStatus, this.selectedAuditorStatusFilter)) {
      return false;
    }
    if (!this.rowMatchesStatusFilter(row.verifierVerificationStatus, this.selectedVerifierStatusFilter)) {
      return false;
    }
    return true;
  }

  rowMatchesStatusFilter(status: any, filter: string): boolean {
    if (!filter) return true;
    if (filter === 'pending') return isPendingVerificationStatus(status);
    if (filter === 'verified') return isVerifiedStatus(status);
    if (filter === 'rejected') return isRejectedStatus(status);
    return true;
  }

  rowKey(row: any): string {
    const table = row?.rateTableName || '';
    const pkg = row?.packageID ?? row?.PackageID;
    const cat = row?.customerContractCarCategoryID ?? row?.CustomerContractCarCategoryID;
    const tier = row?.customerContractCityTiersID ?? row?.CustomerContractCityTiersID;
    const city = row?.cityID ?? row?.CityID;
    if (pkg != null && cat != null) {
      if (tier != null) return `${table}|P${pkg}|T${tier}|C${cat}`;
      if (city != null) return `${table}|P${pkg}|City${city}|C${cat}`;
    }
    return `${table}|R${row?.rateRowID ?? ''}`;
  }

  isRowSelected(selection: SelectionModel<any>, row: any): boolean {
    const key = this.rowKey(row);
    return selection.selected.some((r) => this.rowKey(r) === key);
  }

  toggleRow(selection: SelectionModel<any>, row: any) {
    const key = this.rowKey(row);
    const existing = selection.selected.find((r) => this.rowKey(r) === key);
    if (existing) {
      selection.deselect(existing);
    } else {
      selection.select(row);
    }
  }

  isAllSelected(selection: SelectionModel<any>, dataSource: MatTableDataSource<any>): boolean {
    const rows = this.dedupeRows(dataSource.data);
    if (rows.length === 0) return false;
    return rows.every((row) => this.isRowSelected(selection, row));
  }

  masterToggle(selection: SelectionModel<any>, dataSource: MatTableDataSource<any>) {
    const rows = this.dedupeRows(dataSource.data);
    if (this.isAllSelected(selection, dataSource)) {
      selection.clear();
    } else {
      rows.forEach((row) => {
        if (!this.isRowSelected(selection, row)) {
          selection.select(row);
        }
      });
    }
  }

  getStatusForRole(row: any): string | null {
    const raw = this.isAuditor
      ? row.auditorVerificationStatus ?? row.AuditorVerificationStatus
      : row.verifierVerificationStatus ?? row.VerifierVerificationStatus;
    return normalizeStatusValue(raw);
  }

  canVerify(row: any): boolean {
    const s = this.getStatusForRole(row);
    return (
      (this.isAuditor || this.isVerifier) &&
      (isPendingVerificationStatus(s) || isRejectedStatus(s))
    );
  }

  canReject(row: any): boolean {
    const s = this.getStatusForRole(row);
    return (
      (this.isAuditor || this.isVerifier) &&
      (isPendingVerificationStatus(s) || isVerifiedStatus(s))
    );
  }

  formatStatus(status: any): string {
    return formatVerificationStatusDisplay(status);
  }

  getSelectedItems(): any[] {
    return this.dedupeRows([
      ...this.fixedSelection.selected,
      ...this.rateSelection.selected,
    ]);
  }

  bulkVerify() {
    this.applyBulk('Verify');
  }

  bulkReject() {
    this.applyBulk('Reject');
  }

  applyBulk(action: string) {
    const selected = this.getSelectedItems();
    if (selected.length === 0) {
      this.swalFire({ title: 'Validation', text: 'Please select at least one row.', icon: 'warning' });
      return;
    }
    if (!this.isAuditor && !this.isVerifier) {
      this.swalFire({ title: 'Access', text: 'Your role cannot perform verification actions.', icon: 'error' });
      return;
    }

    const eligible = selected.filter((r) =>
      action === 'Verify' ? this.canVerify(r) : this.canReject(r)
    );
    const skippedCount = selected.length - eligible.length;

    if (eligible.length === 0) {
      const track = this.isAuditor ? 'auditor' : 'verifier';
      const verb = action === 'Verify' ? 'verify' : 'reject';
      const reasons = selected
        .slice(0, 5)
        .map((r, i) => {
          const display = formatVerificationStatusDisplay(this.getStatusForRole(r));
          return `Row ${i + 1}: ${track} status is "${display}"`;
        })
        .join('<br>');
      this.swalFire({
        title: 'No eligible rows',
        html:
          `None of the selected rows can be ${verb}ed on your ${track} track.<br><br>` +
          (action === 'Verify'
            ? 'Verify is allowed only when status is empty/blank or Rejected.'
            : 'Reject is allowed only when status is empty/blank or Verified.') +
          (reasons ? `<br><br>${reasons}` : ''),
        icon: 'info',
      });
      return;
    }

    const isVerify = action === 'Verify';
    const title = isVerify ? 'Confirm verification' : 'Confirm rejection';
    const confirmText = isVerify ? 'Yes, verify' : 'Yes, reject';
    let message =
      `You are about to ${isVerify ? 'verify' : 'reject'} <strong>${eligible.length}</strong> selected row(s)` +
      ` for your ${this.isAuditor ? 'auditor' : 'verifier'} track.`;
    if (skippedCount > 0) {
      message +=
        `<br><br><span style="color:#757575">${skippedCount} other selected row(s) are not eligible and will be skipped.</span>`;
    }
    this.swalFire({
      title,
      html: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.executeBulk(action, eligible, '');
    });
  }

  private executeBulk(action: string, rows: any[], remarks: string) {
    const uniqueRows = this.dedupeRows(rows);
    const body = {
      customerContractID: this.selectedContractId,
      packageTypeID: this.selectedPackageTypeId,
      roleName: this.role,
      roleTrack: this.generalService.getContractTariffRoleTrack(),
      roleID: this.generalService.getRoleID(),
      remarks: remarks || '',
      userID: this.generalService.getUserID(),
      items: uniqueRows.map((r) => ({
        rateTableName: r.rateTableName,
        rateRowID: Number(r.rateRowID),
      })),
    };

    const call = action === 'Verify' ? this.service.verify(body) : this.service.reject(body);
    call.subscribe(
      (res) => {
        if (res?.result === 'Success') {
          this.swalFire({
            title: 'Success',
            text: action + ' completed for ' + res.successCount + ' row(s).',
            icon: 'success',
          });
          this.search();
        } else if (res?.result === 'PartialSuccess') {
          this.swalFire({
            title: 'Partial',
            text: res.errors?.join('\n') || 'Some rows failed.',
            icon: 'warning',
          });
          this.search();
        } else {
          this.swalFire({
            title: 'Failed',
            text: res?.errors?.join('\n') || 'Action failed.',
            icon: 'error',
          });
        }
      },
      (err) =>
        this.swalFire({
          title: 'Error',
          text: err?.error?.errors?.join('\n') || 'Request failed.',
          icon: 'error',
        })
    );
  }

  private fullScreenDialogConfig() {
    return {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      panelClass: 'contract-tariff-fullscreen-dialog',
      autoFocus: false,
      restoreFocus: true,
    };
  }

  openHistory(row: any, event?: Event) {
    event?.stopPropagation();
    const ref = this.dialog.open(VerificationHistoryDialogComponent, {
      ...this.fullScreenDialogConfig(),
      data: {
        rateTableName: row.rateTableName,
        rateRowID: row.rateRowID,
        title: row.rateTableName + ' #' + row.rateRowID,
      },
    });
    ref.afterClosed().subscribe(() => this.onFullscreenDialogClosed());
  }

  openRowDetails(row: any, isFixedSection: boolean) {
    if (!row?.rateTableName || !row?.rateRowID) {
      return;
    }
    const sectionTitle = isFixedSection
      ? `Fixed Rates [${this.searchedDutyTypeName}]`
      : `Variable Rates [${this.searchedDutyTypeName}]`;
    const ref = this.dialog.open(RateRowDetailsDialogComponent, {
      ...this.fullScreenDialogConfig(),
      data: {
        sectionTitle,
        rateTableName: row.rateTableName,
        rateRowID: row.rateRowID,
        row,
        customerContractID: this.selectedContractId,
        packageTypeID: this.selectedPackageTypeId,
        roleName: this.role,
        roleTrack: this.generalService.getContractTariffRoleTrack(),
        roleID: this.generalService.getRoleID(),
        isAuditor: this.isAuditor,
        isVerifier: this.isVerifier,
      },
    });
    ref.afterClosed().subscribe((result) => this.onFullscreenDialogClosed(result));
  }

  getCellValue(row: any, field: string): any {
    return row[field];
  }

  private normalizeRow(r: any): any {
    if (!r) return r;
    return {
      ...r,
      rateRowID: r.rateRowID ?? r.RateRowID,
      rateTableName: r.rateTableName ?? r.RateTableName,
      packageID: r.packageID ?? r.PackageID,
      customerContractCityTiersID: r.customerContractCityTiersID ?? r.CustomerContractCityTiersID,
      customerContractCarCategoryID: r.customerContractCarCategoryID ?? r.CustomerContractCarCategoryID,
      cityID: r.cityID ?? r.CityID,
      auditorVerificationStatus: normalizeStatusValue(
        r.auditorVerificationStatus ?? r.AuditorVerificationStatus
      ),
      verifierVerificationStatus: normalizeStatusValue(
        r.verifierVerificationStatus ?? r.VerifierVerificationStatus
      ),
      remarks: r.remarks ?? r.Remarks,
      updatedBy: r.updatedBy ?? r.UpdatedBy,
      updatedDate: r.updatedDate ?? r.UpdatedDate,
      package: r.package ?? r.Package,
      customerContractCityTier: r.customerContractCityTier ?? r.CustomerContractCityTier,
      citiesInTier: r.citiesInTier ?? r.CitiesInTier,
      city: r.city ?? r.City,
      customerContractCarCategory: r.customerContractCarCategory ?? r.CustomerContractCarCategory,
      car: r.car ?? r.Car,
      billFromTo: r.billFromTo ?? r.BillFromTo,
      minimumHours: r.minimumHours ?? r.MinimumHours,
      minimumKM: r.minimumKM ?? r.MinimumKM,
      baseRate: r.baseRate ?? r.BaseRate,
      extraKMRate: r.extraKMRate ?? r.ExtraKMRate,
      extraHRRate: r.extraHRRate ?? r.ExtraHRRate,
      nightCharge: r.nightCharge ?? r.NightCharge,
      driverAllowance: r.driverAllowance ?? r.DriverAllowance,
      fgr: r.fgr ?? r.FGR,
      fgrCharges: r.fgrCharges ?? r.FGRCharges,
      monthlyHours: r.monthlyHours ?? r.MonthlyHours,
      monthlyKMs: r.monthlyKMs ?? r.MonthlyKMs,
      totalDaysBaseRate: r.totalDaysBaseRate ?? r.TotalDaysBaseRate,
      ratePerDay: r.ratePerDay ?? r.RatePerDay,
      minimumKmsPerDay: r.minimumKmsPerDay ?? r.MinimumKmsPerDay,
      nextDayCharging: r.nextDayCharging ?? r.NextDayCharging,
      additionalKM: r.additionalKM ?? r.AdditionalKM,
      packageRate: r.packageRate ?? r.PackageRate,
      additionalMinutes: r.additionalMinutes ?? r.AdditionalMinutes,
      packageGraceKms: r.packageGraceKms ?? r.PackageGraceKms,
      packageGraceMinutes: r.packageGraceMinutes ?? r.PackageGraceMinutes,
      packageJumpCriteria: r.packageJumpCriteria ?? r.PackageJumpCriteria,
      nextPackageSelectionCriteria:
        r.nextPackageSelectionCriteria ?? r.NextPackageSelectionCriteria,
      addtionalKms: r.addtionalKms ?? r.AddtionalKms,
      addtionalMinutes: r.addtionalMinutes ?? r.AddtionalMinutes,
      showAddtionKMAndHours: r.showAddtionKMAndHours ?? r.ShowAddtionKMAndHours,
    };
  }

  private toArray(value: any): any[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.$values)) return value.$values;
    return [];
  }

  /** Dedupe bulk selection by rate table + rate row ID. */
  private dedupeRows(rows: any[]): any[] {
    const seen = new Set<string>();
    const out: any[] = [];
    for (const row of rows || []) {
      const key = `${row?.rateTableName || ''}|R${row?.rateRowID ?? ''}`;
      if (!key || key === '|R' || seen.has(key)) continue;
      seen.add(key);
      out.push(row);
    }
    return out;
  }

  trackByRateRow(_index: number, row: any): string {
    return `${row?.rateTableName || ''}|R${row?.rateRowID ?? ''}`;
  }

  statusClass(status: string): string {
    if (isVerifiedStatus(status)) return 'status-verified';
    if (isRejectedStatus(status)) return 'status-rejected';
    return 'status-pending';
  }
}
