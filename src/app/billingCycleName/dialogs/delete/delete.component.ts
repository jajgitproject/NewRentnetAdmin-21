// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { BillingCycleNameService } from '../../billingCycleName.service';
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
    public advanceTableService: BillingCycleNameService,
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
    this.advanceTableService.delete(this.data.billingCycleID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('BillingCycleNameDelete:BillingCycleNameView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('BillingCycleNameAll:BillingCycleNameView:Failure');//To Send Updates  
    }
    )
  }
}


