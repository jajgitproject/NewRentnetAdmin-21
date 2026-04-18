// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SupplierCityMappingService } from '../../supplierCityMapping.service';
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
    public advanceTableService: SupplierCityMappingService,
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
    this.advanceTableService.delete(this.data.supplierCityMappingID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('SupplierCityMappingDelete:SupplierCityMappingView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('SupplierCityMappingAll:SupplierCityMappingView:Failure');//To Send Updates  
    }
    )
  }
}


