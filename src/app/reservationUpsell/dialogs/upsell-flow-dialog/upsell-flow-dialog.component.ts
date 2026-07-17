// @ts-nocheck
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationUpsellService } from '../../reservationUpsell.service';
import { GeneralService } from '../../../general/general.service';
import { EligibleUpsellCategory, UpsellDeclineReason } from '../../reservationUpsell.model';

@Component({
  standalone: false,
  selector: 'app-upsell-flow-dialog',
  templateUrl: './upsell-flow-dialog.component.html',
  styleUrls: ['./upsell-flow-dialog.component.scss']
})
export class UpsellFlowDialogComponent {
  step: 'confirm' | 'categories' | 'decline' | 'no-options' = 'confirm';
  isLoading = false;
  yesAttempted = false;
  noOptionsMessage = '';
  eligibleCategories: EligibleUpsellCategory[] = [];
  currentCarCategory = '';
  currentRate = 0;
  selectedCategory: EligibleUpsellCategory | null = null;
  remarks = '';
  declineForm: FormGroup;
  declineReasons: UpsellDeclineReason[] = [];
  filterText = '';

  constructor(
    public dialogRef: MatDialogRef<UpsellFlowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private upsellService: ReservationUpsellService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.declineForm = this.fb.group({
      reasonID: [null, Validators.required],
      comment: ['', Validators.maxLength(500)]
    });
  }

  get filteredCategories(): EligibleUpsellCategory[] {
    const q = (this.filterText || '').trim().toLowerCase();
    if (!q) {
      return this.eligibleCategories;
    }
    return this.eligibleCategories.filter(c =>
      (c.carCategory || '').toLowerCase().includes(q) ||
      (c.vehicleName || '').toLowerCase().includes(q)
    );
  }

  /** Decline (No) is only for reservations with no active upsell history. */
  get canDeclineUpsell(): boolean {
    return !this.data?.hasActiveUpsell && !this.yesAttempted;
  }

  onNo(): void {
    if (!this.canDeclineUpsell) {
      return;
    }
    this.step = 'decline';
    this.isLoading = true;
    const reservationID = this.data?.reservationID;
    this.upsellService.getDeclineReasons(reservationID).subscribe({
      next: (reasons) => {
        this.declineReasons = (reasons || []).map(r => new UpsellDeclineReason(r));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        const errMsg = typeof err === 'string' ? err : (err?.error?.message || err?.message);
        this.showToast(errMsg || 'Failed to load decline reasons.', true);
        this.cdr.detectChanges();
      }
    });
  }

  onYes(): void {
    this.yesAttempted = true;
    this.isLoading = true;
    const userId = this.generalService.getUserID();
    const reservationID = this.data?.reservationID;
    this.upsellService.getEligibleCategories(reservationID, userId).subscribe({
      next: (res) => {
        this.isLoading = false;
        const payload = res?.data || res;
        const categories = payload?.eligibleCategories ?? payload?.EligibleCategories ?? [];
        if (res?.message && (!categories || categories.length === 0)) {
          this.showNoOptions(res.message);
          return;
        }
        this.currentCarCategory = payload.currentCarCategory ?? payload.CurrentCarCategory ?? '';
        this.currentRate = payload.currentRate ?? payload.CurrentRate ?? 0;
        this.eligibleCategories = (categories || []).map(c => new EligibleUpsellCategory(c));
        if (this.eligibleCategories.length === 0) {
          this.showNoOptions('No higher contract category available for this reservation.');
          return;
        }
        this.step = 'categories';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        const errMsg = typeof err === 'string' ? err : (err?.error?.message || err?.message);
        this.showNoOptions(errMsg || 'Failed to load eligible categories.');
      }
    });
  }

  confirmUpsell(): void {
    if (!this.selectedCategory) {
      this.showToast('Please select a category.', true);
      return;
    }
    this.isLoading = true;
    const payload = {
      userID: this.generalService.getUserID(),
      vehicleCategoryID: this.selectedCategory.vehicleCategoryID,
      vehicleID: this.selectedCategory.vehicleID,
      remarks: this.remarks
    };
    this.upsellService.processUpsell(this.data.reservationID, payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success === false) {
          this.showToast(res.message || 'Upsell failed.', true);
          this.cdr.detectChanges();
          return;
        }
        this.showToast(res?.message || 'Upsell completed successfully.');
        this.dialogRef.close({ saved: true });
      },
      error: (err) => {
        this.isLoading = false;
        const errMsg = typeof err === 'string' ? err : (err?.error?.message || err?.message);
        this.showToast(errMsg || 'Upsell failed.', true);
        this.cdr.detectChanges();
      }
    });
  }

  submitDecline(): void {
    if (this.declineForm.invalid) {
      this.declineForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const raw = this.declineForm.value;
    this.upsellService.recordDecline(this.data.reservationID, {
      userID: this.generalService.getUserID(),
      reasonID: raw.reasonID,
      comment: raw.comment
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success === false) {
          this.showToast(res.message || 'Failed to save decline.', true);
          this.cdr.detectChanges();
          return;
        }
        this.showToast('Decline recorded.');
        this.dialogRef.close({ declined: true });
      },
      error: (err) => {
        this.isLoading = false;
        const errMsg = typeof err === 'string' ? err : (err?.error?.message || err?.message);
        this.showToast(errMsg || 'Failed to save decline.', true);
        this.cdr.detectChanges();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  goBackToConfirm(): void {
    if (this.yesAttempted) {
      return;
    }
    this.step = 'confirm';
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  private showNoOptions(message: string): void {
    this.noOptionsMessage = message;
    this.step = 'no-options';
    this.cdr.detectChanges();
  }

  private showToast(message: string, isError = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: isError ? 'snackbar-error' : 'snackbar-success'
    });
  }
}
