// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
// import { IssueCategoryService } from '../../issueCategory.service';
import { GeneralService } from '../../../general/general.service';
import { IssueCategoryService } from '../../issueCategory.service';
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
    public advanceTableService: IssueCategoryService,
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
    this.advanceTableService.delete(this.data.issueCategoryID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('IssueCategoryDelete:IssueCategoryView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('IssueCategoryAll:IssueCategoryView:Failure');//To Send Updates  
    }
    )
  }
}


