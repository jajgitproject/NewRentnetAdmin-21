// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { VehicleInterStateTaxService } from '../../vehicleInterStateTax.service';
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
    public advanceTableService: VehicleInterStateTaxService,
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
    this.advanceTableService.delete(this.data.inventoryInterStateTaxID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('VehicleInterStateTaxDelete:VehicleInterStateTaxView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('VehicleInterStateTaxAll:VehicleInterStateTaxView:Failure');//To Send Updates  
    }
    )
  }
}


