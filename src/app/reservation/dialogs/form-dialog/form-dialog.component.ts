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
    // #region agent log
    fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'445479'},body:JSON.stringify({sessionId:'445479',hypothesisId:'H1,H2,H3',location:'form-dialog.component.ts:Put.entry',message:'Put() invoked - form state before service call',data:{reservationID:payload?.reservationID,pickupTimeType:typeof payload?.pickupTime,pickupTimeStr:payload?.pickupTime?String(payload.pickupTime):null,pickupTimeIsDate:payload?.pickupTime instanceof Date,dropOffTimeType:typeof payload?.dropOffTime,dropOffTimeStr:payload?.dropOffTime?String(payload.dropOffTime):String(payload?.dropOffTime),dropOffTimeIsDate:payload?.dropOffTime instanceof Date,advanceTableDropOffTime:this.advanceTable?.dropOffTime?String(this.advanceTable.dropOffTime):String(this.advanceTable?.dropOffTime),contractID:this.contractID,customerID:this.customerID,status:this.status,buttonDisabled:this.buttonDisabled,payloadKeys:Object.keys(payload||{})},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    this.advanceTableService.updatePickupEdit(payload)
      .subscribe(
        response => {
          // #region agent log
          fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'445479'},body:JSON.stringify({sessionId:'445479',hypothesisId:'H4,H5',location:'form-dialog.component.ts:Put.success',message:'PUT EditPickupTime succeeded',data:{response:response},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
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
          // #region agent log
          fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'445479'},body:JSON.stringify({sessionId:'445479',hypothesisId:'H4,H5',location:'form-dialog.component.ts:Put.error',message:'PUT EditPickupTime failed',data:{status:error?.status,statusText:error?.statusText,url:error?.url,name:error?.name,message:error?.message,ok:error?.ok,errorBodyType:typeof error?.error,errorBody:(typeof error?.error==='string'?error.error.slice(0,2000):error?.error),headers:error?.headers?.keys?error.headers.keys():null},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
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
    // #region agent log
    fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'445479'},body:JSON.stringify({sessionId:'445479',hypothesisId:'H1,H2',location:'form-dialog.component.ts:getETRDropOffTime.request',message:'requesting dropoff time',data:{pickupTime,pickupDate,contractID:this.contractID,packageID:this.advanceTableCP?.package?.packageID,vehicleID:this.advanceTableCP?.vehicle?.vehicleID,pickupCityID:this.advanceTableCP?.pickupCityID},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    this.advanceTableService.getTimeForDropoffTime(this.advanceTableCP.package.packageID, pickupTime, pickupDate, this.contractID, this.advanceTableCP.vehicle.vehicleID, this.advanceTableCP.pickupCityID).pipe(takeUntil(this.destroy$)).subscribe(
      (data: any) => {
        // #region agent log
        fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'445479'},body:JSON.stringify({sessionId:'445479',hypothesisId:'H1,H2',location:'form-dialog.component.ts:getETRDropOffTime.response',message:'dropoff time resolved',data:{packageType:data?.packageType,rawDropOffTime:data?.dropOffTime},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        if (data.packageType === 'Local On Demand' || data.packageType === 'Long Term Rental' || data.packageType === 'Outstation Lumpsum' || data.packageType === 'Outstation OneWay Trip' || data.packageType === 'Outstation Round Trip') {
          this.advanceTable.dropOffTime = null;
        }
        else {
          var dropOffTime = data.dropOffTime;
          dropOffTime = moment(dropOffTime, 'HH:mm').toDate();
          this.advanceTable.dropOffTime = dropOffTime;
        }
        // #region agent log
        fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'445479'},body:JSON.stringify({sessionId:'445479',hypothesisId:'H1',location:'form-dialog.component.ts:getETRDropOffTime.afterSet',message:'advanceTable.dropOffTime after set',data:{dropOffTimeStr:this.advanceTable?.dropOffTime?String(this.advanceTable.dropOffTime):String(this.advanceTable?.dropOffTime),isDate:this.advanceTable?.dropOffTime instanceof Date},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
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
        // #region agent log
        fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'445479'},body:JSON.stringify({sessionId:'445479',hypothesisId:'H2',location:'form-dialog.component.ts:onPickupDateChange.response',message:'contractID resolved',data:{customerID:this.customerID,endDate,contractID:this.contractID,rawData:data},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
      });
  }

}



