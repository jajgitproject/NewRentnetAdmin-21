// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ChangeKamForCustomersService } from '../../changeKamForCustomers.service';
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
    public advanceTableService: ChangeKamForCustomersService,
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
    const recordId = this.advanceTableService.getRecordId(this.data);
    if (recordId <= 0) {
      this._generalService.sendUpdate('ChangeKamForCustomersAll:ChangeKamForCustomersView:Failure');
      this.dialogRef.close();
      return;
    }
    this.advanceTableService.delete(recordId)
    .subscribe(
    data => 
    {
       this.dialogRef.close();
       this._generalService.sendUpdate('ChangeKamForCustomersDelete:ChangeKamForCustomersView:Success');//To Send Updates   
    },
    error =>
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('ChangeKamForCustomersAll:ChangeKamForCustomersView:Failure');//To Send Updates  
    }
    )
  }
}


