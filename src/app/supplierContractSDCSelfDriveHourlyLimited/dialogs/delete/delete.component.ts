// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SupplierContractSDCSelfDriveHourlyLimitedService } from '../../supplierContractSDCSelfDriveHourlyLimited.service';
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
    public advanceTableService: SupplierContractSDCSelfDriveHourlyLimitedService,
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
    this.advanceTableService.delete(this.data.supplierContractSDCSelfDriveHourlyLimitedID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('SupplierContractSDCSelfDriveHourlyLimitedDelete:SupplierContractSDCSelfDriveHourlyLimitedView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('SupplierContractSDCSelfDriveHourlyLimitedAll:SupplierContractSDCSelfDriveHourlyLimitedView:Failure');//To Send Updates  
    }
    )
  }
}


