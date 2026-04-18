// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { DutyStateCustomerService } from '../../dutyStateCustomer.service';
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
    public advanceTableService: DutyStateCustomerService,
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
    this.advanceTableService.delete(this.data.dutyStateCustomerID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('DutyStateCustomerDelete:DutyStateCustomerView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('DutyStateCustomerAll:DutyStateCustomerView:Failure');//To Send Updates  
    }
    )
  }
}


