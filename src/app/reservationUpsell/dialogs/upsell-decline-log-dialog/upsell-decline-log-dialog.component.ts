// @ts-nocheck
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationUpsellService } from '../../reservationUpsell.service';
import { GeneralService } from '../../../general/general.service';
import { ReservationUpsellDeclineLog } from '../../reservationUpsell.model';

@Component({
  standalone: false,
  selector: 'app-upsell-decline-log-dialog',
  templateUrl: './upsell-decline-log-dialog.component.html',
  styleUrls: ['./upsell-decline-log-dialog.component.scss']
})
export class UpsellDeclineLogDialogComponent {
  isLoading = true;
  rows: ReservationUpsellDeclineLog[] = [];

  constructor(
    public dialogRef: MatDialogRef<UpsellDeclineLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private upsellService: ReservationUpsellService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.loadLog();
  }

  loadLog(): void {
    const reservationID = this.data?.reservationID;
    const userId = this.generalService.getUserID();
    this.isLoading = true;
    this.upsellService.getDeclineLog(reservationID, userId).subscribe({
      next: (res) => {
        this.isLoading = false;
        const list = Array.isArray(res) ? res : (res?.data || []);
        this.rows = (list || []).map(r => new ReservationUpsellDeclineLog(r));
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.rows = [];
        const errMsg = typeof err === 'string' ? err : (err?.error?.message || err?.message);
        this.snackBar.open(errMsg || 'Failed to load upsell decline log.', 'Close', { duration: 4000 });
        this.cdr.detectChanges();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
