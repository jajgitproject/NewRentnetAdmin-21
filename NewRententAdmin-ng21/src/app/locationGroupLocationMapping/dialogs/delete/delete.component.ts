// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { LocationGroupLocationMappingService } from '../../locationGroupLocationMapping.service';


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
    public advanceTableService:LocationGroupLocationMappingService,
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
    this.advanceTableService.delete(this.data.locationGroupLocationMappingID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('LocationGroupLocationMappingDelete:LocationGroupLocationMappingView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('LocationGroupLocationMappingAll:LocationGroupLocationMappingView:Failure');//To Send Updates  
    }
    )
  }
}


