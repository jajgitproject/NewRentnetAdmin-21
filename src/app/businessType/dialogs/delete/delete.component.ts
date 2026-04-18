// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { BusinessTypeService } from '../../businessType.service';
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
    public advanceTableService: BusinessTypeService,
    public _generalService: GeneralService
  ){}

  onNoClick(): void
  {
    this.dialogRef.close();
  }

  confirmDelete()
  {
    this.advanceTableService.delete(this.data.businessTypeID).subscribe(
    data => 
    {
       this._generalService.sendUpdate('BusinessTypeDelete:BusinessTypeView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('BusinessTypeAll:BusinessTypeView:Failure');//To Send Updates  
    }
    )
  }

}


