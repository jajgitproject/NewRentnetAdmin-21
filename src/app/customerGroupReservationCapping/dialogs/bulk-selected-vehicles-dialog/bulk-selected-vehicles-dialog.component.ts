// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface BulkSelectedVehiclesDialogData {
  vehicles: string[];
}

@Component({
  standalone: false,
  selector: 'app-bulk-selected-vehicles-dialog',
  templateUrl: './bulk-selected-vehicles-dialog.component.html',
  styleUrls: ['./bulk-selected-vehicles-dialog.component.sass']
})
export class BulkSelectedVehiclesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BulkSelectedVehiclesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BulkSelectedVehiclesDialogData
  ) {}

  get vehicles(): string[] {
    return this.data?.vehicles || [];
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
