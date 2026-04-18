// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { DutySlipImageService } from '../../dutySlipImage.service';
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
    public advanceTableService: DutySlipImageService,
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
    this.advanceTableService.delete(this.data.dutyQualityCheckID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('DutySlipImageDelete:DutySlipImageView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('DutySlipImageAll:DutySlipImageView:Failure');//To Send Updates  
    }
    )
  }
}


