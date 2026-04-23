// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { QualificationService } from '../../qualification.service';
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
    public advanceTableService: QualificationService,
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
    this.advanceTableService.delete(this.data.qualificationID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('QualificationDelete:QualificationView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('QualificationAll:QualificationView:Failure');//To Send Updates  
    }
    )
  }
}


