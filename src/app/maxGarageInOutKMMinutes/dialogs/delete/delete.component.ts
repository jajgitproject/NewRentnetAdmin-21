// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from '../../../general/general.service';
import { MaxGarageInOutKMMinutesService } from '../../maxGarageInOutKMMinutes.service';

@Component({
  standalone: false,
  selector: 'app-max-garage-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public maxGarageService: MaxGarageInOutKMMinutesService,
    public _generalService: GeneralService
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  confirmDelete(): void {
    this.maxGarageService.delete(this.data.customerContractMaxG2GKMMinutesID).subscribe(
      () => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.dialogRef.close({ error });
      }
    );
  }
}
