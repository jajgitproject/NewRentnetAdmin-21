// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SupplierVerificationDocumentsService } from '../../supplierVerificationDocuments.service';
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
    public advanceTableService: SupplierVerificationDocumentsService,
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
    this.advanceTableService.delete(this.data.supplierVerificationDocumentsID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('SupplierVerificationDocumentsDelete:SupplierVerificationDocumentsView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('SupplierVerificationDocumentsAll:SupplierVerificationDocumentsView:Failure');//To Send Updates  
    }
    )
  }
}


