// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { GeneralService } from '../general/general.service';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
import { PageAuditDropDown } from './pageAuditDropDown.model';

import { AuditTrailEvent, AuditTrailRow, AuditTrailTableGroup } from './auditTrail.model';
import { AuditTrailService } from './auditTrail.service';

@Component({
  standalone: false,
  selector: 'app-auditTrail',
  templateUrl: './auditTrail.component.html',
  styleUrls: ['./auditTrail.component.sass'],
  providers: []
})
export class AuditTrailComponent implements OnInit {
  employees: EmployeeDropDown[] = [];
  pages: PageAuditDropDown[] = [];
  filteredUserOptions: Observable<EmployeeDropDown[]>;
  filteredPageOptions: Observable<PageAuditDropDown[]>;

  selectedUserId: number | null = null;
  userCtrl: FormControl = new FormControl();
  pageNameCtrl: FormControl = new FormControl();
  selectedPageFilter: string = '';
  fromDateCtrl: FormControl = new FormControl();
  toDateCtrl: FormControl = new FormControl();
  /** Optional: filter audit events for dbo.Reservation by primary key */
  reservationIdCtrl: FormControl = new FormControl(null);

  /** Set when the last search used a reservation id — drives grouped “single form” layout */
  activeReservationId: number | null = null;
  reservationTableGroups: AuditTrailTableGroup[] = [];

  events: AuditTrailEvent[] = [];
  isLoadingEvents = false;

  rowsByEventId: { [auditEventId: number]: AuditTrailRow[] } = {};
  rowsLoadingEventIds = new Set<number>();
  private diffRowsCache: { [key: string]: Array<{ columnName: string; before: string; after: string; change: string }> } = {};

  constructor(
    private auditTrailService: AuditTrailService,
    private snackBar: MatSnackBar,
    private generalService: GeneralService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.selectedUserId = this.generalService.getUserID();

    this.generalService.GetEmployee().subscribe(
      (data) => {
        this.employees = data || [];
        this.filteredUserOptions = this.userCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this.filterUsers(value || ''))
        );

        // Preselect current user (best effort)
        const current = (this.employees || []).find(e => e.employeeID === this.selectedUserId);
        if (current) {
          this.userCtrl.setValue(current);
        }
      },
      () => {
        this.employees = [];
      }
    );

    this.generalService.GetPagesForAudit().subscribe(
      (data) => {
        this.pages = (data as any) || [];
        this.filteredPageOptions = this.pageNameCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this.filterPages(value || ''))
        );
      },
      () => {
        this.pages = [];
      }
    );
  }

  private filterUsers(value: any): EmployeeDropDown[] {
    const v = (typeof value === 'string' ? value : this.userDisplay(value as EmployeeDropDown))
      .toLowerCase()
      .trim();
    if (!v) return this.employees || [];
    return (this.employees || []).filter(e =>
      this.userDisplay(e).toLowerCase().includes(v)
    );
  }

  private filterPages(value: any): PageAuditDropDown[] {
    const v = (typeof value === 'string' ? value : this.pageDisplay(value as PageAuditDropDown))
      .toLowerCase()
      .trim();
    if (!v) return this.pages || [];
    // Bind/search by FormName (Page.Page)
    return (this.pages || []).filter(p => ((p.page || '')).toLowerCase().includes(v));
  }

  onPageSelected(p: PageAuditDropDown | null): void {
    if (!p) {
      this.selectedPageFilter = '';
      return;
    }
    // Use Form Name (Page.Page) as filter, to match stored FormName in audit tables.
    this.selectedPageFilter = p.page || '';
  }

  pageDisplay(p: PageAuditDropDown): string {
    if (!p) return '';
    // Show FormName in the control (table key not shown here)
    return (p.page || '').trim();
  }

  onUserSelected(emp: EmployeeDropDown): void {
    if (!emp) {
      this.selectedUserId = null;
      return;
    }
    this.selectedUserId = emp.employeeID;
  }

  private parseReservationId(): number | null {
    const v = this.reservationIdCtrl.value;
    if (v === null || v === undefined || v === ('' as any)) return null;
    const n = typeof v === 'number' ? v : parseInt(String(v).trim(), 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  }

  isSearchDisabled(): boolean {
    if (this.isLoadingEvents) return true;
    const hasUser = this.selectedUserId != null && this.selectedUserId > 0;
    const hasRes = this.parseReservationId() != null;
    return !hasUser && !hasRes;
  }

  search(): void {
    const reservationId = this.parseReservationId();
    if (!this.selectedUserId && reservationId == null) {
      this.events = [];
      this.activeReservationId = null;
      this.reservationTableGroups = [];
      return;
    }

    this.isLoadingEvents = true;
    this.rowsByEventId = {};
    this.rowsLoadingEventIds.clear();

    const reservationMode = reservationId != null;
    this.activeReservationId = reservationMode ? reservationId : null;

    let pageName = (this.selectedPageFilter || '').toString();
    if (!pageName) {
      const raw = this.pageNameCtrl.value;
      if (raw && typeof raw === 'object') {
        pageName = ((raw as PageAuditDropDown).page || '').toString();
      } else {
        pageName = (raw || '').toString();
      }
    }

    // Reservation audit: all users, all related tables; ignore form-name filter (API skips it when reservationId set).
    const apiUserId = reservationMode ? null : this.selectedUserId;
    const apiPageName = reservationMode ? '' : pageName;
    const pageSize = reservationMode ? 500 : 50;
    const includeNullUser = true;

    this.auditTrailService
      .getEvents(apiUserId, apiPageName, reservationId, 0, pageSize, includeNullUser)
      .subscribe(
        (data) => {
          const raw = data || [];
          this.events = this.applyDateFilter(raw);
          if (reservationMode) {
            this.reservationTableGroups = this.buildReservationTableGroups(this.events);
            this.prefetchRowsForReservationView(this.events);
          } else {
            this.reservationTableGroups = [];
          }
          this.isLoadingEvents = false;
        },
        () => {
          this.events = [];
          this.reservationTableGroups = [];
          this.activeReservationId = null;
          this.isLoadingEvents = false;
          this.snackBar.open('Failed to load audit events', '', { duration: 3000 });
        }
      );
  }

  isReservationTimelineView(): boolean {
    return this.activeReservationId != null;
  }

  private tableObjectKey(tableName: string | null | undefined): string {
    if (!tableName) return '';
    const s = tableName.replace(/[\[\]]/g, '').trim();
    const i = s.lastIndexOf('.');
    const tail = i >= 0 && i < s.length - 1 ? s.substring(i + 1) : s;
    return tail.toLowerCase();
  }

  private buildReservationTableGroups(events: AuditTrailEvent[]): AuditTrailTableGroup[] {
    const map = new Map<string, AuditTrailEvent[]>();
    for (const e of events) {
      const key = this.tableObjectKey(e.tableName);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(e);
    }
    const out: AuditTrailTableGroup[] = [];
    const eventTime = (ev: AuditTrailEvent) =>
      new Date((ev.eventAtUtc || '').replace(' ', 'T')).getTime() || 0;

    map.forEach((list, tableKey) => {
      list.sort((a, b) => {
        const tb = eventTime(b) - eventTime(a);
        if (tb !== 0) return tb;
        return (b.auditEventId || 0) - (a.auditEventId || 0);
      });
      const first = list[0];
      const label =
        this.prettyFormName(this.rawTableObjectName(first?.tableName)) ||
        this.prettyFormName(tableKey) ||
        tableKey;
      out.push({ tableKey, tableLabel: label, events: list });
    });

    out.sort((a, b) => {
      const ta = Math.max(...a.events.map(eventTime));
      const tb = Math.max(...b.events.map(eventTime));
      return tb - ta;
    });

    return out;
  }

  private rawTableObjectName(tableName: string | null | undefined): string {
    if (!tableName) return '';
    const s = tableName.replace(/[\[\]]/g, '').trim();
    const i = s.lastIndexOf('.');
    return i >= 0 && i < s.length - 1 ? s.substring(i + 1) : s;
  }

  private prefetchRowsForReservationView(events: AuditTrailEvent[]): void {
    if (!events.length) return;
    const pending = events.filter((e) => !this.rowsByEventId[e.auditEventId]);
    if (!pending.length) return;
    pending.forEach((e) => this.rowsLoadingEventIds.add(e.auditEventId));
    forkJoin(pending.map((e) => this.auditTrailService.getRows(e.auditEventId))).subscribe(
      (rowsList) => {
        pending.forEach((e, idx) => {
          this.rowsByEventId[e.auditEventId] = rowsList[idx] || [];
          this.rowsLoadingEventIds.delete(e.auditEventId);
        });
      },
      () => {
        pending.forEach((e) => {
          this.rowsLoadingEventIds.delete(e.auditEventId);
          this.rowsByEventId[e.auditEventId] = [];
        });
        this.snackBar.open('Some row details failed to load — expand an item to retry', '', { duration: 4000 });
      }
    );
  }

  eventUserLabel(e: AuditTrailEvent): string {
    if (e.userId != null && e.userId > 0) {
      const emp = (this.employees || []).find((x) => x.employeeID === e.userId);
      if (emp) {
        return this.userDisplay(emp);
      }
      return 'User ' + e.userId;
    }
    const ln = (e.loginName || '').trim();
    if (ln) {
      return ln;
    }
    return 'Unknown user';
  }

  private applyDateFilter(events: AuditTrailEvent[]): AuditTrailEvent[] {
    const from: Date | null = this.fromDateCtrl.value ? new Date(this.fromDateCtrl.value) : null;
    const to: Date | null = this.toDateCtrl.value ? new Date(this.toDateCtrl.value) : null;
    if (!from && !to) return events;

    const fromMs = from ? new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime() : null;
    const toMs = to
      ? new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999).getTime()
      : null;

    return (events || []).filter(e => {
      const dt = e?.eventAtUtc ? new Date(e.eventAtUtc).getTime() : NaN;
      if (!isFinite(dt)) return false;
      if (fromMs !== null && dt < fromMs) return false;
      if (toMs !== null && dt > toMs) return false;
      return true;
    });
  }

  onPanelOpened(auditEventId: number): void {
    if (this.rowsByEventId[auditEventId]) return;
    if (this.rowsLoadingEventIds.has(auditEventId)) return;

    this.rowsLoadingEventIds.add(auditEventId);

    this.auditTrailService.getRows(auditEventId).subscribe(
      (rows) => {
        this.rowsByEventId[auditEventId] = rows || [];
        this.rowsLoadingEventIds.delete(auditEventId);
      },
      () => {
        this.rowsByEventId[auditEventId] = [];
        this.rowsLoadingEventIds.delete(auditEventId);
        this.snackBar.open('Failed to load audit rows', '', { duration: 3000 });
      }
    );
  }

  userDisplay(emp: EmployeeDropDown): string {
    if (!emp) return '';
    const empId = (emp.employeeID ?? (emp as any).EmployeeID ?? '').toString().trim();
    const first = (emp.employeeFirstName || emp.firstName || '').trim();
    const last = (emp.employeeLastName || emp.lastName || '').trim();
    const name = (first + ' ' + last).trim();
    const mobile = (emp.mobile || '').trim();
    const right = mobile ? (' (' + mobile + ')') : '';
    const left = empId ? (empId + ' - ') : '';
    return left + (name || '').trim() + right;
  }

  operationDisplay(op: string | null | undefined): string {
    const v = (op || '').toUpperCase().trim();
    if (v === 'I') return 'Insert';
    if (v === 'U') return 'Update';
    if (v === 'D') return 'Delete';
    return v || '';
  }

  private splitCamelCase(value: string): string {
    return (value || '')
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();
  }

  prettyFormName(value: string | null | undefined): string {
    const s = this.splitCamelCase((value || '').trim());
    if (!s) return '';
    return s
      .split(' ')
      .map(w => (w ? (w[0].toUpperCase() + w.slice(1)) : w))
      .join(' ');
  }

  eventTitle(e: AuditTrailEvent): string {
    if (this.isReservationTimelineView()) {
      const op = this.operationDisplay(e?.operation);
      const form = this.prettyFormName(e?.formName);
      if (form) {
        return op ? `${form} (${op})` : form;
      }
      return op ? `(${op})` : 'Change';
    }
    const name = this.prettyFormName(e?.formName) || this.prettyFormName(e?.tableName) || '';
    const op = this.operationDisplay(e?.operation);
    if (!name) return op ? `(${op})` : '';
    return op ? `${name} (${op})` : name;
  }

  formatEventTime(value: string | null | undefined): string {
    const raw = (value || '').toString().trim();
    if (!raw) return '';
    // Server already provides IST formatted string; if it's a plain string, show as-is.
    // (Fallback: if it looks like a date string, still format locally.)
    const dt = new Date(raw);
    if (!isFinite(dt.getTime())) return raw;
    return dt.toLocaleString();
  }

  prettyJson(raw: string | null | undefined): string {
    if (!raw) return '';
    try {
      const parsed = JSON.parse(raw);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return raw;
    }
  }

  private escapeHtml(s: string): string {
    return (s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private tryParseJson(raw: string | null | undefined): any {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private collectChangedPaths(before: any, after: any, basePath: string, changed: Set<string>): void {
    if (before === after) return;

    const beforeIsObj = before !== null && typeof before === 'object';
    const afterIsObj = after !== null && typeof after === 'object';

    if (!beforeIsObj || !afterIsObj) {
      changed.add(basePath);
      return;
    }

    // Arrays: compare by index
    if (Array.isArray(before) || Array.isArray(after)) {
      const bArr = Array.isArray(before) ? before : [];
      const aArr = Array.isArray(after) ? after : [];
      const len = Math.max(bArr.length, aArr.length);
      for (let i = 0; i < len; i++) {
        this.collectChangedPaths(bArr[i], aArr[i], basePath + '[' + i + ']', changed);
      }
      return;
    }

    const keys = new Set<string>([
      ...Object.keys(before || {}),
      ...Object.keys(after || {}),
    ]);
    Array.from(keys).forEach(k => {
      const p = basePath ? (basePath + '.' + k) : k;
      this.collectChangedPaths(before ? before[k] : undefined, after ? after[k] : undefined, p, changed);
    });
  }

  /**
   * Renders a JSON payload as a small HTML diff tree. Caller is responsible for
   * trusting the returned string via `bypassSecurityTrustHtml`; every piece of
   * user/server-provided content that is interpolated below MUST go through
   * `escapeHtml()` first. CSS class names and literal HTML are the only
   * unescaped strings in this method. If you add a new branch, preserve this
   * contract or the whole diff viewer becomes an XSS sink.
   */
  private renderJson(obj: any, changedPaths: Set<string>, basePath: string): string {
    if (obj === null || obj === undefined) {
      const v = 'null';
      const cls = changedPaths.has(basePath) ? 'changed' : '';
      return `<span class="${cls}">${v}</span>`;
    }
    if (typeof obj !== 'object') {
      const v = this.escapeHtml(typeof obj === 'string' ? `"${obj}"` : String(obj));
      const cls = changedPaths.has(basePath) ? 'changed' : '';
      return `<span class="${cls}">${v}</span>`;
    }
    if (Array.isArray(obj)) {
      const items = obj.map((it, idx) => this.renderJson(it, changedPaths, basePath + '[' + idx + ']'));
      return `[${items.join(', ')}]`;
    }

    const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
    const lines = keys.map(k => {
      const p = basePath ? (basePath + '.' + k) : k;
      const key = this.escapeHtml(k);
      const valHtml = this.renderJson(obj[k], changedPaths, p);
      const keyCls = changedPaths.has(p) ? 'changed' : '';
      return `<div class="json-line"><span class="json-key ${keyCls}">"${key}"</span>: ${valHtml}</div>`;
    });
    return `<div class="json-obj">{${lines.join('')}}<\/div>`;
  }

  diffJsonHtml(beforeRaw: string | null | undefined, afterRaw: string | null | undefined, side: 'before' | 'after'): SafeHtml {
    const before = this.tryParseJson(beforeRaw);
    const after = this.tryParseJson(afterRaw);
    if (before === null && after === null) {
      const raw = side === 'before' ? (beforeRaw || '') : (afterRaw || '');
      return this.sanitizer.bypassSecurityTrustHtml(this.escapeHtml(raw));
    }

    const changed = new Set<string>();
    this.collectChangedPaths(before, after, '', changed);
    const target = side === 'before' ? before : after;
    const html = this.renderJson(target, changed, '');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  buildDiffTableRows(beforeRaw: string | null | undefined, afterRaw: string | null | undefined):
    Array<{ columnName: string; before: string; after: string; change: string }> {
    const cacheKey = (beforeRaw || '') + '||' + (afterRaw || '');
    if (this.diffRowsCache[cacheKey]) return this.diffRowsCache[cacheKey];

    const beforeObj = this.tryParseJson(beforeRaw);
    const afterObj = this.tryParseJson(afterRaw);

    const beforeFlat: { [k: string]: any } = {};
    const afterFlat: { [k: string]: any } = {};

    const flatten = (obj: any, base: string, into: { [k: string]: any }) => {
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
          flatten(it, base ? `${base}[${idx}]` : `[${idx}]`, into);
        });
        return;
      }

      const keys = Object.keys(obj);
      if (keys.length === 0) {
        if (base) into[base] = {};
        return;
      }
      keys.forEach(k => {
        const p = base ? `${base}.${k}` : k;
        flatten(obj[k], p, into);
      });
    };

    flatten(beforeObj, '', beforeFlat);
    flatten(afterObj, '', afterFlat);

    const allKeys = Array.from(new Set<string>([...Object.keys(beforeFlat), ...Object.keys(afterFlat)])).sort((a, b) => a.localeCompare(b));

    const fmt = (v: any): string => {
      if (v === undefined) return '';
      if (v === null) return 'NULL';
      if (typeof v === 'string') return v;
      try { return JSON.stringify(v); } catch { return String(v); }
    };

    const rows = allKeys.map(k => {
      const b = fmt(beforeFlat[k]);
      const a = fmt(afterFlat[k]);
      const changed = b !== a;
      return {
        columnName: k,
        before: b,
        after: a,
        change: changed ? 'Yes' : ''
      };
    });

    this.diffRowsCache[cacheKey] = rows;
    return rows;
  }
}



