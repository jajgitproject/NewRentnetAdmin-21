// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerMeetingService } from '../../customerMeeting.service';
import { CustomerMeeting, CustomerMeetingRemark } from '../../customerMeeting.model';
import { GeneralService } from '../../../general/general.service';
import { CustomerMeetingDropDown } from '../../customerMeetingDropDown.model';
import { CustomerGroupMeetingDropDown } from '../../customerGroupMeetingDropDown.model';
import { RemarkDialogComponent } from '../remark-dialog/remark-dialog.component';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass']
})
export class FormDialogComponent implements OnInit {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerMeeting;
  saveDisabled: boolean = true;
  modeOfMeetingList: CustomerMeetingDropDown[] = [];
  customerGroupControl = new FormControl('');
  filteredCustomerGroupOptions: Observable<CustomerGroupMeetingDropDown[]>;
  selectedCustomerGroupID: number = 0;
  loggedInEmployeeName: string = '';
  remarkList: CustomerMeetingRemark[] = [];
  remarksLoading = false;
  private customerMeetingID = 0;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public customerMeetingService: CustomerMeetingService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    const row = data.advanceTable || {};

    if (this.action === 'view') {
      this.dialogTitle = 'Customer Meeting Details';
      this.customerMeetingID = Number(row.customerMeetingID ?? row.CustomerMeetingID ?? 0);
      this.advanceTable = new CustomerMeeting({
        customerMeetingID: this.customerMeetingID,
        customerGroupID: row.customerGroupID ?? row.CustomerGroupID,
        customerGroup: row.customerGroup ?? row.CustomerGroup,
        employeeID: row.employeeID ?? row.EmployeeID,
        employeeName: row.employeeName ?? row.EmployeeName,
        modeOfMeeting: row.modeOfMeeting ?? row.ModeOfMeeting,
        meetingDate: row.meetingDate ?? row.MeetingDate,
        metWithName: row.metWithName ?? row.MetWithName,
        metWithDesignation: row.metWithDesignation ?? row.MetWithDesignation,
        meetingSubject: row.meetingSubject ?? row.MeetingSubject,
        meetingDetails: row.meetingDetails ?? row.MeetingDetails,
        recordCreatedOnDate: row.recordCreatedOnDate ?? row.RecordCreatedOnDate,
        recordCreatedOnTime: row.recordCreatedOnTime ?? row.RecordCreatedOnTime,
        recordCreatedByName: row.recordCreatedByName ?? row.RecordCreatedByName,
        meetingStatus: row.meetingStatus ?? row.MeetingStatus,
        meetingStatusRemark: row.meetingStatusRemark ?? row.MeetingStatusRemark
      });
    } else {
      this.dialogTitle = 'Customer Meeting';
      this.advanceTable = new CustomerMeeting({});
      this.advanceTable.employeeID = this._generalService.getUserID();
    }

    this.advanceTableForm = this.createContactForm();
    this.initCustomerGroupAutocomplete();
    this.loadModeOfMeeting();
    if (this.action === 'add') {
      this.loadLoggedInEmployeeName();
    }
  }

  ngOnInit() {
    if (this.action === 'view') {
      this.loadRemarks();
    }
  }

  getEmployeeNameFromSession(): string {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      return '';
    }
    try {
      const stored = JSON.parse(raw);
      const employee = stored?.employee ?? stored?.Employee;
      const firstName = employee?.FirstName ?? employee?.firstName ?? '';
      const lastName = employee?.LastName ?? employee?.lastName ?? '';
      return `${firstName} ${lastName}`.trim();
    } catch {
      return '';
    }
  }

  loadLoggedInEmployeeName() {
    const nameFromSession = this.getEmployeeNameFromSession();
    if (nameFromSession) {
      this.loggedInEmployeeName = nameFromSession;
      this.advanceTableForm.patchValue({ employeeName: nameFromSession });
    }

    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(data => {
      const employee = Array.isArray(data) && data.length ? data[0] : null;
      if (!employee) {
        return;
      }
      const firstName =
        employee.firstName ?? employee.FirstName ?? employee.employeeFirstName ?? '';
      const lastName =
        employee.lastName ?? employee.LastName ?? employee.employeeLastName ?? '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) {
        this.loggedInEmployeeName = fullName;
        this.advanceTableForm.patchValue({ employeeName: fullName });
      }
    });
  }

  createContactForm(): FormGroup {
    const isView = this.action === 'view';
    return this.fb.group({
      customerMeetingID: [this.advanceTable.customerMeetingID],
      customerGroupID: [this.advanceTable.customerGroupID, isView ? null : Validators.required],
      customerGroup: [this.advanceTable.customerGroup],
      employeeID: [this.advanceTable.employeeID || this._generalService.getUserID()],
      employeeName: [this.advanceTable.employeeName || this.loggedInEmployeeName || this.getEmployeeNameFromSession()],
      modeOfMeeting: [this.advanceTable.modeOfMeeting, Validators.required],
      meetingDate: [this.advanceTable.meetingDate, Validators.required],
      metWithName: [this.advanceTable.metWithName],
      metWithDesignation: [this.advanceTable.metWithDesignation],
      meetingSubject: [this.advanceTable.meetingSubject, [Validators.required, Validators.maxLength(250)]],
      meetingDetails: [this.advanceTable.meetingDetails, [Validators.required, Validators.maxLength(500)]],
      recordCreatedOnDate: [this.advanceTable.recordCreatedOnDate],
      recordCreatedOnTime: [this.advanceTable.recordCreatedOnTime],
      recordCreatedByName: [this.advanceTable.recordCreatedByName],
      meetingStatus: [this.advanceTable.meetingStatus],
      meetingStatusRemark: [this.advanceTable.meetingStatusRemark]
    });
  }

  initCustomerGroupAutocomplete() {
    const userID = this._generalService.getUserID();
    if (this.advanceTable.customerGroup) {
      this.customerGroupControl.setValue(this.advanceTable.customerGroup);
      this.selectedCustomerGroupID = this.advanceTable.customerGroupID;
    }
    this.filteredCustomerGroupOptions = this.customerGroupControl.valueChanges.pipe(
      debounceTime(300),
      switchMap((value: string) => this.customerMeetingService.getCustomerGroupForDropDownPrefix(userID, value || ''))
    );
  }

  onCustomerGroupSelected(option: CustomerGroupMeetingDropDown) {
    if (option) {
      this.selectedCustomerGroupID = option.customerGroupID;
      this.advanceTableForm.patchValue({
        customerGroupID: option.customerGroupID,
        customerGroup: option.customerGroup
      });
    }
  }

  displayCustomerGroup(option?: CustomerGroupMeetingDropDown): string {
    return option ? option.customerGroup : (this.customerGroupControl.value || '');
  }

  loadModeOfMeeting() {
    this.customerMeetingService.getModeOfMeetingForDropDown().subscribe(data => {
      this.modeOfMeetingList = (data || []).map(item => ({
        value: item.value ?? item.Value,
        label: item.label ?? item.Label
      }));
    });
  }

  loadRemarks() {
    if (!this.customerMeetingID) {
      this.remarkList = [];
      return;
    }

    this.remarksLoading = true;
    this.cdr.detectChanges();
    this.customerMeetingService.getById(this.customerMeetingID).subscribe(
      meeting => {
        const meetingId = Number(meeting?.customerMeetingID ?? meeting?.CustomerMeetingID ?? this.customerMeetingID);
        if (meetingId > 0) {
          this.customerMeetingID = meetingId;
        }

        const embeddedRemarks = this.customerMeetingService.extractRemarks(meeting);
        if (embeddedRemarks.length > 0) {
          this.setRemarkList(embeddedRemarks);
          return;
        }

        this.loadRemarksFromEndpoint();
      },
      () => {
        this.loadRemarksFromEndpoint();
      }
    );
  }

  private loadRemarksFromEndpoint() {
    this.customerMeetingService.getRemarksByCustomerMeetingID(this.customerMeetingID).subscribe(
      data => {
        this.setRemarkList(this.customerMeetingService.extractRemarks(data));
      },
      () => {
        this.setRemarkList([]);
      }
    );
  }

  private setRemarkList(rows: any[]) {
    this.remarkList = (rows || []).map(row => this.normalizeRemark(row));
    this.remarksLoading = false;
    this.cdr.detectChanges();
  }

  openMeetingRemarks() {
    const remarkDialogRef = this.dialog.open(RemarkDialogComponent, {
      width: '820px',
      maxWidth: '96vw',
      data: {
        advanceTable: {
          customerMeetingID: this.customerMeetingID,
          CustomerMeetingID: this.customerMeetingID,
          customerGroup: this.advanceTableForm.get('customerGroup')?.value,
          CustomerGroup: this.advanceTableForm.get('customerGroup')?.value,
          meetingSubject: this.advanceTableForm.get('meetingSubject')?.value,
          MeetingSubject: this.advanceTableForm.get('meetingSubject')?.value
        }
      }
    });

    remarkDialogRef.afterClosed().subscribe(() => {
      this.loadRemarks();
    });
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

  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();
      this.customerGroupControl.setValue('');
      this.selectedCustomerGroupID = 0;
      this.advanceTableForm.patchValue({ employeeID: this._generalService.getUserID() });
      this.loadLoggedInEmployeeName();
    } else {
      this.dialogRef.close();
    }
  }

  public Post(): void {
    const formValue = this.advanceTableForm.getRawValue();
    formValue.customerGroupID = this.selectedCustomerGroupID;
    formValue.meetingDateString = formValue.meetingDate ? formValue.meetingDate.toString() : '';
    this.customerMeetingService.add(formValue).subscribe(
      () => {
        this.dialogRef.close();
        this._generalService.sendUpdate('CustomerMeetingCreate:CustomerMeetingView:Success');
        this.saveDisabled = true;
      },
      () => {
        this._generalService.sendUpdate('CustomerMeetingAll:CustomerMeetingView:Failure');
        this.saveDisabled = true;
      }
    );
  }

  public confirmAdd(): void {
    if (this.action === 'view') {
      this.dialogRef.close();
      return;
    }
    this.saveDisabled = false;
    if (!this.selectedCustomerGroupID) {
      this.advanceTableForm.get('customerGroupID').setErrors({ required: true });
      this.saveDisabled = true;
      return;
    }
    this.Post();
  }
}
