// @ts-nocheck

import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

import moment from 'moment';

import { Observable, of } from 'rxjs';

import { map, startWith } from 'rxjs/operators';

import { TableExportUtil } from '@shared';

import { GeneralService } from '../general/general.service';

import { EmployeeDropDown } from '../employee/employeeDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';

import { EmployeeLoginHoursMISService } from './employeeLoginHoursMIS.service';



@Component({

  standalone: false,

  selector: 'app-employee-login-hours-mis',

  templateUrl: './employeeLoginHoursMIS.component.html',

  styleUrls: ['./employeeLoginHoursMIS.component.sass'],

})

export class EmployeeLoginHoursMISComponent implements OnInit {

  activeTab: 'summary' | 'sessions' | 'daily' = 'summary';

  groupBy = 'day';

  selectedEmployeeId: number | null = null;
  selectedLocationId: number | null = null;

  pageNumber = 0;

  loading = false;

  exporting = false;

  loadError = '';

  hasSearched = false;

  readonly hotRetentionDays = 90;

  fromDateCtrl = new FormControl(this.todayIst());

  toDateCtrl = new FormControl(this.todayIst());

  employeeNameCtrl = new FormControl('');

  employeeMobileCtrl = new FormControl('');
  employeeLocationCtrl = new FormControl('');
  loginStatusFilter = 'all';

  employeeList: EmployeeDropDown[] = [];
  locationList: OrganizationalEntityDropDown[] = [];
  filteredNameOptions: Observable<EmployeeDropDown[]> = of([]);
  filteredMobileOptions: Observable<EmployeeDropDown[]> = of([]);
  filteredLocationOptions: Observable<OrganizationalEntityDropDown[]> = of([]);



  summaryRows: any[] = [];

  sessionRows: any[] = [];

  dailyRows: any[] = [];



  summaryColumns = ['employeeName', 'employeeLocation', 'periodKey', 'sessionCount', 'grossMinutes', 'inactivityMinutesDeducted', 'netMinutes', 'netHours', 'status'];
  sessionColumns = ['employeeName', 'employeeLocation', 'loginAt', 'actualEndAt', 'recordedEndAt', 'grossDurationMinutes', 'inactivityMinutesDeducted', 'durationMinutes', 'sessionEndReason', 'status'];
  dailyColumns = ['employeeName', 'employeeLocation', 'workDateIST', 'sessionCount', 'grossMinutes', 'inactivityMinutesDeducted', 'netMinutes', 'netHours', 'status'];



  constructor(

    private service: EmployeeLoginHoursMISService,

    private snackBar: MatSnackBar,

    private generalService: GeneralService,

  ) {}



  ngOnInit(): void {
    this.loadEmployees();
    this.loadLocations();
  }



  get hasData(): boolean {

    if (this.activeTab === 'summary') return this.summaryRows.length > 0;

    if (this.activeTab === 'daily') return this.dailyRows.length > 0;

    return this.sessionRows.length > 0;

  }



  get includesArchivedData(): boolean {

    const from = this.fromDateCtrl.value;

    if (!from) return false;

    const hotCutoff = moment().utcOffset('+05:30').startOf('day').subtract(this.hotRetentionDays, 'days');

    return moment(from).utcOffset('+05:30').startOf('day').isBefore(hotCutoff);

  }



  get archiveHint(): string {

    if (!this.includesArchivedData) return '';

    const cutoff = moment().utcOffset('+05:30').startOf('day').subtract(this.hotRetentionDays, 'days').format('DD-MMM-YYYY');

    return `Includes archived data prior to ${cutoff} (IST).`;

  }



  setTab(tab: 'summary' | 'sessions' | 'daily'): void {
    this.activeTab = tab;
    this.pageNumber = 0;
  }



  refresh(): void {
    this.selectedEmployeeId = null;
    this.selectedLocationId = null;
    this.employeeNameCtrl.setValue('');
    this.employeeMobileCtrl.setValue('');
    this.employeeLocationCtrl.setValue('');
    this.loginStatusFilter = 'all';
    this.groupBy = 'day';
    this.pageNumber = 0;
    this.hasSearched = false;
    this.loadError = '';
    this.fromDateCtrl.setValue(this.todayIst());
    this.toDateCtrl.setValue(this.todayIst());
    this.summaryRows = [];
    this.sessionRows = [];
    this.dailyRows = [];
  }



  search(): void {
    this.pageNumber = 0;
    this.hasSearched = true;
    this.loadData();
  }

  private todayIst(): Date {
    return moment().utcOffset('+05:30').startOf('day').toDate();
  }



  exportExcel(): void {
    const fromDate = this.fromDateCtrl.value;
    const toDate = this.toDateCtrl.value;
    if (!fromDate || !toDate) {
      this.snackBar.open('From Date and To Date are required for export.', 'Close', { duration: 4000 });
      return;
    }

    const currentRows = this.getCurrentTabRows();
    if (currentRows.length > 0) {
      this.runExport(currentRows, fromDate, toDate);
      return;
    }

    this.exporting = true;
    const filters = this.getSearchFilters();

    const finish = (rows: any[]) => {
      this.exporting = false;
      if (!rows?.length) {
        this.snackBar.open('No data to export.', 'Close', { duration: 4000 });
        return;
      }
      this.runExport(this.normalizeRows(rows), fromDate, toDate);
    };

    const onError = (err: any) => {
      this.exporting = false;
      this.snackBar.open(this.extractErrorMessage(err), 'Close', { duration: 5000 });
    };

    if (this.activeTab === 'summary') {
      this.service.getSummary(filters.employeeId, fromDate, toDate, this.groupBy, 0, filters.employeeName, filters.employeeMobile, filters.locationId, filters.locationName, filters.loginStatus, true)
        .subscribe((rows) => finish(rows), onError);
      return;
    }
    if (this.activeTab === 'daily') {
      this.service.getDaily(filters.employeeId, fromDate, toDate, 0, filters.employeeName, filters.employeeMobile, filters.locationId, filters.locationName, filters.loginStatus, true)
        .subscribe((rows) => finish(rows), onError);
      return;
    }
    this.service.getSessions(filters.employeeId, fromDate, toDate, 0, filters.employeeName, filters.employeeMobile, filters.locationId, filters.locationName, filters.loginStatus, true)
      .subscribe((rows) => finish(rows), onError);
  }

  private getCurrentTabRows(): any[] {
    if (this.activeTab === 'summary') return this.summaryRows || [];
    if (this.activeTab === 'daily') return this.dailyRows || [];
    return this.sessionRows || [];
  }

  private runExport(rows: any[], fromDate: any, toDate: any): void {
    const fromLabel = moment(fromDate).utcOffset('+05:30').format('YYYY-MM-DD');
    const toLabel = moment(toDate).utcOffset('+05:30').format('YYYY-MM-DD');
    const tabLabel = this.activeTab === 'summary' ? 'Summary' : this.activeTab === 'daily' ? 'Daily' : 'Sessions';
    const exportRows = this.mapExportRows(rows);
    if (!exportRows.length) {
      this.snackBar.open('No data to export.', 'Close', { duration: 4000 });
      return;
    }
    try {
      TableExportUtil.exportToExcel(exportRows, `EmployeeLoginMIS_${tabLabel}_${fromLabel}_${toLabel}`);
      this.snackBar.open(`Exported ${exportRows.length} row(s).`, 'Close', { duration: 3000 });
    } catch (err) {
      this.snackBar.open('Excel export failed. Please try again.', 'Close', { duration: 5000 });
    }
  }



  private mapExportRows(rows: any[]): any[] {

    if (this.activeTab === 'summary') {

      return rows.map((row) => ({

        Employee: row.EmployeeName || row.employeeName,

        Location: row.EmployeeLocation || row.employeeLocation || '',

        'Period (IST)': row.PeriodKey || row.periodKey,

        Sessions: row.SessionCount ?? row.sessionCount,

        'Gross Min': row.GrossMinutes ?? row.grossMinutes,

        'Inactive Deducted': row.InactivityMinutesDeducted ?? row.inactivityMinutesDeducted ?? '',

        'Net Min': row.NetMinutes ?? row.netMinutes,

        'Net Hours': row.NetHours ?? row.netHours,

        Status: this.formatStatus(row),

      }));

    }

    if (this.activeTab === 'daily') {

      return rows.map((row) => ({

        Employee: row.EmployeeName || row.employeeName,

        Location: row.EmployeeLocation || row.employeeLocation || '',

        'Work Date (IST)': this.formatWorkDate(row.WorkDateIST || row.workDateIST),

        Sessions: row.SessionCount ?? row.sessionCount,

        'Gross Min': row.GrossMinutes ?? row.grossMinutes,

        'Inactive Deducted': row.InactivityMinutesDeducted ?? row.inactivityMinutesDeducted ?? '',

        'Net Min': row.NetMinutes ?? row.netMinutes,

        'Net Hours': row.NetHours ?? row.netHours,

        Status: this.formatStatus(row),

      }));

    }

    return rows.map((row) => ({

      Employee: row.EmployeeName || row.employeeName,

      Location: row.EmployeeLocation || row.employeeLocation || '',

      'Login (IST)': this.formatDate(row.LoginAt || row.loginAt),

      'Actual End (IST)': (row.ActualLogoutAt || row.actualLogoutAt) ? this.formatDate(row.ActualLogoutAt || row.actualLogoutAt) : '—',

      'Recorded End (IST)': this.formatRecordedEnd(row),

      'Gross Min': row.GrossDurationMinutes ?? row.grossDurationMinutes ?? '',

      'Inactive Deducted': row.InactivityMinutesDeducted ?? row.inactivityMinutesDeducted ?? '',

      'Net Min': row.DurationMinutes ?? row.durationMinutes ?? '',

      Reason: this.formatSessionReason(row),

      Status: this.formatStatus(row),

    }));

  }



  loadEmployees(): void {

    this.generalService.GetEmployee().subscribe({

      next: (data) => {

        this.employeeList = data || [];

        this.filteredNameOptions = this.employeeNameCtrl.valueChanges.pipe(

          startWith(''),

          map((value) => this.filterByName(value || '')),

        );

        this.filteredMobileOptions = this.employeeMobileCtrl.valueChanges.pipe(

          startWith(''),

          map((value) => this.filterByMobile(value || '')),

        );

      },

      error: () => {

        this.employeeList = [];

        this.filteredNameOptions = of([]);

        this.filteredMobileOptions = of([]);

      },

    });

  }



  loadLocations(): void {
    this.generalService.GetLocation().subscribe({
      next: (data) => {
        this.locationList = data || [];
        this.filteredLocationOptions = this.employeeLocationCtrl.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterByLocation(value || '')),
        );
      },
      error: () => {
        this.locationList = [];
        this.filteredLocationOptions = of([]);
      },
    });
  }



  onLocationSelected(location: OrganizationalEntityDropDown): void {
    if (!location) return;
    this.selectedLocationId = this.getLocationId(location);
    this.employeeLocationCtrl.setValue(this.getLocationName(location), { emitEvent: false });
  }



  onLocationInput(): void {
    this.selectedLocationId = null;
  }



  getLocationName(location: any): string {
    return location?.organizationalEntityName ?? location?.OrganizationalEntityName ?? '';
  }



  getLocationId(location: any): number {
    return location?.organizationalEntityID ?? location?.OrganizationalEntityID ?? null;
  }



  private filterByLocation(value: string): OrganizationalEntityDropDown[] {
    const filterValue = String(value || '').toLowerCase().trim();
    if (!filterValue || filterValue.length < 2) return [];
    return (this.locationList || []).filter((location) =>
      this.getLocationName(location).toLowerCase().includes(filterValue),
    );
  }



  onNameSelected(employee: EmployeeDropDown): void {

    if (!employee) return;

    this.selectedEmployeeId = this.getEmployeeId(employee);

    this.employeeNameCtrl.setValue(this.fullName(employee), { emitEvent: false });

    this.employeeMobileCtrl.setValue(this.getMobile(employee), { emitEvent: false });

  }



  onMobileSelected(employee: EmployeeDropDown): void {

    if (!employee) return;

    this.selectedEmployeeId = this.getEmployeeId(employee);

    this.employeeMobileCtrl.setValue(this.getMobile(employee), { emitEvent: false });

    this.employeeNameCtrl.setValue(this.fullName(employee), { emitEvent: false });

  }



  onNameInput(): void {

    this.selectedEmployeeId = null;

  }



  onMobileInput(): void {

    this.selectedEmployeeId = null;

  }



  fullName(employee: any): string {

    const firstName = employee?.firstName ?? employee?.FirstName ?? '';

    const lastName = employee?.lastName ?? employee?.LastName ?? '';

    return `${firstName} ${lastName}`.trim();

  }



  getMobile(employee: any): string {

    return employee?.mobile ?? employee?.Mobile ?? '';

  }



  getEmployeeId(employee: any): number {

    return employee?.employeeID ?? employee?.EmployeeID ?? null;

  }



  private filterByName(value: string): EmployeeDropDown[] {

    const filterValue = String(value || '').toLowerCase().trim();

    if (!filterValue || filterValue.length < 2) return [];

    return (this.employeeList || []).filter((employee) =>

      this.fullName(employee).toLowerCase().includes(filterValue),

    );

  }



  private filterByMobile(value: string): EmployeeDropDown[] {

    const digits = String(value || '').replace(/\D/g, '');

    if (!digits || digits.length < 3) return [];

    return (this.employeeList || []).filter((employee) =>

      this.getMobile(employee).replace(/\D/g, '').includes(digits),

    );

  }



  private getSearchFilters(): { employeeId: string; employeeName: string; employeeMobile: string; locationId: string; locationName: string; loginStatus: string } {
    const base = {
      locationId: this.selectedLocationId != null ? String(this.selectedLocationId) : '',
      locationName: this.selectedLocationId != null ? '' : (this.employeeLocationCtrl.value || '').trim(),
      loginStatus: this.loginStatusFilter || 'all',
    };
    if (this.selectedEmployeeId != null) {
      return {
        employeeId: String(this.selectedEmployeeId),
        employeeName: '',
        employeeMobile: '',
        ...base,
      };
    }

    return {
      employeeId: '',
      employeeName: (this.employeeNameCtrl.value || '').trim(),
      employeeMobile: (this.employeeMobileCtrl.value || '').trim(),
      ...base,
    };
  }



  loadData(): void {

    const fromDate = this.fromDateCtrl.value;

    const toDate = this.toDateCtrl.value;

    if (!fromDate || !toDate) {

      this.loadError = 'From Date and To Date are required.';

      return;

    }



    this.loading = true;

    this.loadError = '';

    const filters = this.getSearchFilters();



    const onSuccess = (rows: any, target: 'summary' | 'sessions' | 'daily') => {

      const normalized = this.normalizeRows(rows);

      if (target === 'summary') this.summaryRows = normalized;

      else if (target === 'daily') this.dailyRows = normalized;

      else this.sessionRows = normalized;

      this.loading = false;

    };



    const onError = (err: any, target: 'summary' | 'sessions' | 'daily') => {

      this.loading = false;

      this.loadError = this.extractErrorMessage(err);

      if (target === 'summary') this.summaryRows = [];

      else if (target === 'daily') this.dailyRows = [];

      else this.sessionRows = [];

      this.snackBar.open(this.loadError, 'Close', { duration: 5000 });

    };



    if (this.activeTab === 'summary') {

      this.service.getSummary(filters.employeeId, fromDate, toDate, this.groupBy, this.pageNumber, filters.employeeName, filters.employeeMobile, filters.locationId, filters.locationName, filters.loginStatus)

        .subscribe((rows) => onSuccess(rows, 'summary'), (err) => onError(err, 'summary'));

      return;

    }

    if (this.activeTab === 'daily') {

      this.service.getDaily(filters.employeeId, fromDate, toDate, this.pageNumber, filters.employeeName, filters.employeeMobile, filters.locationId, filters.locationName, filters.loginStatus)

        .subscribe((rows) => onSuccess(rows, 'daily'), (err) => onError(err, 'daily'));

      return;

    }

    this.service.getSessions(filters.employeeId, fromDate, toDate, this.pageNumber, filters.employeeName, filters.employeeMobile, filters.locationId, filters.locationName, filters.loginStatus)

      .subscribe((rows) => onSuccess(rows, 'sessions'), (err) => onError(err, 'sessions'));

  }



  private extractErrorMessage(err: any): string {

    if (typeof err === 'string') return err;

    const body = err?.error;

    if (typeof body === 'string' && body.trim()) return body;

    if (body?.message) return String(body.message);

    if (body?.Message) return String(body.Message);

    return 'Failed to load data. Check API connection and date range.';

  }



  formatDeduction(row: any): string {

    const deducted = row.InactivityMinutesDeducted ?? row.inactivityMinutesDeducted;

    const gross = row.GrossDurationMinutes ?? row.grossDurationMinutes;

    const net = row.DurationMinutes ?? row.durationMinutes;

    if (!deducted) return '—';

    return `${gross} min − ${deducted} inactive = ${net} min`;

  }



  formatSessionReason(row: any): string {

    if (this.isActiveSession(row)) return 'Active';

    const reason = row.SessionEndReason || row.sessionEndReason;

    const deducted = row.InactivityMinutesDeducted ?? row.inactivityMinutesDeducted;

    if (!reason) return '—';

    if (reason === 'InactivityLogout') return 'Inactivity Timeout';

    if (deducted && reason === 'ExplicitLogout') return 'ExplicitLogout (Inactivity)';

    if (reason === 'AbnormalClose') return 'Tab / Window Close';

    if (reason === 'SupersededByNewLogin') return 'Superseded By New Login';

    if (reason === 'AbandonedSession') return 'Abandoned Session';

    return reason;

  }



  isActiveSession(row: any): boolean {

    if (row?.IsActive === true || row?.isActive === true) return true;

    if (row?.LogoutAt || row?.logoutAt) return false;

    if (row?.IsActive === false || row?.isActive === false) return false;

    return true;

  }



  formatRecordedEnd(row: any): string {

    const end = row.EffectiveEndAt || row.effectiveEndAt;

    const formatted = this.formatDate(end);

    if (!formatted) return '—';

    return this.isActiveSession(row) ? `${formatted} (Active)` : formatted;

  }



  formatMinutes(value: any): string {

    if (value == null || value === '') return '—';

    return String(value);

  }



  formatStatus(row: any): string {
    return row?.Status || row?.status || 'Offline';
  }

  formatWorkDate(value: any): string {

    if (!value) return '';

    const m = moment(value).utcOffset('+05:30');

    return m.isValid() ? m.format('DD-MMM-YYYY') : String(value);

  }



  formatDate(value: any): string {

    if (!value) return '';

    const m = moment.utc(value).utcOffset('+05:30');

    return m.isValid() ? m.format('DD-MMM-YYYY HH:mm [IST]') : String(value);

  }



  get dateRangeLabel(): string {

    const from = this.fromDateCtrl.value;

    const to = this.toDateCtrl.value;

    if (!from || !to) return '';

    return `${moment(from).utcOffset('+05:30').format('DD-MMM-YYYY')} to ${moment(to).utcOffset('+05:30').format('DD-MMM-YYYY')} (IST)`;

  }



  private normalizeRows(rows: any): any[] {

    if (!Array.isArray(rows)) return [];

    return rows.map((row) => {

      const normalized: any = {};

      Object.keys(row || {}).forEach((key) => {

        const pascal = key.charAt(0).toUpperCase() + key.slice(1);

        normalized[pascal] = row[key];

        normalized[key] = row[key];

      });

      return normalized;

    });

  }

}

