// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DriverGradeService } from '../../driverGrade.service';
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
    public advanceTableService: DriverGradeService,
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
    this.advanceTableService.delete(this.data.driverGradeID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('DriverGradeDelete:DriverGradeView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('DriverGradeAll:DriverGradeView:Failure');//To Send Updates  
    }
    )
  }
}


