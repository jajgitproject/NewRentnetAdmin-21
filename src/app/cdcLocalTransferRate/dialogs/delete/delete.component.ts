// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CDCLocalTransferRateService } from '../../cdcLocalTransferRate.service';
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
    public advanceTableService: CDCLocalTransferRateService,
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
    this.advanceTableService.delete(this.data.cdcLocalTransferRateID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CDCLocalTransferRateDelete:CDCLocalTransferRateView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CDCLocalTransferRateAll:CDCLocalTransferRateView:Failure');//To Send Updates  
    }
    )
  }
}


