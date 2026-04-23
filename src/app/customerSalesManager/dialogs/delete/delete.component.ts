// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerSalesManagerService } from '../../customerSalesManager.service';
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
    public advanceTableService: CustomerSalesManagerService,
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
       this._generalService.sendUpdate('CustomerSalesManagerDelete:CustomerSalesManagerView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerSalesManagerAll:CustomerSalesManagerView:Failure');//To Send Updates  
    }
    )
  }
}


