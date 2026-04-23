// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DutyPostPickUPCallService } from '../../dutyPostPickUPCall.service';
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
    public advanceTableService: DutyPostPickUPCallService,
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
    this.advanceTableService.delete(this.data.bankID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('DutyPostPickUPCallDelete:DutyPostPickUPCallView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('DutyPostPickUPCallAll:DutyPostPickUPCallView:Failure');//To Send Updates  
    }
    )
  }
}


