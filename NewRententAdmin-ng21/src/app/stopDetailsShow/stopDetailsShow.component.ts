// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { StopDetailsShowModel } from './stopDetailsShow.model';
import { StopDetailsService } from '../stopDetails/stopDetails.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  standalone: false,
  selector: 'app-stopDetailsShow',
  templateUrl: './stopDetailsShow.component.html',
  styleUrls: ['./stopDetailsShow.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class StopDetailsShowComponent {
  dataSource: StopDetailsShowModel[] | null;
   DutySlipQualityCheckDetails: any;
  qcDetails:any;
  dialogTitle: string;
  ReservationID: any;
  constructor(
    public dialogRef: MatDialogRef<StopDetailsShowComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public _generalService: GeneralService,
    public stopDetailsService: StopDetailsService,
  ) {
    // Set the defaults
    this.dialogTitle = 'Stop Details';
    this.ReservationID = this.data.reservationID;
  }

  ngOnInit() 
  {
    this.loadData();
  }

  public loadData() 
   {
      this.stopDetailsService.getReservationStopDetails(this.ReservationID).subscribe
    (
      data =>   
      {
        this.dataSource = data;
        console.log(this.dataSource)
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  onNoClick(): void 
  {
    this.dialogRef.close();
  }
}


