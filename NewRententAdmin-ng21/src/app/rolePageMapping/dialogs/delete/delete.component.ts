// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { RolePageMappingService } from '../../rolePageMapping.service';
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
    public advanceTableService: RolePageMappingService,
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
    this.advanceTableService.delete(this.data.rolePageMappingID)  
    .subscribe(
    data => 
    {
      this._generalService.sendUpdate('RolePageMappingDelete:RolePageMappingView:Success');//To Send Updates      
    },
    error =>
    {
      this._generalService.sendUpdate('RolePageMappingAll:RolePageMappingView:Failure');//To Send Updates 
    }
    )
  }
}


