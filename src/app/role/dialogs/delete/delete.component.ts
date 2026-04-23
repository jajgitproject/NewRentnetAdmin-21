// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { RoleService } from '../../role.service';
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
    public advanceTableService: RoleService,
    public _generalService: GeneralService,
  )
  {
    
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  confirmDelete()
  {
    this.advanceTableService.delete(this.data.roleID)  
    .subscribe(
    data => 
    {
      this._generalService.sendUpdate('RoleDelete:RoleView:Success');//To Send Updates 
    },
    error =>
    {
      this._generalService.sendUpdate('RoleAll:RoleView:Failure');//To Send Updates    
    }
    )
  }
}
