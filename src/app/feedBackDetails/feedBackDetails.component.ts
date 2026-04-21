// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { FeedBackService } from '../feedBack/feedBack.service';
import { FeedBackDetailsService } from './feedBackDetails.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FeedBackDetails } from './feedBackDetails.model';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
@Component({
  standalone: false,
  selector: 'app-FeedBackDetails',
  templateUrl: './FeedBackDetails.component.html',
  styleUrls: ['./FeedBackDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FeedBackDetailsComponent {
  FeedBackDetails: any;
  dialogTitle: string;
  // dataSource: FeedBackDetails | null;
  public FeedBackDetailsInfo: ControlPanelDetails;
  ReservationID: number;

  constructor(
    public dialogRef: MatDialogRef<FeedBackDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    // public data:any,
    public data: { advanceTable: ControlPanelDetails, reservationID: number },
    public _generalService: GeneralService,
    public feedBackDetailsService: FeedBackDetailsService
  ) {
    // Set the defaults
    this.dialogTitle = 'Feed Back Details';

  this.FeedBackDetailsInfo = new ControlPanelDetails({});
    this.FeedBackDetailsInfo = this.data.advanceTable;
    this.ReservationID = this.FeedBackDetailsInfo.reservationID;
  }

  ngOnInit() {
    this.DutySlipImageLoadData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

   public DutySlipImageLoadData() 
    {
      // this.ReservationID = this.data.reservationID;
       this.feedBackDetailsService.getFeedBackDetails(this.ReservationID).subscribe
       (
        (data:FeedBackDetails) =>   
          {
          
            this.FeedBackDetails = data;
          },
  
          (error: HttpErrorResponse) => { this.FeedBackDetails=null }
        
      );
    }
}



