// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerMeetingService } from '../../customerMeeting.service';
import { CustomerMeeting, CustomerMeetingStatus } from '../../customerMeeting.model';
import { GeneralService } from '../../../general/general.service';
import { CustomerMeetingDropDown } from '../../customerMeetingDropDown.model';

@Component({
  standalone: false,
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.sass']
})
export class StatusDialogComponent {
  dialogTitle = 'Update Meeting Status';
  statusForm: FormGroup;
  saveDisabled: boolean = true;
  meetingStatusList: CustomerMeetingDropDown[] = [
    { value: 'Open', label: 'Open' },
    { value: 'Closed', label: 'Closed' }
  ];
  private currentMeetingStatus = '';
  private currentMeetingStatusRemark = '';

  constructor(
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public customerMeetingService: CustomerMeetingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {
    const row = data.advanceTable || {};
    this.currentMeetingStatus = (row.meetingStatus ?? row.MeetingStatus ?? '').trim();
    this.currentMeetingStatusRemark = (row.meetingStatusRemark ?? row.MeetingStatusRemark ?? '').trim();

    this.statusForm = this.fb.group({
      customerMeetingID: [row.customerMeetingID ?? row.CustomerMeetingID],
      meetingStatus: [this.currentMeetingStatus, Validators.required],
      meetingStatusRemark: [this.currentMeetingStatusRemark, Validators.maxLength(500)]
    });
    this.loadMeetingStatus();
  }

  loadMeetingStatus() {
    this.customerMeetingService.getMeetingStatusForDropDown().subscribe(data => {
      const options = (data || []).map(item => ({
        value: (item.value ?? item.Value ?? '').trim(),
        label: (item.label ?? item.Label ?? '').trim()
      })).filter(item => item.value);

      if (options.length > 0) {
        this.meetingStatusList = options;
      }

      this.statusForm.patchValue({
        meetingStatus: this.currentMeetingStatus,
        meetingStatusRemark: this.currentMeetingStatusRemark
      });
    });
  }

  confirmUpdate() {
    this.saveDisabled = false;
    const formValue = this.statusForm.getRawValue();
    const statusModel = new CustomerMeetingStatus({
      customerMeetingID: formValue.customerMeetingID,
      meetingStatus: formValue.meetingStatus,
      meetingStatusRemark: formValue.meetingStatusRemark,
      userID: this._generalService.getUserID()
    });
    this.customerMeetingService.updateStatus(statusModel).subscribe(
      () => {
        this.dialogRef.close();
        this._generalService.sendUpdate('CustomerMeetingUpdate:CustomerMeetingView:Success');
        this.saveDisabled = true;
      },
      (error) => {
        this._generalService.sendUpdate('CustomerMeetingAll:CustomerMeetingView:Failure');
        this.saveDisabled = true;
        const message = typeof error?.error === 'string' ? error.error : 'Failed to update meeting status.';
        this.snackBar.open(message, '', { duration: 3000 });
      }
    );
  }
}
