// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { DutyNightService } from '../../dutyNight.service';

@Component({
  standalone: false,
  selector: 'app-duty-night-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DutyNightService,
    public _generalService: GeneralService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.advanceTableService.delete(this.data.dutyNightID)
      .subscribe(
        data => {
          this._generalService.sendUpdate('DutyNightDelete:DutyNightView:Success');
          this.dialogRef.close(true);
        },
        error => {
          this._generalService.sendUpdate('DutyNightAll:DutyNightView:Failure');
          this.dialogRef.close(false);
        }
      );
  }
}
