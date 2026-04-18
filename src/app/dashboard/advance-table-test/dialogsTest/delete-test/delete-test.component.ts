// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AdvanceTableTestService } from '../../advance-table-test.service';

@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete-test.component.html',
  styleUrls: ['./delete-test.component.sass']
})
export class DeleteDialogTestComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogTestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: AdvanceTableTestService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.advanceTableService.deleteAdvanceTableTest(this.data.id);
  }
}


