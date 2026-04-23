// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BookingScreenService } from '../../bookingScreen.service';
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
    public advanceTableService: BookingScreenService,
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
    this.advanceTableService.delete(this.data.bookingScreenID)
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('BookingScreenDelete:BookingScreenView:Success');
    },
    error =>
    {
      this._generalService.sendUpdate('BookingScreenAll:BookingScreenView:Failure');
    }
    )
  }
}


