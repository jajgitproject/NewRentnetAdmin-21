// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { AdditionalSMSDetailsService } from '../../additionalSMSDetails.service';
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
    public advanceTableService: AdditionalSMSDetailsService,
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
    this.advanceTableService.delete(this.data.reservationAdditionalMessagingID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('AdditionalSMSDetailsDelete:AdditionalSMSDetailsView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('AdditionalSMSDetailsAll:AdditionalSMSDetailsView:Failure');//To Send Updates  
    }
    )
  }
}


