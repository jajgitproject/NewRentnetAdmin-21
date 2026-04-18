// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerReservationFieldsService } from '../../customerReservationFields.service';
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
    public advanceTableService: CustomerReservationFieldsService,
    public _generalService: GeneralService
  )
  {
    console.log(data)
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  confirmDelete()
  {
    this.advanceTableService.delete(this.data.customerReservationFieldID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CustomerReservationFieldsDelete:CustomerReservationFieldsView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerReservationFieldsAll:CustomerReservationFieldsView:Failure');//To Send Updates  
    }
    )
  }
}


