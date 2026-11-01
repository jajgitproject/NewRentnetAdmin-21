// @ts-nocheck
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationUpsellService } from '../../reservationUpsell.service';
import { GeneralService } from '../../../general/general.service';
import { ReservationUpsellHistory } from '../../reservationUpsell.model';

@Component({
  standalone: false,
  selector: 'app-upsell-history-dialog',
  templateUrl: './upsell-history-dialog.component.html',
  styleUrls: ['./upsell-history-dialog.component.scss']
})
export class UpsellHistoryDialogComponent {
  isLoading = true;
  rows: ReservationUpsellHistory[] = [];

  constructor(
    public dialogRef: MatDialogRef<UpsellHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private upsellService: ReservationUpsellService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.loadHistory();
  }

  loadHistory(): void {
    const reservationID = this.data?.reservationID;
    const userId = this.generalService.getUserID();
    this.isLoading = true;
    this.upsellService.getUpsellHistory(reservationID, userId).subscribe({
      next: (res) => {
        this.isLoading = false;
        const list = Array.isArray(res) ? res : (res?.data || []);
        this.rows = (list || []).map(r => new ReservationUpsellHistory(r));
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.rows = [];
        const errMsg = typeof err === 'string' ? err : (err?.error?.message || err?.message);
        this.snackBar.open(errMsg || 'Failed to load upsell history.', 'Close', { duration: 4000 });
        this.cdr.detectChanges();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
