// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { VehicleCategoryTargetService } from '../../vehicleCategoryTarget.service';
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
    public advanceTableService: VehicleCategoryTargetService,
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
    this.advanceTableService.delete(this.data.vehicleCategoryTargetID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('VehicleCategoryTargetDelete:VehicleCategoryTargetView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('VehicleCategoryTargetAll:VehicleCategoryTargetView:Failure');//To Send Updates  
    }
    )
  }
}


