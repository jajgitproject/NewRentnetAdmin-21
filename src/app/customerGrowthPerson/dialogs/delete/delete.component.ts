// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerGrowthPersonService } from '../../customerGrowthPerson.service';
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
    public advanceTableService: CustomerGrowthPersonService,
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
    
    this.advanceTableService.delete(this.data.customerGrowthPersonID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CustomerGrowthPersonDelete:CustomerGrowthPersonView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerGrowthPersonAll:CustomerGrowthPersonView:Failure');//To Send Updates  
    }
    )
  }
}


