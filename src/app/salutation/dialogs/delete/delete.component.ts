// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SalutationService } from '../../salutation.service';
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
    public advanceTableService: SalutationService,
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
    debugger;
    this.advanceTableService.delete(this.data.salutationID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('SalutationDelete:SalutationView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('SalutationAll:SalutationView:Failure');//To Send Updates  
    }
    )
  }
}


