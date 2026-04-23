// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { BillingTypeService } from '../../billingType.service';
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
    public advanceTableService: BillingTypeService,
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
    this.advanceTableService.delete(this.data.billingTypeID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('BillingTypeDelete:BillingTypeView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('BillingTypeAll:BillingTypeView:Failure');//To Send Updates  
    }
    )
  }
}


