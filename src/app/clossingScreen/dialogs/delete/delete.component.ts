// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { ClossingScreenService } from '../../clossingScreen.service';
@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class RSPDeleteDialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<RSPDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ClossingScreenService,
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
    this.advanceTableService.deleteSalesPerson(this.data.reservationSalesPersonID)  
    .subscribe(
    data => 
    {
       //this._generalService.sendUpdate('ColorDelete:ColorView:Success');//To Send Updates   
    },
    error =>
    {
      //this._generalService.sendUpdate('ColorAll:ColorView:Failure');//To Send Updates  
    }
    )
  }
}


