// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-changeModeOfPaymentDetails',
  templateUrl: './changeModeOfPaymentDetails.component.html',
  styleUrls: ['./changeModeOfPaymentDetails.component.sass']
})
export class ChangeModeOfPaymentDetailsComponent {
  dataSourceForMOP: any[] = [];
  dialogTitle = 'Mode Of Payment Change Log';
  ReservationID: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ChangeModeOfPaymentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ReservationID = data?.reservationID ?? data?.ReservationID ?? null;
    this.dataSourceForMOP = Array.isArray(data?.logs) ? data.logs : [];
  }

  formatDate(value: any): string {
    if (!value) {
      return 'N/A';
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      return String(value);
    }
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  formatTime(value: any): string {
    if (!value) {
      return 'N/A';
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      return String(value);
    }
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${mi}:${ss}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
