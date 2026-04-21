// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
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

export class FormDialogComponent {
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTableCP: ControlPanelDetails;
  advanceTable: UpdatePickupModel;
  saveDisabled: boolean = true;
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

// button logic
this.buttonDisabled = normalized !== 'changes allow';

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
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  public Put(): void {

    this.advanceTableForm.patchValue({ reservationID: this.advanceTableCP.reservationID });
    this.advanceTableForm.patchValue({ dropOffTime: this.advanceTable.dropOffTime });
    this.advanceTableService.updatePickupEdit(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close(response);
          this.showNotification(
            'snackbar-success',
            'Pickup Time Updated...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
        },
        error => {

          this.showNotification(
            'snackbar-danger',
            'Operation Failed.....!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;

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
    if (this.buttonDisabled) {
      return; // blocked by status
    }
    this.saveDisabled = false;
    this.Put();
  }
  locationTimeSet(event) {
    const pickupDate = new Date(this.pickupDate);
    const eventTime = new Date(event.pickupTime);
    const combinedDateTime = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), eventTime.getHours(), eventTime.getMinutes());
    combinedDateTime.setMinutes(combinedDateTime.getMinutes() - 90);
    const locOutDateTime = new Date(combinedDateTime);
    this.getETRDropOffTime();
  }
  getETRDropOffTime() {
    debugger
    var pickupTime;
    var pickupDate;
    if (this.advanceTableForm.value.pickupTime === "" || this.advanceTableForm.value.pickupTime === undefined) {
      pickupTime = null;
    }
    else {
      pickupTime = moment(this.advanceTableForm.value.pickupTime).format('HH:mm');
      pickupDate = moment(this.pickupDate).format('DD-MM-YYYY');
    }

    this.advanceTableService.getTimeForDropoffTime(this.advanceTableCP.package.packageID, pickupTime, pickupDate, this.contractID, this.advanceTableCP.vehicle.vehicleID, this.advanceTableCP.pickupCityID).subscribe(
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



