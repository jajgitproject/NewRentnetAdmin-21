// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DutyGSTPercentageService } from '../../dutyGSTPercentage.service';
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
    public advanceTableService: DutyGSTPercentageService,
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
    this.advanceTableService.delete(this.data.advanceTable.dutyGSTPercentageID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('DutyGSTPercentageDelete:DutyGSTPercentageView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('DutyGSTPercentageAll:DutyGSTPercentageView:Failure');//To Send Updates  
    }
    )
  }
}


