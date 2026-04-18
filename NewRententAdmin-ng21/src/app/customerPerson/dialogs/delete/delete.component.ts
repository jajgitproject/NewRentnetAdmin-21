// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerPersonService } from '../../customerPerson.service';
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
    public advanceTableService: CustomerPersonService,
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
    this.advanceTableService.delete(this.data.customerPersonID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CustomerPersonDelete:CustomerPersonView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerPersonAll:CustomerPersonView:Failure');//To Send Updates  
    }
    )
  }
}


