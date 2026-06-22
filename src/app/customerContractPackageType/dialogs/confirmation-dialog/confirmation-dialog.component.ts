// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  message: string = '';

  constructor(
      public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.message = data.message;
  }

  onConfirm(): void {
    this.dialogRef.close(true); // return true when confirmed
  }

  onNoClick(): void {
    this.dialogRef.close(false); // return false when canceled
  }

}


