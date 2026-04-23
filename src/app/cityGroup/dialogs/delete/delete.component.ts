// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CityGroupService } from '../../cityGroup.service';
import { GeneralService } from 'src/app/general/general.service';

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
    public advanceTableService: CityGroupService,
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
    this.advanceTableService.delete(this.data.cityGroupID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CityGroupDelete:CityGroupView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CityGroupAll:CityGroupView:Failure');//To Send Updates  
    }
    )
  }
}


