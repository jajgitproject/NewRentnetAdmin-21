// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SupplierRateCardService } from '../../supplierRateCard.service';
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
    public advanceTableService: SupplierRateCardService,
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
    this.advanceTableService.delete(this.data.supplierRateCardID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('SupplierRateCardDelete:SupplierRateCardView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('SupplierRateCardAll:SupplierRateCardView:Failure');//To Send Updates  
    }
    )
  }
}


