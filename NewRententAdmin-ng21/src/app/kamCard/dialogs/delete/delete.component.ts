// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { KamCardService } from '../../kamCard.service';
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
    public advanceTableService: KamCardService,
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
    this.advanceTableService.delete(this.data.reservationKAMID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('KamCardDelete:KamCardView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('KamCardAll:KamCardView:Failure');//To Send Updates  
    }
    )
  }
}


