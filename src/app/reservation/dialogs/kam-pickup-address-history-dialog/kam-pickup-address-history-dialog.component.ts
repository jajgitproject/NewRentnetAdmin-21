// @ts-nocheck
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationService } from '../../reservation.service';
import { KamPickupAddressCorrectionHistory, parseKamPickupAddressHistoryValue } from '../../reservation.model';

@Component({
  standalone: false,
  selector: 'app-kam-pickup-address-history-dialog',
  templateUrl: './kam-pickup-address-history-dialog.component.html',
  styleUrls: ['./kam-pickup-address-history-dialog.component.scss']
})
export class KamPickupAddressHistoryDialogComponent {
  isLoading = true;
  rows: KamPickupAddressCorrectionHistory[] = [];

  constructor(
    public dialogRef: MatDialogRef<KamPickupAddressHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservationID: number },
    private reservationService: ReservationService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.loadHistory();
  }

  loadHistory(): void {
    const reservationID = this.data?.reservationID;
    if (!reservationID) {
      this.isLoading = false;
      this.rows = [];
      return;
    }

    this.isLoading = true;
    this.reservationService.getKamPickupAddressCorrectionHistory(reservationID).subscribe({
      next: (res) => {
        this.isLoading = false;
        const list = Array.isArray(res) ? res : (res?.data || []);
        this.rows = (list || []).map((r) => new KamPickupAddressCorrectionHistory(r));
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.rows = [];
        const errMsg = typeof err === 'string' ? err : (err?.error?.message || err?.message);
        this.snackBar.open(errMsg || 'Failed to load pickup address correction history.', 'Close', { duration: 4000 });
        this.cdr.detectChanges();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  parseAddress(value: string | null | undefined): { geo: string; details: string } {
    return parseKamPickupAddressHistoryValue(value);
  }

  hasAddressContent(parts: { geo: string; details: string }): boolean {
    return !!(parts?.geo || parts?.details);
  }
}
