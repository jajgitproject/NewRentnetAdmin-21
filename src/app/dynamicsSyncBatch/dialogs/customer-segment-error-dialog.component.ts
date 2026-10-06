import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface CustomerSegmentErrorDialogData {
  message: string;
}

export function isCustomerSegmentConfigurationMessage(message: string | null | undefined): boolean {
  const text = String(message || '').trim();
  if (!text) {
    return false;
  }
  return text.includes('is not configured with Customer Segment') && text.includes("Can't Sync this Batch");
}

@Component({
  standalone: true,
  selector: 'app-customer-segment-error-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="cseg-dialog">
      <div class="cseg-dialog__icon" aria-hidden="true">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h2 mat-dialog-title class="cseg-dialog__title">Cannot sync batch</h2>
      <mat-dialog-content>
        <p class="cseg-dialog__message">{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-flat-button color="primary" type="button" (click)="dialogRef.close()">OK</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .cseg-dialog {
      padding: 8px 4px 4px;
      max-width: 520px;
    }
    .cseg-dialog__icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #fef3c7;
      color: #b45309;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin: 0 auto 12px;
    }
    .cseg-dialog__title {
      text-align: center;
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 700;
      color: #9a3412;
    }
    .cseg-dialog__message {
      margin: 0;
      white-space: pre-wrap;
      line-height: 1.55;
      font-size: 14px;
      color: #1e293b;
      text-align: center;
    }
    :host ::ng-deep .mat-mdc-dialog-actions {
      padding-top: 16px;
    }
  `]
})
export class CustomerSegmentErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CustomerSegmentErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomerSegmentErrorDialogData
  ) {}
}

export function openCustomerSegmentErrorDialog(dialog: MatDialog, message: string): void {
  dialog.open(CustomerSegmentErrorDialogComponent, {
    width: '520px',
    maxWidth: '95vw',
    disableClose: false,
    autoFocus: true,
    panelClass: 'cseg-error-dialog-panel',
    data: { message }
  });
}
