// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { StopDetailsService } from '../../stopDetails.service';
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
    public advanceTableService: StopDetailsService,
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
    this.advanceTableService.delete(this.data.reservationStopID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('StopDetailsDelete:StopDetailsView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('StopDetailsAll:StopDetailsView:Failure');//To Send Updates  
    }
    )
  }
}


