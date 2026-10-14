// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface BulkSelectedCitiesDialogData {
  cities: string[];
}

@Component({
  standalone: false,
  selector: 'app-bulk-selected-cities-dialog',
  templateUrl: './bulk-selected-cities-dialog.component.html',
  styleUrls: ['./bulk-selected-cities-dialog.component.sass']
})
export class BulkSelectedCitiesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BulkSelectedCitiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BulkSelectedCitiesDialogData
  ) {}

  get cities(): string[] {
    return this.data?.cities || [];
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
