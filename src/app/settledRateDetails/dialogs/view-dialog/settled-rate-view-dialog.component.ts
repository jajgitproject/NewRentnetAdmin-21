// @ts-nocheck
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { SettledRateDetailsService } from '../../settledRateDetails.service';
import { SettledRateDetails } from '../../settledRateDetails.model';

@Component({
  standalone: false,
  selector: 'app-settled-rate-view-dialog',
  templateUrl: './settled-rate-view-dialog.component.html',
  styleUrls: ['./settled-rate-view-dialog.component.scss']
})
export class SettledRateViewDialogComponent {
  isLoading = true;
  advanceTableSRD: SettledRateDetails[] = [];
  reservationID: number;

  constructor(
    public dialogRef: MatDialogRef<SettledRateViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservationID: number },
    private settledRateDetailsService: SettledRateDetailsService,
    private cdr: ChangeDetectorRef
  ) {
    this.reservationID = data?.reservationID;
    this.loadData();
  }

  loadData(): void {
    if (!this.reservationID) {
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }
    this.isLoading = true;
    this.settledRateDetailsService.getTableData(this.reservationID, true, 0).subscribe({
      next: (data: any) => {
        this.advanceTableSRD = this.toArray<SettledRateDetails>(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (_error: HttpErrorResponse) => {
        this.advanceTableSRD = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  private toArray<T>(value: any): T[] {
    if (Array.isArray(value)) {
      return value;
    }
    if (value === null || value === undefined) {
      return [];
    }
    if (typeof value === 'object') {
      if (Array.isArray(value.data)) {
        return value.data as T[];
      }
      if (Array.isArray(value.result)) {
        return value.result as T[];
      }
      if (Array.isArray(value.items)) {
        return value.items as T[];
      }
    }
    return [];
  }
}