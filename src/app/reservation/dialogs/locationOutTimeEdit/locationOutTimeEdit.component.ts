// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { ReservationService } from '../../reservation.service';
import { UpdatePickupModel } from '../../reservation.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { ControlPanelDetails } from 'src/app/controlPanelDesign/controlPanelDesign.model';

@Component({
  standalone: false,
    selector: 'app-locationOutTimeEdit',
    templateUrl: './locationOutTimeEdit.component.html',
    styleUrls: ['./locationOutTimeEdit.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class LocationOutTimeEditComponent implements OnInit, OnDestroy {
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
    public dialogRef: MatDialogRef<LocationOutTimeEditComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ReservationService,
    private fb: FormBuilder,
  public _generalService: GeneralService) {

    this.dialogTitle = 'Update Location Out Date & Time';
  this.advanceTableCP = data.advanceTable;
  this.status = this.extractStatus(data?.status);

  const normalized = (this.status || '').trim().toLowerCase();

  // Only block when status was supplied and is not "changes allow"
    this.buttonDisabled = normalized.length > 0 && normalized !== 'changes allow';

    this.customerID = data.customerID;
    this.date = this.advanceTableCP?.pickup?.pickupDate;
    if (this.date) {
      var date = String(this.date).split('T');
      this.pickupDate = date[0];
    }
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
    const existingDate = this.resolveExistingLocationOutDate();
    return this.fb.group(
      {
        locationOutDate: [existingDate ? new Date(existingDate) : null, Validators.required],
        locationOutTime: [this.resolveExistingLocationOutTime(), Validators.required],
        reservationID: [this.advanceTableCP?.reservationID]
      });
  }

  /**
   * Prefer Reservation.LocationOutTime (reservationLocationOutTime).
   * Control panel item.locationOutTime is DutySlip and is often empty before dispatch.
   */
  private resolveExistingLocationOutTime(): Date | null {
    const raw =
      (this.advanceTableCP as any)?.reservationLocationOutTime ??
      (this.advanceTableCP as any)?.ReservationLocationOutTime ??
      null;

    return this.toOwlTimeDate(raw);
  }

  private resolveExistingLocationOutDate(): string | null {
    const raw =
      (this.advanceTableCP as any)?.reservationLocationOutDate ??
      (this.advanceTableCP as any)?.ReservationLocationOutDate ??
      (this.advanceTableCP as any)?.locationOutDate ??
      null;

    return this.normalizeDateValue(raw);
  }

  /** Parse API/control-panel time and normalize onto today so owl timer displays it. */
  private toOwlTimeDate(raw: any): Date | null {
    if (raw === null || raw === undefined || raw === '') {
      return null;
    }

    let parsed: moment.Moment | null = null;

    if (raw instanceof Date && !isNaN(raw.getTime())) {
      parsed = moment(raw);
    } else if (typeof raw === 'string' || typeof raw === 'number') {
      parsed = moment(raw);
      if (!parsed.isValid()) {
        parsed = moment(raw, ['HH:mm:ss', 'HH:mm', 'h:mm A', 'hh:mm A'], true);
      }
    }

    if (!parsed || !parsed.isValid()) {
      return null;
    }

    const normalized = new Date();
    normalized.setHours(parsed.hours(), parsed.minutes(), parsed.seconds(), 0);
    return normalized;
  }

  private normalizeDateValue(value: any): string | null {
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
    return moment(value).isValid() ? moment(value).format('YYYY-MM-DD') : null;
  }

  public ngOnInit(): void {
    const existingTime = this.resolveExistingLocationOutTime();
    const existingDate = this.resolveExistingLocationOutDate();
    if (existingTime || existingDate) {
      this.advanceTableForm.patchValue({
        locationOutTime: existingTime ?? this.advanceTableForm.get('locationOutTime')?.value,
        locationOutDate: existingDate ? new Date(existingDate) : this.advanceTableForm.get('locationOutDate')?.value
      });
    }

    // Reload Reservation Location Out Date/Time from booking details (Reservation table).
    const reservationID = this.advanceTableCP?.reservationID;
    if (!reservationID) {
      return;
    }
    this.advanceTableService.getBookingDetails(reservationID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          const row = Array.isArray(data) ? data[0] : data;
          const reservationTime = this.toOwlTimeDate(
            row?.locationOutTime ?? row?.locationOutTimeString
          );
          const reservationDate = this.normalizeDateValue(
            row?.locationOutDate ?? row?.locationOutDateString
          );
          const patch: any = {};
          if (reservationTime) {
            patch.locationOutTime = reservationTime;
          }
          if (reservationDate) {
            patch.locationOutDate = new Date(reservationDate);
          }
          if (Object.keys(patch).length) {
            this.advanceTableForm.patchValue(patch);
          }
        },
        () => { /* keep any value already resolved from dialog data */ }
      );
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
    const formValue = this.advanceTableForm.getRawValue();
    const payload = {
      reservationID: this.advanceTableCP.reservationID,
      locationOutDate: formValue.locationOutDate,
      locationOutTime: formValue.locationOutTime,
    };
    this.advanceTableService.updateLocationOutEdit(payload)
      .subscribe(
        response => {
          this.dialogRef.close(response);
          this.showNotification(
            'snackbar-success',
            'Location Out Date & Time Updated...!!!',
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
}
