// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { CustomerBillingCycleService } from '../../customerBillingCycle.service';
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
    public advanceTableService: CustomerBillingCycleService,
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
    this.advanceTableService.delete(this.data.customerBillingCycleID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CustomerBillingCycleDelete:CustomerBillingCycleView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerBillingCycleAll:CustomerBillingCycleView:Failure');//To Send Updates  
    }
    )
  }
}


