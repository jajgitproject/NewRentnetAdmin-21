// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ChangeSaleForCustomersService } from '../../changeSaleForCustomers.service';
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
    public advanceTableService: ChangeSaleForCustomersService,
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
    
    this.advanceTableService.delete(this.data.customerSalesManagerID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('ChangeSaleForCustomersDelete:ChangeSaleForCustomersView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('ChangeSaleForCustomersAll:ChangeSaleForCustomersView:Failure');//To Send Updates  
    }
    )
  }
}


