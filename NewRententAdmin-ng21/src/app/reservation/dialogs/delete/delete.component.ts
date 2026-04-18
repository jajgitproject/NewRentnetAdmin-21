// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ReservationService } from '../../reservation.service';
import { GeneralService } from '../../../general/general.service';
@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ReservationService,
    public _generalService: GeneralService
  )
  {
    
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  confirmDelete()
  {
    this.advanceTableService.delete(this.data.reservationID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('ReservationDelete:ReservationView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('ReservationAll:ReservationView:Failure');//To Send Updates  
    }
    )
  }
}


