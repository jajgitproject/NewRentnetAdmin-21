// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { ChangePassengerService } from '../../changePassenger.service';
import { ChangePassengerModel } from '../../changePassenger.model';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  standalone: false,
  selector: 'app-changePassengerDetails',
  templateUrl: './changePassengerDetails.component.html',
  styleUrls: ['./changePassengerDetails.component.sass']
})
export class ChangePassengerDetailsComponent
{
  dataSourceForPassenger?:ChangePassengerModel[] | null;
  dialogTitle:any;
  ReservationID:any;

  constructor(
    public dialogRef: MatDialogRef<ChangePassengerDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public changePassengerService: ChangePassengerService,
    public _generalService: GeneralService
  )
  {
    this.dialogTitle = 'Reservation Change Log';
    this.ReservationID = data?.reservationID;
  }

  public ngOnInit(): void
  {
    this.loadDataForPassenger();
  }

  onNoClick(): void
  {
    this.dialogRef.close();
  }

  public loadDataForPassenger() 
  {
    this.changePassengerService.getChangePassengerData(this.ReservationID).subscribe(
    data => 
    {
      this.dataSourceForPassenger = data;
      console.log(this.dataSourceForPassenger)
    },
    (error: HttpErrorResponse) => { this.dataSourceForPassenger = null; }
    );
  }

}


