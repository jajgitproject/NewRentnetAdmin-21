// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SummaryOfDutyData } from './summary-of-duty.model';

export interface SummaryOfDutyDialogData {
  /** Bill breakdown; null shows child demo until API is wired */
  summary?: SummaryOfDutyData | null;
  /** Optional second line under title (e.g. duty / reservation context) */
  subtitle?: string;
}

@Component({
  standalone: false,
  selector: 'app-summary-of-duty-dialog',
  templateUrl: './summary-of-duty-dialog.component.html',
  styleUrls: ['./summary-of-duty-dialog.component.sass']
})
export class SummaryOfDutyDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SummaryOfDutyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SummaryOfDutyDialogData
  ) {}
}
