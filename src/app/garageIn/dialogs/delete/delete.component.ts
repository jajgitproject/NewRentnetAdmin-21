// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { GarageInService } from '../../garageIn.service';
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
    public advanceTableService: GarageInService,
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
    this.advanceTableService.delete(this.data.garageInID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('DispatchByExecutiveDelete:DispatchByExecutiveView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('DispatchByExecutiveAll:DispatchByExecutiveView:Failure');//To Send Updates  
    }
    )
  }
}


