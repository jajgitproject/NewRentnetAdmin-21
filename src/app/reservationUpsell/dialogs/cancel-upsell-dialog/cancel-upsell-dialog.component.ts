// @ts-nocheck
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationUpsellService } from '../../reservationUpsell.service';
import { GeneralService } from '../../../general/general.service';
import { CancelUpsellOption } from '../../reservationUpsell.model';

@Component({
  standalone: false,
  selector: 'app-cancel-upsell-dialog',
  templateUrl: './cancel-upsell-dialog.component.html',
  styleUrls: ['./cancel-upsell-dialog.component.scss']
})
export class CancelUpsellDialogComponent {
  isLoading = true;
  singleOption = false;
  targetCategoryName = '';
  options: CancelUpsellOption[] = [];
  selected: CancelUpsellOption | null = null;
  cancelReason = '';

  constructor(
    public dialogRef: MatDialogRef<CancelUpsellDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private upsellService: ReservationUpsellService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.loadOptions();
  }

  loadOptions(): void {
    const userId = this.generalService.getUserID();
    const reservationID = this.data?.reservationID;
    this.upsellService.getCancelOptions(reservationID, userId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.singleOption = !!(res?.singleOption ?? res?.SingleOption);
        this.targetCategoryName = res?.targetCategoryName ?? res?.TargetCategoryName ?? '';
        const rawOptions = res?.options ?? res?.Options ?? [];
        this.options = (rawOptions || []).map(o => new CancelUpsellOption(o));
        if (this.singleOption && this.options.length === 1) {
          this.selected = this.options[0];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        const errMsg = typeof err === 'string' ? err : (err?.error?.message || err?.message);
        this.snackBar.open(errMsg || 'Failed to load cancel options.', 'Close', { duration: 4000 });
        this.cdr.detectChanges();
      }
    });
  }

  restore(): void {
    if (!this.singleOption && !this.selected) {
      this.snackBar.open('Please select a category.', 'Close', { duration: 3000 });
      return;
    }
    const target = this.selected || this.options[0];
    this.isLoading = true;
    this.upsellService.cancelUpsell(this.data.reservationID, {
      userID: this.generalService.getUserID(),
      targetVehicleCategoryID: target.vehicleCategoryID,
      upsellHistoryID: target.upsellHistoryID,
      cancelReason: this.cancelReason
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success === false) {
          this.snackBar.open(res.message || 'Cancel upsell failed.', 'Close', { duration: 4000 });
          this.cdr.detectChanges();
          return;
        }
        this.snackBar.open(res?.message || 'Upsell cancelled.', 'Close', { duration: 3000 });
        this.dialogRef.close({ saved: true });
      },
      error: (err) => {
        this.isLoading = false;
        const errMsg = typeof err === 'string' ? err : (err?.error?.message || err?.message);
        this.snackBar.open(errMsg || 'Cancel upsell failed.', 'Close', { duration: 4000 });
        this.cdr.detectChanges();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
