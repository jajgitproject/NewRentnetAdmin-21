// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupplierPayoutMismatchDutyRow } from './supplierPayout.model';

export interface SupplierPayoutMismatchDialogData {
  supplierName: string;
  rows: SupplierPayoutMismatchDutyRow[];
}

@Component({
  standalone: false,
  selector: 'app-supplier-payout-mismatch-dialog',
  templateUrl: './supplier-payout-mismatch-dialog.component.html',
})
export class SupplierPayoutMismatchDialogComponent {
  displayedColumns = [
    'dutySlipID',
    'reservationID',
    'customerName',
    'payoutEcoRevenueAtFirstPay',
    'currentEcoRevenue',
    'lockedSupplierPercent',
    'targetSupplierRevenue',
    'cumulativePaidAmount',
    'adjustmentDelta',
  ];

  constructor(
    public dialogRef: MatDialogRef<SupplierPayoutMismatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SupplierPayoutMismatchDialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  formatMoney(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toFixed(2);
  }

  formatPercent(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
      return '-';
    }
    return (Number(value) * 100).toFixed(2) + '%';
  }
}
