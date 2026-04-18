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
    
    this.advanceTableService.delete(this.data.changeKamForCustomersID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('ChangeKamForCustomersDelete:ChangeKamForCustomersView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('ChangeKamForCustomersAll:ChangeKamForCustomersView:Failure');//To Send Updates  
    }
    )
  }
}


