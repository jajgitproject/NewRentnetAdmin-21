// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith, finalize } from 'rxjs/operators';

import { GeneralService } from '../general/general.service';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
import { ApplicationAuditLogEvent } from './applicationAuditLog.model';
import { ApplicationAuditLogService } from './applicationAuditLog.service';

@Component({
  standalone: false,
  selector: 'app-application-audit-log',
  templateUrl: './applicationAuditLog.component.html',
  styleUrls: ['./applicationAuditLog.component.sass'],
})
export class ApplicationAuditLogComponent implements OnInit {
  employees: EmployeeDropDown[] = [];
  pageOptions: string[] = [];
  filteredUserOptions: Observable<EmployeeDropDown[]>;

  userCtrl = new FormControl();
  formNameCtrl = new FormControl('');
  operationCtrl = new FormControl('');
  reservationIdCtrl = new FormControl(null);
  recordIdCtrl = new FormControl('');
  fromDateCtrl = new FormControl(null);
  toDateCtrl = new FormControl(null);

  events: ApplicationAuditLogEvent[] = [];
  selectedEvent: ApplicationAuditLogEvent | null = null;
  isLoadingEvents = false;
  isLoadingDetail = false;

  private diffRowsCache: {
    [key: string]: Array<{ columnName: string; before: string; after: string; change: string }>;
  } = {};

  constructor(
    private auditLogService: ApplicationAuditLogService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.generalService.GetEmployee().subscribe(
      (data) => {
        this.employees = data || [];
        this.filteredUserOptions = this.userCtrl.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterUsers(value || ''))
        );
      },
      () => {
        this.employees = [];
      }
    );

    this.auditLogService.getEvents(null, '', '', null, '', null, null, 1, 500).subscribe(
      (data) => {
        const names = new Set<string>();
        (data || []).forEach((e) => {
          const n = this.formName(e);
          if (n) names.add(n);
        });
        this.pageOptions = Array.from(names).sort((a, b) => a.localeCompare(b));
      },
      () => {
        this.pageOptions = ['supplierPayout'];
      }
    );
  }

  private filterUsers(value: any): EmployeeDropDown[] {
    const v = (typeof value === 'string' ? value : this.userDisplay(value as EmployeeDropDown))
      .toLowerCase()
      .trim();
    if (!v) return this.employees || [];
    return (this.employees || []).filter((e) =>
      this.userDisplay(e).toLowerCase().includes(v)
    );
  }

  userDisplay(emp: EmployeeDropDown): string {
    if (!emp) return '';
    const empId = (emp.employeeID ?? (emp as any).EmployeeID ?? '').toString().trim();
    const first = (emp.employeeFirstName || emp.firstName || '').trim();
    const last = (emp.employeeLastName || emp.lastName || '').trim();
    const name = (first + ' ' + last).trim();
    const mobile = (emp.mobile || '').trim();
    const right = mobile ? ' (' + mobile + ')' : '';
    const left = empId ? empId + ' - ' : '';
    return left + name + right;
  }

  private resolveSelectedUserId(): number | null {
    const raw = this.userCtrl.value;
    if (raw && typeof raw === 'object') {
      const id = raw.employeeID ?? (raw as any).EmployeeID;
      return id != null && id > 0 ? id : null;
    }
    return null;
  }

  private parseReservationId(): number | null {
    const v = this.reservationIdCtrl.value;
    if (v === null || v === undefined || v === ('' as any)) return null;
    const n = typeof v === 'number' ? v : parseInt(String(v).trim(), 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  }

  search(): void {
    this.isLoadingEvents = true;
    this.selectedEvent = null;
    this.diffRowsCache = {};

    const userId = this.resolveSelectedUserId();
    const formName = (this.formNameCtrl.value || '').toString().trim();
    const operation = (this.operationCtrl.value || '').toString().trim();
    const reservationId = this.parseReservationId();
    const recordId = (this.recordIdCtrl.value || '').toString().trim();
    const fromDate = this.fromDateCtrl.value ? new Date(this.fromDateCtrl.value) : null;
    const toDate = this.toDateCtrl.value ? new Date(this.toDateCtrl.value) : null;

    this.auditLogService
      .getEvents(userId, formName, operation, reservationId, recordId, fromDate, toDate, 1, 100)
      .pipe(finalize(() => (this.isLoadingEvents = false)))
      .subscribe({
        next: (data) => {
          this.events = data || [];
        },
        error: () => {
          this.events = [];
          this.snackBar.open(
            'Failed to load application audit events. Check that log files exist under Logs/application-audit/.',
            '',
            { duration: 10000 }
          );
        },
      });
  }

  showDetails(evt: ApplicationAuditLogEvent): void {
    const eventId = this.eventId(evt);
    if (!eventId) return;

    if (this.selectedEvent && this.eventId(this.selectedEvent) === eventId) {
      this.selectedEvent = null;
      return;
    }

    this.isLoadingDetail = true;
    this.auditLogService
      .getEvent(eventId)
      .pipe(finalize(() => (this.isLoadingDetail = false)))
      .subscribe({
        next: (detail) => {
          this.selectedEvent = detail || evt;
        },
        error: () => {
          this.selectedEvent = evt;
        },
      });
  }

  eventId(e: ApplicationAuditLogEvent): string {
    return (e.eventId || e.EventId || '').toString();
  }

  formName(e: ApplicationAuditLogEvent): string {
    return (e.formName || e.FormName || '').toString();
  }

  recordId(e: ApplicationAuditLogEvent): string {
    return (e.recordId || e.RecordId || '—').toString() || '—';
  }

  reservationId(e: ApplicationAuditLogEvent): string {
    const id = e.reservationId ?? e.ReservationId;
    return id != null && id > 0 ? String(id) : '—';
  }

  source(e: ApplicationAuditLogEvent): string {
    return (e.source || e.Source || '').toString();
  }

  userLabel(e: ApplicationAuditLogEvent): string {
    const display = (e.userDisplayName || e.UserDisplayName || '').trim();
    if (display) return display;
    const uid = e.userId ?? e.UserId;
    if (uid != null && uid > 0) {
      const emp = (this.employees || []).find(
        (x) => x.employeeID === uid || (x as any).EmployeeID === uid
      );
      if (emp) return this.userDisplay(emp);
      return 'User ' + uid;
    }
    return (e.loginName || e.LoginName || 'Unknown user').toString();
  }

  operationDisplay(op: string | null | undefined): string {
    const v = (op || '').toUpperCase().trim();
    if (v === 'I') return 'Insert';
    if (v === 'U') return 'Update';
    if (v === 'D') return 'Delete';
    return v || '';
  }

  operationBadgeClass(op: string | null | undefined): string {
    const v = (op || '').toUpperCase().trim();
    if (v === 'I') return 'badge-insert';
    if (v === 'U') return 'badge-update';
    if (v === 'D') return 'badge-delete';
    return '';
  }

  formatEventTime(value: string | null | undefined): string {
    const raw = (value || '').toString().trim();
    if (!raw) return '';
    const d = new Date(raw);
    if (!isFinite(d.getTime())) return raw;
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }) + ' UTC';
  }

  timestamp(e: ApplicationAuditLogEvent): string {
    return this.formatEventTime(e.timestampUtc || e.TimestampUtc);
  }

  buildDiffTableRows(
    beforeRaw: string | null | undefined,
    afterRaw: string | null | undefined
  ): Array<{ columnName: string; before: string; after: string; change: string }> {
    const cacheKey = (beforeRaw || '') + '||' + (afterRaw || '');
    if (this.diffRowsCache[cacheKey]) return this.diffRowsCache[cacheKey];

    const beforeObj = this.tryParseJson(beforeRaw);
    const afterObj = this.tryParseJson(afterRaw);
    const beforeFlat: { [k: string]: any } = {};
    const afterFlat: { [k: string]: any } = {};
    this.flatten(beforeObj, '', beforeFlat);
    this.flatten(afterObj, '', afterFlat);

    const allKeys = Array.from(
      new Set<string>([...Object.keys(beforeFlat), ...Object.keys(afterFlat)])
    ).sort((a, b) => a.localeCompare(b));

    const fmt = (v: any): string => {
      if (v === undefined) return '';
      if (v === null) return '—';
      if (typeof v === 'string') return v;
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    };

    const rows = allKeys.map((k) => {
      const b = fmt(beforeFlat[k]);
      const a = fmt(afterFlat[k]);
      return {
        columnName: k,
        before: b,
        after: a,
        change: b !== a ? 'Yes' : '',
      };
    });

    this.diffRowsCache[cacheKey] = rows;
    return rows;
  }

  private tryParseJson(raw: string | null | undefined): any {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private flatten(obj: any, base: string, into: { [k: string]: any }): void {
    if (obj === null || obj === undefined) {
      if (base) into[base] = null;
      return;
    }
    if (typeof obj !== 'object') {
      if (base) into[base] = obj;
      return;
    }
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        if (base) into[base] = [];
        return;
      }
      obj.forEach((it, idx) => {
        this.flatten(it, base ? `${base}[${idx}]` : `[${idx}]`, into);
      });
      return;
    }
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      if (base) into[base] = {};
      return;
    }
    keys.forEach((k) => {
      const p = base ? `${base}.${k}` : k;
      this.flatten(obj[k], p, into);
    });
  }

  beforeJson(e: ApplicationAuditLogEvent): string {
    return e.beforeJson || e.BeforeJson || '';
  }

  afterJson(e: ApplicationAuditLogEvent): string {
    return e.afterJson || e.AfterJson || '';
  }
}
