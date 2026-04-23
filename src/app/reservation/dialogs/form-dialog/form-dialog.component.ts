// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';
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
  customerID: any;
  pickupDate: any;
  date: any;
  status: string = '';
  buttonDisabled: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ReservationService,
    private fb: FormBuilder,
  public _generalService: GeneralService) {

    this.dialogTitle = 'Update Pickup Time';
  this.advanceTableCP = data.advanceTable;
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
    this.customerID = data.customerID;
    this.date = this.advanceTableCP.pickup.pickupDate;
    var date = this.date.split('T');
    var endDate = date[0];
    this.pickupDate = endDate;
    this.onPickupDateChange(this.advanceTableCP.pickup.pickupDate)
    this.advanceTable = new UpdatePickupModel({})
    this.advanceTableForm = this.createContactForm();
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
        pickupTime: [''],
        dropOffTime: [''],
        reservationID: [this.advanceTableCP.reservationID]
      });
  }
  public ngOnInit(): void {
    const rawPickupTime = this.advanceTableCP.pickup?.pickupTime;
    let timeDateObject: Date;
    if (rawPickupTime) {
      timeDateObject = moment(rawPickupTime).toDate();
    }
    else {
      timeDateObject = new Date();
    }
    this.advanceTableForm.patchValue({ pickupTime: timeDateObject });
    this.advanceTableForm
      .get('pickupTime')
      ?.valueChanges.pipe(skip(1), takeUntil(this.destroy$))
      .subscribe((val: unknown) => {
        if (val) {
          this.locationTimeSet(val as Date | string);
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

    this.advanceTableForm.patchValue({ reservationID: this.advanceTableCP.reservationID });
    this.advanceTableForm.patchValue({ dropOffTime: this.advanceTable.dropOffTime });
    const payload = this.advanceTableForm.getRawValue();
    this.advanceTableService.updatePickupEdit(payload)
      .subscribe(
        response => {
          this.dialogRef.close(response);
          this.showNotification(
            'snackbar-success',
            'Pickup Time Updated...!!!',
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
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public confirmAdd(): void {
    if (this.buttonDisabled || this.isSubmitting) {
      return; // blocked by status
    }
    this.isSubmitting = true;
    this.Put();
  }
  locationTimeSet(event: Date | string | { pickupTime?: unknown }) {
    const pickupDate = new Date(this.pickupDate);
    const eventTime =
      event && typeof event === 'object' && 'pickupTime' in event && event.pickupTime != null
        ? new Date(event.pickupTime as string | number | Date)
        : new Date(event as string | number | Date);
    const combinedDateTime = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), eventTime.getHours(), eventTime.getMinutes());
    combinedDateTime.setMinutes(combinedDateTime.getMinutes() - 90);
    const locOutDateTime = new Date(combinedDateTime);
    this.getETRDropOffTime();
  }
  getETRDropOffTime() {
    var pickupTime;
    var pickupDate;
    if (this.advanceTableForm.value.pickupTime === "" || this.advanceTableForm.value.pickupTime === undefined) {
      pickupTime = null;
    }
    else {
      pickupTime = moment(this.advanceTableForm.value.pickupTime).format('HH:mm');
      pickupDate = moment(this.pickupDate).format('DD-MM-YYYY');
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
  onPickupDateChange(event: any) {
    var date = event.split('T');
    var endDate = date[0];
    this._generalService.GetContractIDBasedOnDate(this.customerID, endDate).subscribe(
      data => {
        if (data) {
          this.contractID = data;
        }
      });
  }

}



