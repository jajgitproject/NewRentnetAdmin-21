// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SDLimitedRateService } from '../../sdlimitedRate.service';
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
    public advanceTableService: SDLimitedRateService,
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
    this.advanceTableService.delete(this.data.sdLimitedRateID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('SDLimitedRateDelete:SDLimitedRateView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('SDLimitedRateAll:SDLimitedRateView:Failure');//To Send Updates  
    }
    )
  }
}


