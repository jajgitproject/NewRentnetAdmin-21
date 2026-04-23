// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { VendorLongTermRentalRateService } from '../../vendorLongTermRentalRate.service';
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
    public advanceTableService: VendorLongTermRentalRateService,
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
    this.advanceTableService.delete(this.data.vendorLongTermRentalRateID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('VendorLongTermRentalRateDelete:VendorLongTermRentalRateView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('VendorLongTermRentalRateAll:VendorLongTermRentalRateView:Failure');//To Send Updates  
    }
    )
  }
}


