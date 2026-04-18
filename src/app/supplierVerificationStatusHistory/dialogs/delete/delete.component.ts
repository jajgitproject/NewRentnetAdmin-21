// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SupplierVerificationStatusHistoryService } from '../../supplierVerificationStatusHistory.service';
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
    public advanceTableService: SupplierVerificationStatusHistoryService,
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
    this.advanceTableService.delete(this.data.supplierVerificationStatusHistoryID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('SupplierVerificationStatusHistoryDelete:SupplierVerificationStatusHistoryView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('SupplierVerificationStatusHistoryAll:SupplierVerificationStatusHistoryView:Failure');//To Send Updates  
    }
    )
  }
}


