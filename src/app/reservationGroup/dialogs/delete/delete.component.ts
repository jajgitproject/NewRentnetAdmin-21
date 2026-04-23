// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ReservationGroupService } from '../../reservationGroup.service';
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
    public advanceTableService: ReservationGroupService,
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
    this.advanceTableService.delete(this.data.reservationGroupID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('ReservationGroupDelete:ReservationGroupView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('ReservationGroupAll:ReservationGroupView:Failure');//To Send Updates  
    }
    )
  }
}


