// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type CappingMessageDialogVariant = 'info' | 'warning' | 'error';

export interface CappingMessageDialogData {
  title?: string;
  message: string;
  variant?: CappingMessageDialogVariant;
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

  get dialogTitle(): string {
    return this.data?.title || 'Message';
  }

  get variant(): CappingMessageDialogVariant {
    return this.data?.variant || 'info';
  }

  get iconName(): string {
    switch (this.variant) {
      case 'warning':
        return 'warning_amber';
      case 'error':
        return 'error_outline';
      default:
        return 'info_outline';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
