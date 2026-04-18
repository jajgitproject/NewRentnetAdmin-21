// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { VendorOutStationOneWayTripRateService } from '../../vendorOutStationOneWayTripRate.service';
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
    public advanceTableService: VendorOutStationOneWayTripRateService,
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
    this.advanceTableService.delete(this.data.vendorOutStationOneWayTripRateID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('VendorOutStationOneWayTripRateDelete:VendorOutStationOneWayTripRateView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('VendorOutStationOneWayTripRateAll:VendorOutStationOneWayTripRateView:Failure');//To Send Updates  
    }
    )
  }
}


