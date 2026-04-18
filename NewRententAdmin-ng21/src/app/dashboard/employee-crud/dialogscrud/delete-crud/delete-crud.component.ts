// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EmployeeCrudTestService } from '../../employee-crud.service';



@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete-crud.component.html',
  //styleUrls: ['./delete-crud.component.sass']
})
export class DeleteDialogCrudComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogCrudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: EmployeeCrudTestService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.advanceTableService.deleteAdvanceTableTest(this.data.id);
  }
}


