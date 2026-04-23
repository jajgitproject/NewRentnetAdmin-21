// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CityMasterTestService } from '../../city-master.service';

@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete-city.component.html',
 // styleUrls: ['./delete-city.component.sass']
})
export class DeleteDialogCityComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogCityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CityMasterTestService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.advanceTableService.deleteAdvanceTableTest(this.data.id);
  }
}


