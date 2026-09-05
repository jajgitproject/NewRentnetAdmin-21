// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { ReservationService } from '../../reservation.service';
import { Reservation, UpdatePickupModel } from '../../reservation.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { ControlPanelDetails } from 'src/app/controlPanelDesign/controlPanelDesign.model';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTableCP: ControlPanelDetails;
  advanceTable: UpdatePickupModel;
  /** True while API save is in progress */
  isSubmitting = false;
  indeterminate = false;
  labelPosition: 'before' | 'before' = 'before';
  contractID: any;
  pickupDate: any;
  date: any;
  status: string = '';
   isTNCSelected:boolean = false;
  buttonDisabled: boolean = false;
  customerID: number;
  noReservationMessage: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ReservationService,
    private fb: FormBuilder,
  public _generalService: GeneralService) {

    this.dialogTitle = 'Update Pickup Date & Time';
  this.advanceTableCP = data.advanceTable;
  this.customerID = this.advanceTableCP.customerID;
  // status extraction (string or nested)
  // this.status = this.extractStatus(data?.status);
  // const normalized = (this.status || '').trim().toLowerCase();
  // this.buttonDisabled = normalized !== 'changes allow';
  this.status = this.extractStatus(data?.status);

// normalize (safe compare)
const normalized = (this.status || '').trim().toLowerCase();

// Only block when status was supplied and is not "changes allow" (e.g. Control Panel Design omits status)
    this.buttonDisabled = normalized.length > 0 && normalized !== 'changes allow';

// debug
    this.customerID = data.customerID ?? this.advanceTableCP.customerID;
    this.date = this.advanceTableCP.pickup.pickupDate;
    this.pickupDate = this.normalizePickupDateValue(this.date);
    this.advanceTable = new UpdatePickupModel({})
    this.advanceTableForm = this.createContactForm();
    this.onPickupDateChange(this.pickupDate);
  }
  private extractStatus(input: any): string {
    try {
      if (typeof input === 'string') return input;
      if (input && typeof input.status === 'string') return input.status;
      if (input && input.status && typeof input.status.status === 'string') return input.status.status;
      return '';
    } catch { return ''; }
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        pickupDate: [this.pickupDate ? new Date(this.pickupDate) : null, Validators.required],
        pickupTime: [this.advanceTableCP.pickup.pickupTime],
        dropOffTime: [''],
        isTimeNotConfirmed:[this.advanceTableCP.isTimeNotConfirmed],
        reservationID: [this.advanceTableCP.reservationID] ,
        customerID: [this.advanceTableCP.customerID]
      });
  }
  public ngOnInit(): void {

    if(this.advanceTableCP.isTimeNotConfirmed){
      this.isTNCSelected = true;
      this.advanceTableForm.get('pickupTime').setValue('');
      this.advanceTableForm.get('dropOffTime').setValue('');
      this.advanceTableForm.get('pickupTime').disable();
    }
    
    this.advanceTableForm.get('pickupTime')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: unknown) => {
    if (val) {
      this.locationTimeSet(val as Date | string);
      this.getETRDropOffTime();
    }
  });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit(): void {
    this.confirmAdd();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  public Put(): void {
    this.advanceTableForm.patchValue({isTimeNotConfirmed:this.isTNCSelected});
    this.advanceTableForm.patchValue({ reservationID: this.advanceTableCP.reservationID });
    this.advanceTableForm.patchValue({ dropOffTime: this.advanceTable.dropOffTime });
    const payload = this.advanceTableForm.getRawValue();
    payload.pickupDate = payload.pickupDate ?? this.pickupDate ?? this.advanceTableCP.pickup?.pickupDate;
    payload.userID = this._generalService.getUserID();
    this.advanceTableService.updatePickupEdit(payload)
      .subscribe(
        response => {
            this.dialogRef.close(response);
          this.showNotification(
            'snackbar-success',
            'Pickup Date & Time Updated...!!!',
            'bottom',
            'center'
          );
          this.isSubmitting = false;
        },
        (error: any) => {
          this.showNotification(
            'snackbar-danger',
            'Operation Failed.....!!!',
            'bottom',
            'center'
          );
          this.isSubmitting = false;

        }
      )
  }
  onTNCChange(checked: any)
{
  //const isChecked = event.target.checked;
  const pickupControl = this.advanceTableForm.get('pickupTime');
  if (checked === true) 
  {
    this.isTNCSelected = true;
    this.advanceTableForm.get('pickupTime').setValue(null);
    this.advanceTableForm.get('dropOffTime').setValue(null);
    pickupControl?.disable();
  }
  else
  {
    pickupControl?.enable();
    this.isTNCSelected = false;
  }
}
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public confirmAdd(): void {
    if (this.buttonDisabled || this.isSubmitting || this.noReservationMessage) {
      return; // blocked by status or missing contract
    }
    this.isSubmitting = true;
    this.Put();
  }
  locationTimeSet(event: Date | string | { pickupTime?: unknown }) {
    const pickupDateValue = this.advanceTableForm?.get('pickupDate')?.value ?? this.pickupDate;
    const pickupDate = new Date(pickupDateValue);
    const eventTime =
      event && typeof event === 'object' && 'pickupTime' in event && event.pickupTime != null
        ? new Date(event.pickupTime as string | number | Date)
        : new Date(event as string | number | Date);
    const combinedDateTime = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), eventTime.getHours(), eventTime.getMinutes());
    combinedDateTime.setMinutes(combinedDateTime.getMinutes() - 90);
    const locOutDateTime = new Date(combinedDateTime);
  }
  getETRDropOffTime() {
    var pickupTime;
    var pickupDate;
    const formPickupTime = this.advanceTableForm.getRawValue().pickupTime;
    const formPickupDate = this.advanceTableForm.getRawValue().pickupDate ?? this.pickupDate;
    if (formPickupTime === "" || formPickupTime === undefined || formPickupTime === null) {
      pickupTime = null;
    }
    else {
      pickupTime = moment(formPickupTime).format('HH:mm');
      pickupDate = moment(formPickupDate).format('DD-MM-YYYY');
    }
    if (!this.contractID || pickupTime == null) {
      return;
    }
    this.advanceTableService.getTimeForDropoffTime(this.advanceTableCP.package.packageID, pickupTime, pickupDate, this.contractID, this.advanceTableCP.vehicle.vehicleID, this.advanceTableCP.pickupCityID).pipe(takeUntil(this.destroy$)).subscribe(
      (data: any) => {
        if (data.packageType === 'Local On Demand' || data.packageType === 'Long Term Rental' || data.packageType === 'Outstation Lumpsum' || data.packageType === 'Outstation OneWay Trip' || data.packageType === 'Outstation Round Trip') {
          this.advanceTable.dropOffTime = null;
        }
        else {
          var dropOffTime = data.dropOffTime;
          dropOffTime = moment(dropOffTime, 'HH:mm').toDate();
          this.advanceTable.dropOffTime = dropOffTime;
        }
      });
  }

  onPickupDateFormChange(event: any): void {
    const value = event?.value ?? this.advanceTableForm.get('pickupDate')?.value;
    this.onPickupDateChange(value);
    const pickupTime = this.advanceTableForm.getRawValue().pickupTime;
    if (pickupTime) {
      this.locationTimeSet(pickupTime);
    }
  }

  onPickupDateChange(event: any) {
    const endDate = this.normalizePickupDateValue(event);
    if (!endDate) {
      return;
    }
    this.pickupDate = endDate;
    this._generalService.GetContractIDBasedOnDate(this.customerID, endDate).subscribe(
      data => {
        if (data) {
          this.contractID = data;
          this.noReservationMessage = false;
          this.getETRDropOffTime();
        } else {
          this.contractID = null;
          this.noReservationMessage = true;
        }
      });
  }

  private normalizePickupDateValue(value: any): string {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return moment(value).format('YYYY-MM-DD');
    }
    const asString = String(value);
    if (asString.includes('T')) {
      return asString.split('T')[0];
    }
    if (asString.includes('/')) {
      const parts = asString.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    return moment(value).isValid() ? moment(value).format('YYYY-MM-DD') : asString;
  }

}
