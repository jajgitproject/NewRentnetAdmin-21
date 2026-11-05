// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { BookingRefusalService } from '../../bookingRefusal.service';

@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: BookingRefusalService,
    public _generalService: GeneralService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    const id = this.data.reservationRefusalID;
    this.advanceTableService.delete(id).subscribe(
      () => {
        this.dialogRef.close({ deleted: true, reservationRefusalID: id });
      },
      () => {
        this._generalService.sendUpdate('BookingRefusalAll:BookingRefusalView:Failure');
        this.dialogRef.close();
      }
    );
  }
}
