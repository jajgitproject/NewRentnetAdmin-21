// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { EmployeeLoginHoursMISService } from './employeeLoginHoursMIS.service';

@Component({
  standalone: false,
  selector: 'app-employee-login-hours-mis',
  templateUrl: './employeeLoginHoursMIS.component.html',
  styleUrls: ['./employeeLoginHoursMIS.component.sass'],
})
export class EmployeeLoginHoursMISComponent implements OnInit {
  activeTab: 'summary' | 'sessions' | 'overlaps' = 'summary';
  groupBy = 'day';
  employeeId = '';
  branchId = '';
  pageNumber = 0;
  loading = false;
  loadError = '';

  fromDateCtrl = new FormControl(moment().utcOffset('+05:30').subtract(30, 'days').toDate());
  toDateCtrl = new FormControl(moment().utcOffset('+05:30').toDate());

  summaryRows: any[] = [];
  sessionRows: any[] = [];
  overlapRows: any[] = [];

  summaryColumns = ['employeeName', 'periodKey', 'sessionCount', 'grossMinutes', 'overlapMinutes', 'inactivityMinutesDeducted', 'netMinutes', 'netHours'];
  sessionColumns = ['employeeName', 'loginAt', 'actualEndAt', 'recordedEndAt', 'grossDurationMinutes', 'inactivityMinutesDeducted', 'durationMinutes', 'sessionEndReason', 'loginLatitude', 'loginLongitude'];
  overlapColumns = ['employeeName', 'overlapStartAt', 'overlapEndAt', 'overlapMinutes', 'sessionIdA', 'sessionIdB'];

  constructor(private service: EmployeeLoginHoursMISService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadData();
  }

  get hasData(): boolean {
    if (this.activeTab === 'summary') return this.summaryRows.length > 0;
    if (this.activeTab === 'sessions') return this.sessionRows.length > 0;
    return this.overlapRows.length > 0;
  }

  setTab(tab: 'summary' | 'sessions' | 'overlaps'): void {
    this.activeTab = tab;
    this.pageNumber = 0;
    this.loadData();
  }

  refresh(): void {
    this.employeeId = '';
    this.branchId = '';
    this.groupBy = 'day';
    this.pageNumber = 0;
    this.fromDateCtrl.setValue(moment().utcOffset('+05:30').subtract(30, 'days').toDate());
    this.toDateCtrl.setValue(moment().utcOffset('+05:30').toDate());
    this.loadData();
  }

  search(): void {
    this.pageNumber = 0;
    this.loadData();
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

    const onSuccess = (rows: any, target: 'summary' | 'sessions' | 'overlaps') => {
      const normalized = this.normalizeRows(rows);
      if (target === 'summary') this.summaryRows = normalized;
      else if (target === 'sessions') this.sessionRows = normalized;
      else this.overlapRows = normalized;
      this.loading = false;
    };

    const onError = (err: any) => {
      this.loading = false;
      this.loadError = typeof err === 'string' ? err : 'Failed to load data. Check API connection and date range.';
      this.summaryRows = [];
      this.sessionRows = [];
      this.overlapRows = [];
      this.snackBar.open(this.loadError, 'Close', { duration: 5000 });
    };

    if (this.activeTab === 'summary') {
      this.service.getSummary(this.employeeId, fromDate, toDate, this.branchId, this.groupBy, this.pageNumber)
        .subscribe((rows) => onSuccess(rows, 'summary'), onError);
      return;
    }
    if (this.activeTab === 'sessions') {
      this.service.getSessions(this.employeeId, fromDate, toDate, this.pageNumber)
        .subscribe((rows) => onSuccess(rows, 'sessions'), onError);
      return;
    }
    this.service.getOverlaps(this.employeeId, fromDate, toDate, this.pageNumber)
      .subscribe((rows) => onSuccess(rows, 'overlaps'), onError);
  }

  formatDeduction(row: any): string {
    const deducted = row.InactivityMinutesDeducted ?? row.inactivityMinutesDeducted;
    const gross = row.GrossDurationMinutes ?? row.grossDurationMinutes;
    const net = row.DurationMinutes ?? row.durationMinutes;
    if (!deducted) return '—';
    return `${gross} min − ${deducted} inactive = ${net} min`;
  }

  formatSessionReason(row: any): string {
    const reason = row.SessionEndReason || row.sessionEndReason;
    const deducted = row.InactivityMinutesDeducted ?? row.inactivityMinutesDeducted;
    if (!reason) return '—';
    if (deducted && reason === 'ExplicitLogout') return 'ExplicitLogout (Inactivity)';
    return reason;
  }

  formatMinutes(value: any): string {
    if (value == null || value === '') return '—';
    return String(value);
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
