// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChangeModeOfPaymentModel } from 'src/app/changeModeOfPayment/changeModeOfPayment.model';
import { ChangeModeOfPaymentService } from 'src/app/changeModeOfPayment/changeModeOfPayment.service';
import { GeneralService } from 'src/app/general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModeOfPaymentDropDown } from 'src/app/supplierContract/modeOfPaymentDropDown.model';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ChangeModeOfPaymentFormDialogComponent {
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable?: ChangeModeOfPaymentModel;
  saveDisabled: boolean = true;

  public PaymentModeList?: ModeOfPaymentDropDown[] = [];
  filteredPaymentModeOptions?: Observable<ModeOfPaymentDropDown[]>;
  paymentModeID: any;
  ReservationID: any;

  constructor(
    public dialogRef: MatDialogRef<ChangeModeOfPaymentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ChangeModeOfPaymentService,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {
    this.dialogTitle = 'Change Mode Of Payment';
    this.ReservationID = data?.advanceTable;
    this.advanceTableForm = this.createContactForm();
  }

  public ngOnInit(): void {
    this.InitPaymentMode();
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      reservationID: [this.ReservationID],
      changeType: ['MOP'],
      newRecordID: [null],
      newRecordName: ['', Validators.required],
      reason: ['']
    });
  }

  submit() {}

  showNotification(colorName: any, text: string, placementFrom: any, placementAlign: any) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Post(): void {
    if (this.advanceTableForm.invalid) {
      this.advanceTableForm.markAllAsTouched();
      return;
    }

    if (!this.ReservationID || this.ReservationID.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please select at least one reservation.',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.saveDisabled = false;
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      (response) => {
        if (response && response?.message) {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: response.message,
            confirmButtonText: 'OK'
          });
          this.saveDisabled = true;
          return;
        }
        this.showNotification(
          'snackbar-success',
          'Mode Of Payment Changed Successfully...!!!',
          'bottom',
          'center'
        );
        this.dialogRef.close(true);
        this.saveDisabled = true;
      },
      (error) => {
        const message = error?.error?.message || 'Operation Failed...!!!';
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: message,
          confirmButtonText: 'OK'
        });
        this.saveDisabled = true;
      }
    );
  }

  InitPaymentMode() {
    this._generalService.GetModeOfPayment().subscribe((data) => {
      this.PaymentModeList = data || [];
      this.advanceTableForm.controls['newRecordName'].setValidators([
        Validators.required,
        this.MOPValidator(this.PaymentModeList)
      ]);
      this.advanceTableForm.controls['newRecordName'].updateValueAndValidity();
      this.filteredPaymentModeOptions = this.advanceTableForm.controls['newRecordName'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filterPaymentMode(value || ''))
      );
    });
  }

  private _filterPaymentMode(value: string) {
    const filterValue = (value || '').toLowerCase();
    return this.PaymentModeList?.filter((data) =>
      data.modeOfPayment.toLowerCase().includes(filterValue)
    );
  }

  MOPValidator(PaymentModeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      if (!value) {
        return { modeOfPaymentInvalid: true };
      }
      const match = PaymentModeList.some(
        (item) => item.modeOfPayment.toLowerCase() === value
      );
      return match ? null : { modeOfPaymentInvalid: true };
    };
  }

  OnPaymentModeSelect(selectedMOP: string) {
    const mop = this.PaymentModeList?.find((data) => data.modeOfPayment === selectedMOP);
    if (mop) {
      this.getPaymentModeID(mop.modeOfPaymentID);
    }
  }

  getPaymentModeID(paymentModeID: any) {
    this.paymentModeID = paymentModeID;
    this.advanceTableForm.patchValue({ newRecordID: this.paymentModeID });
  }
}
