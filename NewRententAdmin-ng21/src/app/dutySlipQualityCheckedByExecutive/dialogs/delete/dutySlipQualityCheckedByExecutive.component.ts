// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { DutySlipQualityCheckedByExecutiveService } from '../../dutySlipQualityCheckedByExecutive.service';
@Component({
  standalone: false,
  selector: 'app-dutySlipQualityCheckedByExecutive',
  templateUrl: './dutySlipQualityCheckedByExecutive.component.html',
  styleUrls: ['./dutySlipQualityCheckedByExecutive.component.sass']
})
export class DeleteDialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DutySlipQualityCheckedByExecutiveService,
    public _generalService: GeneralService
  )
  {
    
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  // confirmDelete()
  // {
  //   this.advanceTableService.delete(this.data.bankID)  
  //   .subscribe(
  //   data => 
  //   {
  //      this._generalService.sendUpdate('BankDelete:BankView:Success');//To Send Updates   
  //   },
  //   error =>
  //   {
  //     this._generalService.sendUpdate('BankAll:BankView:Failure');//To Send Updates  
  //   }
  //   )
  // }
}


