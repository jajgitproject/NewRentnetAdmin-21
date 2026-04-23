// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { VehicleService } from '../../vehicle.service';
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
    public advanceTableService: VehicleService,
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
    this.advanceTableService.delete(this.data.vehicleID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('VehicleDelete:VehicleView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('VehicleAll:VehicleView:Failure');//To Send Updates  
    }
    )
  }
}


