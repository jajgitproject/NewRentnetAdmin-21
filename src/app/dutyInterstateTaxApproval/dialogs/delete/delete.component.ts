// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DutyInterstateTaxApprovalService } from '../../dutyInterstateTaxApproval.service';
import { GeneralService } from '../../../general/general.service';
@Component({
  standalone: false,
  selector: 'app-delete-duty-interstate-tax-approval',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DutyInterstateTaxApprovalService,
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
    this.advanceTableService.delete(this.data.dutyInterstateTaxID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('DutyInterstateTaxApprovalDelete:DutyInterstateTaxApprovalView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('DutyInterstateTaxApprovalAll:DutyInterstateTaxApprovalView:Failure');//To Send Updates  
    }
    )
  }
}


