// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { VendorPaymentMappingService } from '../../vendorPaymentMapping.service';




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
    public advanceTableService: VendorPaymentMappingService,
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
    this.advanceTableService.delete(this.data.vendorContractPaymentMappingID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('VendorPaymentMappingDelete:VendorPaymentMappingView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('VendorPaymentMappingAll:VendorPaymentMappingView:Failure');//To Send Updates  
    }
    )
  }
}


