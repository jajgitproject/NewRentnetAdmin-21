// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DutyExpenseService } from '../../dutyExpense.service';
import { GeneralService } from '../../../general/general.service';
@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent
{
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DutyExpenseService,
    public _generalService: GeneralService
  )
  {
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
    if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
    {
      this.isSaveAllowed = true;
    } 
    else
    {
      this.isSaveAllowed = false;
    }
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  confirmDelete()
  {
    this.advanceTableService.delete(this.data.advanceTable.dutyExpenseID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('DutyExpenseDelete:DutyExpenseView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('DutyExpenseAll:DutyExpenseView:Failure');//To Send Updates  
    }
    )
  }
}


