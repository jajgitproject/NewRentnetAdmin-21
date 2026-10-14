// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CappingMessageDialogData {
  title?: string;
  message: string;
}

@Component({
  standalone: false,
  selector: 'app-capping-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.sass']
})
export class CappingMessageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CappingMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CappingMessageDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
