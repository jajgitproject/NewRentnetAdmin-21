// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerMeetingService } from '../../customerMeeting.service';
import { CustomerMeetingRemark } from '../../customerMeeting.model';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-remark-dialog',
  templateUrl: './remark-dialog.component.html',
  styleUrls: ['./remark-dialog.component.sass']
})
export class RemarkDialogComponent {
  dialogTitle = 'Meeting Remarks';
  remarkForm: FormGroup;
  saveDisabled: boolean = true;
  remarkList: CustomerMeetingRemark[] = [];
  currentRemarkDate = new Date();
  currentRemarkTime = new Date();
  remarkByName = '';
  meetingSubject = '';
  customerGroup = '';
  private customerMeetingID = 0;

  constructor(
    public dialogRef: MatDialogRef<RemarkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public customerMeetingService: CustomerMeetingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public _generalService: GeneralService
  ) {
    const row = data.advanceTable || {};
    this.customerMeetingID = Number(row.customerMeetingID ?? row.CustomerMeetingID ?? 0);
    this.meetingSubject = row.meetingSubject ?? row.MeetingSubject ?? '';
    this.customerGroup = row.customerGroup ?? row.CustomerGroup ?? '';

    this.remarkForm = this.fb.group({
      remark: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.loadLoggedInEmployeeName();
    this.loadRemarks();
  }

  loadLoggedInEmployeeName() {
    const nameFromSession = this.getEmployeeNameFromSession();
    if (nameFromSession) {
      this.remarkByName = nameFromSession;
    }

    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(data => {
      const employee = Array.isArray(data) && data.length ? data[0] : null;
      if (!employee) {
        return;
      }
      const firstName = employee.firstName ?? employee.FirstName ?? employee.employeeFirstName ?? '';
      const lastName = employee.lastName ?? employee.LastName ?? employee.employeeLastName ?? '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) {
        this.remarkByName = fullName;
        this.cdr.detectChanges();
      }
    });
  }

  getEmployeeNameFromSession(): string {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      return '';
    }
    try {
      const stored = JSON.parse(raw);
      const employee = stored?.employee ?? stored?.Employee;
      const firstName = employee?.firstName ?? employee?.FirstName ?? '';
      const lastName = employee?.lastName ?? employee?.LastName ?? '';
      return `${firstName} ${lastName}`.trim();
    } catch {
      return '';
    }
  }

  loadRemarks() {
    if (!this.customerMeetingID) {
      this.remarkList = [];
      return;
    }

    this.customerMeetingService.getRemarksByCustomerMeetingID(this.customerMeetingID).subscribe(
      data => {
        const rows = this.customerMeetingService.extractRemarks(data);
        this.remarkList = rows.map(row => this.normalizeRemark(row));
        this.cdr.detectChanges();
      },
      (error) => {
        this.remarkList = [];
        const message = typeof error?.error === 'string' ? error.error : 'Failed to load meeting remarks.';
        this.snackBar.open(message, '', { duration: 3000 });
        this.cdr.detectChanges();
      }
    );
  }

  private normalizeRemark(row: any): CustomerMeetingRemark {
    return new CustomerMeetingRemark({
      customerMeetingRemarkID: row?.customerMeetingRemarkID ?? row?.CustomerMeetingRemarkID,
      customerMeetingID: row?.customerMeetingID ?? row?.CustomerMeetingID,
      remarkByID: row?.remarkByID ?? row?.RemarkByID,
      remarkByName: row?.remarkByName ?? row?.RemarkByName,
      remark: row?.remark ?? row?.Remark,
      remarkDate: row?.remarkDate ?? row?.RemarkDate,
      remarkTime: row?.remarkTime ?? row?.RemarkTime,
      activationStatus: true
    });
  }

  confirmSave() {
    if (!this.remarkForm.valid || !this.customerMeetingID) {
      return;
    }

    this.saveDisabled = false;
    const formValue = this.remarkForm.getRawValue();
    const remarkModel = new CustomerMeetingRemark({
      customerMeetingID: this.customerMeetingID,
      remark: (formValue.remark || '').trim(),
      activationStatus: true,
      remarkByID: this._generalService.getUserID(),
      userID: this._generalService.getUserID()
    });

    this.customerMeetingService.addRemark(remarkModel).subscribe(
      () => {
        this._generalService.sendUpdate('CustomerMeetingRemarkCreate:CustomerMeetingView:Success');
        this.remarkForm.patchValue({ remark: '' });
        this.currentRemarkDate = new Date();
        this.currentRemarkTime = new Date();
        this.loadRemarks();
        this.saveDisabled = true;
      },
      (error) => {
        this._generalService.sendUpdate('CustomerMeetingAll:CustomerMeetingView:Failure');
        this.saveDisabled = true;
        const message = typeof error?.error === 'string' ? error.error : 'Failed to save meeting remark.';
        this.snackBar.open(message, '', { duration: 3000 });
      }
    );
  }

  formatRemarkDate(value: any): string {
    if (!value) {
      return '-';
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '-';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatRemarkTime(value: any): string {
    if (!value) {
      return '-';
    }

    if (typeof value === 'string' && value.includes(':') && !value.includes('T')) {
      const parts = value.split(':');
      const hours24 = Number(parts[0]);
      const minutes = String(parts[1] || '0').padStart(2, '0');
      if (isNaN(hours24)) {
        return '-';
      }
      const period = hours24 >= 12 ? 'PM' : 'AM';
      const hours12 = hours24 % 12 || 12;
      return `${String(hours12).padStart(2, '0')}:${minutes} ${period}`;
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '-';
    }
    const hours24 = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    return `${String(hours12).padStart(2, '0')}:${minutes} ${period}`;
  }
}
