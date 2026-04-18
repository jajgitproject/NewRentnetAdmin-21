// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { ContractPaymentMappingService } from '../../contractPaymentMapping.service';


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
    public advanceTableService: ContractPaymentMappingService,
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
    this.advanceTableService.delete(this.data.contractPaymentMappingID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('ContractPaymentMappingDelete:ContractPaymentMappingView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('ContractPaymentMappingAll:ContractPaymentMappingView:Failure');//To Send Updates  
    }
    )
  }
}


