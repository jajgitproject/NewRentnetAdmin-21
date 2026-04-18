// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { VendorContractCarCategoriesCarMappingService } from '../../vendorContractCarCategoriesCarMapping.service';
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
    public advanceTableService: VendorContractCarCategoriesCarMappingService,
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
    this.advanceTableService.delete(this.data.vendorContractCarCategoriesCarMappingID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('VendorContractCarCategoriesCarMappingDelete:VendorContractCarCategoriesCarMappingView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('VendorContractCarCategoriesCarMappingAll:VendorContractCarCategoriesCarMappingView:Failure');//To Send Updates  
    }
    )
  }
}


