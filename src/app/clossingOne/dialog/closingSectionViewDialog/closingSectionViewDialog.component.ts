//@ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type ClosingSectionKey =
  | 'tollParking'
  | 'interstate'
  | 'dispute'
  | 'dutyExpense'
  | 'dutyGST'
  | 'dutyState'
  | 'dutyStateCustomer'
  | 'dutySAC'
  | 'additionalKm'
  | 'mop'
  | 'settledRates'
  | 'discount'
  | 'customerSpecific'
  | 'changeDutyType';

export interface ClosingSectionViewDialogData {
  title: string;
  section: ClosingSectionKey;
  context: Record<string, any>;
  onBillingChargesChanged?: () => void;
  onSectionDataChanged?: () => void;
  getContextSnapshot?: () => Record<string, any>;
}

@Component({
  standalone: false,
  selector: 'app-closingSectionViewDialog',
  templateUrl: './closingSectionViewDialog.component.html',
  styleUrls: ['./closingSectionViewDialog.component.sass']
})
export class ClosingSectionViewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ClosingSectionViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClosingSectionViewDialogData
  ) {}

  get ctx(): Record<string, any> {
    return this.data?.context || {};
  }

  onChargesChanged(): void {
    if (typeof this.data?.onBillingChargesChanged === 'function') {
      this.data.onBillingChargesChanged();
    }
    this.close();
  }

  onSectionDataChanged(): void {
    if (typeof this.data?.onSectionDataChanged === 'function') {
      this.data.onSectionDataChanged();
    }
    this.close();
  }

  refreshContext(): void {
    if (typeof this.data?.getContextSnapshot === 'function') {
      this.data.context = this.data.getContextSnapshot();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
