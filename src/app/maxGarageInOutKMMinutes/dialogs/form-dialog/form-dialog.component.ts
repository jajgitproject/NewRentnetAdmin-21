// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../general/general.service';
import { PackageTypeDropDown } from '../../../packageType/packageTypeDropDown.model';
import { MaxGarageInOutKMMinutes } from '../../maxGarageInOutKMMinutes.model';
import { MaxGarageInOutKMMinutesService } from '../../maxGarageInOutKMMinutes.service';

@Component({
  standalone: false,
  selector: 'app-max-garage-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass']
})
export class FormDialogComponent implements OnInit {
  dialogTitle = 'Max Garage In/Out KM/Minutes';
  recordForm: FormGroup;
  packageTypeList: PackageTypeDropDown[] = [];
  isSaving = false;
  isPackageTypeLoading = false;
  customerContractID: number;

  private readonly nonNegativeIntPattern = /^[0-9]+$/;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private maxGarageService: MaxGarageInOutKMMinutesService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {
    this.customerContractID = Number(data?.customerContractID) || 0;
    const employeeId = this._generalService.getUserID();
    this.recordForm = this.fb.group({
      packageTypeID: [null, Validators.required],
      maximumGarageToPickupKMs: [
        null,
        [Validators.required, Validators.min(0), Validators.pattern(this.nonNegativeIntPattern)]
      ],
      maximumGarageToPickupMinutes: [
        null,
        [Validators.required, Validators.min(0), Validators.pattern(this.nonNegativeIntPattern)]
      ],
      maximumDropoffToGarageKMs: [
        null,
        [Validators.required, Validators.min(0), Validators.pattern(this.nonNegativeIntPattern)]
      ],
      maximumDropoffToGarageMinutes: [
        null,
        [Validators.required, Validators.min(0), Validators.pattern(this.nonNegativeIntPattern)]
      ],
      activationStatus: [{ value: true, disabled: true }],
      createdByID: [{ value: employeeId, disabled: true }],
      creationDate: [{ value: moment().format('DD-MM-YYYY'), disabled: true }],
      creationTime: [{ value: moment().format('hh:mm A'), disabled: true }]
    });
  }

  ngOnInit(): void {
    this.loadPackageTypes();
  }

  loadPackageTypes(): void {
    this.isPackageTypeLoading = true;
    this._generalService.GetPackageType().subscribe(
      (data) => {
        this.packageTypeList = data || [];
        this.isPackageTypeLoading = false;
      },
      (error) => {
        this.packageTypeList = [];
        this.isPackageTypeLoading = false;
        this.showNotification(
          'snackbar-danger',
          this.toErrorMessage(error, 'Failed to load Package Types.'),
          'bottom',
          'center'
        );
      }
    );
  }

  resetForm(): void {
    const employeeId = this._generalService.getUserID();
    this.recordForm.reset({
      packageTypeID: null,
      maximumGarageToPickupKMs: null,
      maximumGarageToPickupMinutes: null,
      maximumDropoffToGarageKMs: null,
      maximumDropoffToGarageMinutes: null,
      activationStatus: true,
      createdByID: employeeId,
      creationDate: moment().format('DD-MM-YYYY'),
      creationTime: moment().format('hh:mm A')
    });
    this.recordForm.get('activationStatus')?.disable();
    this.recordForm.get('createdByID')?.disable();
    this.recordForm.get('creationDate')?.disable();
    this.recordForm.get('creationTime')?.disable();
  }

  save(): void {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      this.showNotification(
        'snackbar-danger',
        'Please fill all required fields with valid non-negative values.',
        'bottom',
        'center'
      );
      return;
    }

    if (!this.customerContractID || this.customerContractID <= 0) {
      this.showNotification(
        'snackbar-danger',
        'Customer Contract context is missing. Open this page from Customer Contract.',
        'bottom',
        'center'
      );
      return;
    }

    const employeeId = this._generalService.getUserID();
    if (!employeeId || employeeId <= 0) {
      this.showNotification(
        'snackbar-danger',
        'Logged-in employee could not be identified.',
        'bottom',
        'center'
      );
      return;
    }

    const payload = this.buildPayload(false);
    this.isSaving = true;
    this.maxGarageService.getActiveByPackageTypeID(this.customerContractID, payload.packageTypeID).subscribe(
      (existing) => {
        if (existing && existing.customerContractMaxG2GKMMinutesID > 0) {
          this.isSaving = false;
          this.promptReplace();
          return;
        }
        this.attemptSave(payload);
      },
      () => {
        this.attemptSave(payload);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  private buildPayload(confirmReplace: boolean): MaxGarageInOutKMMinutes {
    const raw = this.recordForm.getRawValue();
    return new MaxGarageInOutKMMinutes({
      customerContractID: this.customerContractID,
      packageTypeID: Number(raw.packageTypeID),
      maximumGarageToPickupKMs: Number(raw.maximumGarageToPickupKMs),
      maximumGarageToPickupMinutes: Number(raw.maximumGarageToPickupMinutes),
      maximumDropoffToGarageKMs: Number(raw.maximumDropoffToGarageKMs),
      maximumDropoffToGarageMinutes: Number(raw.maximumDropoffToGarageMinutes),
      confirmReplace
    });
  }

  private attemptSave(payload: MaxGarageInOutKMMinutes): void {
    this.isSaving = true;
    this.maxGarageService.add(payload).subscribe(
      (response) => {
        if (response?.code === 'ConfirmReplaceRequired') {
          this.isSaving = false;
          this.promptReplace();
          return;
        }
        this.isSaving = false;
        this.showNotification('snackbar-success', 'Record saved successfully.', 'bottom', 'center');
        this.dialogRef.close(true);
      },
      (error) => {
        this.isSaving = false;
        const message = this.toErrorMessage(error, 'Failed to save record. Please try again.');
        if (this.isReplaceRequiredMessage(message)) {
          this.promptReplace();
          return;
        }
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  private promptReplace(): void {
    Swal.fire({
      title: 'Existing Package Record',
      text:
        'A record already exists for the same Package Type. Do you want to add a new record? If you continue, the previous record will be ended and replaced with the new record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Replace',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.attemptSave(this.buildPayload(true));
    });
  }

  private isReplaceRequiredMessage(message: string): boolean {
    const text = (message || '').toLowerCase();
    return text.includes('confirmreplacerequired') || text.includes('already exists for the same package type');
  }

  private toErrorMessage(error: any, fallback: string): string {
    if (typeof error === 'string' && error.trim()) {
      return error;
    }
    if (typeof error?.error === 'string' && error.error.trim()) {
      return error.error;
    }
    if (typeof error?.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }
    if (typeof error?.message === 'string' && error.message.trim()) {
      return error.message;
    }
    return fallback;
  }

  showNotification(colorName, text, placementFrom, placementAlign): void {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
