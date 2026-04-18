// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { ContractPackageTypeMappingService } from '../../contractPackageTypeMapping.service';

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
    public advanceTableService: ContractPackageTypeMappingService,
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
    this.advanceTableService.delete(this.data.contractPackageTypeMappingID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('ContractPackageTypeMappingDelete:ContractPackageTypeMappingView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('ContractPackageTypeMappingAll:ContractPackageTypeMappingView:Failure');//To Send Updates  
    }
    )
  }
}


