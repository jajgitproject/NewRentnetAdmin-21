// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CDCLocalOnDemandRateService } from '../../cdcLocalOnDemandRate.service';
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
    public advanceTableService: CDCLocalOnDemandRateService,
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
    this.advanceTableService.delete(this.data.cdcLocalOnDemandRateID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CDCLocalOnDemandRateDelete:CDCLocalOnDemandRateView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CDCLocalOnDemandRateAll:CDCLocalOnDemandRateView:Failure');//To Send Updates  
    }
    )
  }
}


