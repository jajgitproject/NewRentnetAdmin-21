import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from '../general/general.service';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
import { EmployeePrefixSearchField } from '../shared/employee-prefix-search.field';
import {
  createDisplayEmployeeFn,
  formatEmployeeDropdownLabel,
  isEmployeeDropdownSelection,
  isSelectedEmployeeExitedFromControl,
} from '../shared/customer-employee-autocomplete';
import { AuditChangedField, AuditTrailEvent, AuditTrailQueryInterpretation } from './auditTrail.model';
import { AuditTrailService } from './auditTrail.service';
import { AuditChangeDetailsDialogComponent } from './dialogs/change-details-dialog.component';
import { AuditNlpQuestionsDialogComponent } from './dialogs/nlp-questions-dialog.component';

@Component({
  standalone: false,
  selector: 'app-auditTrail',
  templateUrl: './auditTrail.component.html',
  styleUrls: ['./auditTrail.component.sass']
})
export class AuditTrailComponent implements OnInit {
  formatEmployeeDropdownLabel = formatEmployeeDropdownLabel;
  userSearch: EmployeePrefixSearchField;
  userCtrl: FormControl;
  selectedUserId: number | null = null;
  displayUserFn = createDisplayEmployeeFn();
  moduleCtrl = new FormControl('');
  operationCtrl = new FormControl('');
  reservationIdCtrl = new FormControl(null);
  allotmentIdCtrl = new FormControl(null);
  fromDateCtrl = new FormControl();
  toDateCtrl = new FormControl();
  nlpCtrl = new FormControl('');
  nlpSearchText: string | null = null;
  nlpWarnings: string[] = [];

  events: AuditTrailEvent[] = [];
  isLoadingEvents = false;
  selectedEvent: AuditTrailEvent | null = null;
  isLoadingDetail = false;
  pageNumber = 1;
  pageSize = 50;

  constructor(
    private auditTrailService: AuditTrailService,
    private snackBar: MatSnackBar,
    private generalService: GeneralService,
    private dialog: MatDialog
  ) {
    this.userSearch = new EmployeePrefixSearchField(this.generalService);
    this.userCtrl = this.userSearch.control;
  }

  ngOnInit(): void {
    this.resetDateRange();
    this.userCtrl.valueChanges.subscribe((value) => {
      if (typeof value === 'string' || value == null || value === '') {
        this.selectedUserId = null;
      }
    });
  }

  isSelectedUserExited(): boolean {
    return isSelectedEmployeeExitedFromControl(this.userCtrl, []);
  }

  onUserFilterInput(): void {
    const raw = this.userCtrl.value;
    if (typeof raw === 'string' || raw == null || raw === '') {
      this.selectedUserId = null;
    }
  }

  search(): void {
    const fromDate = this.fromDateCtrl.value;
    const toDate = this.toDateCtrl.value;
    if (!fromDate || !toDate) {
      this.snackBar.open('From and To dates are required.', '', { duration: 3000 });
      return;
    }
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
    if (days > 31) {
      this.snackBar.open('Date range cannot exceed 31 days.', '', { duration: 3000 });
      return;
    }

    this.isLoadingEvents = true;
    this.selectedEvent = null;
    this.auditTrailService
      .getEvents(
        this.moduleCtrl.value || '',
        this.toNumber(this.reservationIdCtrl.value),
        this.toNumber(this.allotmentIdCtrl.value),
        this.selectedUserId,
        fromDate,
        toDate,
        this.pageNumber,
        this.pageSize,
        this.operationCtrl.value || '',
        this.nlpSearchText
      )
      .subscribe(
        (data) => {
          this.events = data || [];
          this.isLoadingEvents = false;
        },
        () => {
          this.events = [];
          this.isLoadingEvents = false;
          this.snackBar.open('Could not load audit events.', '', { duration: 4000 });
        }
      );
  }

  openEvent(evt: AuditTrailEvent, clickEvent?: Event): void {
    clickEvent?.stopPropagation();
    if (!evt?.eventId) {
      return;
    }
    const data = {
      event: evt,
      loading: true,
      operationLabel: this.operationLabel(evt.operation)
    };
    const dialogRef = this.dialog.open(AuditChangeDetailsDialogComponent, {
      width: '860px',
      maxWidth: '96vw',
      autoFocus: false,
      data
    });
    this.auditTrailService.getEvent(evt.eventId).subscribe(
      (detail) => {
        dialogRef.componentInstance.setDetail(
          detail,
          this.operationLabel(detail?.operation || evt.operation)
        );
      },
      () => {
        dialogRef.componentInstance.setDetail(evt, this.operationLabel(evt.operation));
      }
    );
  }

  operationLabel(operation: string): string {
    if (operation === 'I') {
      return 'Insert';
    }
    if (operation === 'D') {
      return 'Delete';
    }
    return 'Update';
  }

  userDisplay(emp: EmployeeDropDown | string): string {
    if (!emp) {
      return '';
    }
    if (typeof emp === 'string') {
      return emp;
    }
    if (isEmployeeDropdownSelection(emp)) {
      return formatEmployeeDropdownLabel(emp);
    }
    const apiName = ((emp as any).name || (emp as any).Name || '').trim();
    if (apiName) {
      return apiName;
    }
    return formatEmployeeDropdownLabel(emp as EmployeeDropDown);
  }

  onUserSelected(emp: EmployeeDropDown): void {
    if (!emp?.employeeID) {
      return;
    }
    this.userSearch.onSelected(emp);
    this.selectedUserId = emp.employeeID;
  }

  openNlpQuestions(): void {
    this.dialog.open(AuditNlpQuestionsDialogComponent, {
      width: '560px',
      maxWidth: '96vw',
      autoFocus: false
    });
  }

  ask(): void {
    const q = String(this.nlpCtrl.value || '').trim();
    if (!q) {
      this.snackBar.open('Type a search in plain English first.', '', { duration: 3000 });
      return;
    }

    this.isLoadingEvents = true;
    this.selectedEvent = null;
    this.auditTrailService.queryEvents(q, this.pageNumber, this.pageSize).subscribe(
      (data) => {
        this.applyInterpretation(data?.interpretation);
        this.nlpWarnings = data?.warnings || data?.interpretation?.warnings || [];
        this.events = data?.events || [];
        this.isLoadingEvents = false;
        if (this.nlpWarnings.length) {
          this.snackBar.open(this.nlpWarnings[0], '', { duration: 4000 });
        }
      },
      () => {
        this.events = [];
        this.isLoadingEvents = false;
        this.snackBar.open('Could not run the search.', '', { duration: 4000 });
      }
    );
  }

  private applyInterpretation(interp: AuditTrailQueryInterpretation): void {
    if (!interp) {
      this.nlpSearchText = null;
      return;
    }

    this.moduleCtrl.setValue(interp.module || '');
    this.operationCtrl.setValue(interp.operation || '');
    this.reservationIdCtrl.setValue(interp.reservationId ?? null);
    this.allotmentIdCtrl.setValue(interp.allotmentId ?? null);
    this.nlpSearchText = interp.searchText || null;

    const from = this.parseApiDate(interp.fromDate);
    const to = this.parseApiDate(interp.toDate);
    if (from || to) {
      if (from) {
        this.fromDateCtrl.setValue(from);
      }
      if (to) {
        this.toDateCtrl.setValue(to);
      }
    } else {
      this.resetDateRange();
    }

    if (interp.userId) {
      this.selectedUserId = interp.userId;
      this.userCtrl.setValue({
        employeeID: interp.userId,
        name: interp.userDisplayName || '#' + interp.userId
      } as EmployeeDropDown);
    } else {
      this.selectedUserId = null;
      this.userCtrl.setValue('');
    }
  }

  private parseApiDate(value: string | null): Date | null {
    if (!value) {
      return null;
    }
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return null;
    }
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }

  clearFilters(): void {
    this.moduleCtrl.setValue('');
    this.operationCtrl.setValue('');
    this.reservationIdCtrl.setValue(null);
    this.allotmentIdCtrl.setValue(null);
    this.selectedUserId = null;
    this.userSearch.reset();
    this.nlpCtrl.setValue('');
    this.nlpSearchText = null;
    this.nlpWarnings = [];
    this.resetDateRange();
    this.events = [];
    this.selectedEvent = null;
    this.pageNumber = 1;
  }

  private resetDateRange(): void {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 7);
    this.fromDateCtrl.setValue(from);
    this.toDateCtrl.setValue(today);
  }

  changedFields(evt: AuditTrailEvent): AuditChangedField[] {
    return evt?.changedFields || [];
  }

  private toNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
}
