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

  get rolePageMappingDisplay(): string {
    const role = this.data?.role ? String(this.data.role).trim() : '';
    const page = this.data?.page ? String(this.data.page).trim() : '';
    const explicit = this.data?.rolePageMapping ? String(this.data.rolePageMapping).trim() : '';

    if (explicit) {
      return explicit;
    }
    if (role && page) {
      return `${role} - ${page}`;
    }
    if (page) {
      return page;
    }
    if (role) {
      return role;
    }
    if (this.data?.rolePageMappingID != null) {
      return `ID ${this.data.rolePageMappingID}`;
    }
    return 'N/A';
  }

  get roleDisplay(): string {
    const role = this.data?.role ? String(this.data.role).trim() : '';
    if (role) {
      return role;
    }

    const mapping = this.rolePageMappingDisplay;
    if (mapping.includes(' - ')) {
      return mapping.split(' - ')[0].trim() || 'N/A';
    }

    return mapping;
  }
}


