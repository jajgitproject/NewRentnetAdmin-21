// @ts-nocheck
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  private static readonly DIALOG_WIDTH_PX = 880;

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
    public _generalService: GeneralService,
    private cdr: ChangeDetectorRef
  ) {
    this.customerContractID = Number(data?.customerContractID) || 0;
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
      activationStatus: [{ value: true, disabled: true }]
    });
  }

  ngOnInit(): void {
    this.loadPackageTypes();
    this.dialogRef.afterOpened().subscribe(() => this.lockDialogWidth());
  }

  onPackageTypePanelToggle(_opened: boolean): void {
    this.lockDialogWidth();
  }

  private lockDialogWidth(): void {
    const widthPx = Math.min(FormDialogComponent.DIALOG_WIDTH_PX, window.innerWidth - 32);
    const width = `${widthPx}px`;
    this.dialogRef.updateSize(width, undefined);

    const overlayPane = this.getDialogOverlayPane();
    if (!overlayPane) {
      return;
    }

    overlayPane.style.setProperty('width', width, 'important');
    overlayPane.style.setProperty('min-width', width, 'important');
    overlayPane.style.setProperty('max-width', width, 'important');
  }

  private getDialogOverlayPane(): HTMLElement | null {
    const ref = this.dialogRef as { _overlayRef?: { overlayElement?: HTMLElement } };
    return ref?._overlayRef?.overlayElement ?? null;
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
    this.resetSavingState();
    this.recordForm.reset({
      packageTypeID: null,
      maximumGarageToPickupKMs: null,
      maximumGarageToPickupMinutes: null,
      maximumDropoffToGarageKMs: null,
      maximumDropoffToGarageMinutes: null,
      activationStatus: true
    });
    this.recordForm.get('activationStatus')?.disable();
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
    this.setSavingState();
    this.maxGarageService.getActiveByPackageTypeID(this.customerContractID, payload.packageTypeID).subscribe(
      (existing) => {
        if (existing && existing.customerContractMaxG2GKMMinutesID > 0) {
          this.resetSavingState();
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
    this.resetSavingState();
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
    this.setSavingState();
    this.maxGarageService.add(payload).subscribe(
      (response) => {
        if (response?.code === 'ConfirmReplaceRequired') {
          this.resetSavingState();
          this.promptReplace();
          return;
        }
        this.resetSavingState();
        this.showNotification('snackbar-success', 'Record saved successfully.', 'bottom', 'center');
        this.dialogRef.close(true);
      },
      (error) => {
        const message = this.toErrorMessage(error, 'Failed to save record. Please try again.');
        if (this.isReplaceRequiredMessage(message)) {
          this.resetSavingState();
          this.promptReplace();
          return;
        }
        this.resetSavingState();
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  private promptReplace(): void {
    this.resetSavingState();
    Swal.fire({
      title: 'Existing Package Record',
      text:
        'A record already exists for the same Package Type. Do you want to add a new record? If you continue, the previous record will be ended and replaced with the new record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Replace',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      focusConfirm: false
    }).then((result) => {
      if (!result.isConfirmed) {
        this.resetSavingState();
        return;
      }
      this.attemptSave(this.buildPayload(true));
    });
  }

  private resetSavingState(): void {
    this.isSaving = false;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  private setSavingState(): void {
    this.isSaving = true;
    this.cdr.markForCheck();
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
