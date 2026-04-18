// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerConfigurationReservationService } from '../../customerConfigurationReservation.service';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-askForDelete-dialog',
  templateUrl: './askForDelete-dialog.component.html',
  styleUrls: ['./askForDelete-dialog.component.sass']
})
export class AskForDeleteDialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<AskForDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerConfigurationReservationService,
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
    
    this.advanceTableService.delete(this.data.CustomerConfigurationReservationID)  
    .subscribe(
    data => 
    {
      this.dialogRef.close();
       this._generalService.sendUpdate('CustomerConfigurationReservationDelete:CustomerConfigurationReservationView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerConfigurationReservationAll:CustomerConfigurationReservationView:Failure');//To Send Updates  
    }
    )
  }
  
}


