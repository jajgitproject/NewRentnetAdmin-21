// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { CustomerDecimalValuesOnInvoiceService } from '../../customerDecimalValuesOnInvoice.service';
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
    public advanceTableService: CustomerDecimalValuesOnInvoiceService,
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
    this.advanceTableService.delete(this.data.customerDecimalValuesOnInvoiceID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CustomerDecimalValuesOnInvoiceDelete:CustomerDecimalValuesOnInvoiceView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerDecimalValuesOnInvoiceAll:CustomerDecimalValuesOnInvoiceView:Failure');//To Send Updates  
    }
    )
  }
}


