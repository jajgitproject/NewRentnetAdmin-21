// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { VehicleCategoryService } from '../../vehicleCategory.service';
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
    public advanceTableService: VehicleCategoryService,
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
    this.advanceTableService.delete(this.data.vehicleCategoryID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('VehicleCategoryDelete:VehicleCategoryView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('VehicleCategoryAll:VehicleCategoryView:Failure');//To Send Updates  
    }
    )
  }
}


