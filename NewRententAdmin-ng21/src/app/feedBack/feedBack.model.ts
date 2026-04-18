// @ts-nocheck
import { formatDate } from '@angular/common';
export class FeedBack {
   tripFeedBackID: number;
   userID:number;
   dutySlipID: number;
   allotmentID: number;
   reservationID: number;
   primaryPassengerID: number;
   driverID: number;
   inventoryID: number;
   passengerID: number;
   customerPersonID:number;
   employeeID: number;
   feedbackPointsOutOfFive:number;
   feedbackRemark:string;
   feedbackEnteredBy:string;
   customerPersonName:string;
   activationStatus: boolean;
   dateOfFeedbackString:string;
   dateOfFeedback:Date;
   timeOfFeedback:Date;
   timeOfFeedbackString:string;
   registrationNumber:string;
   driverName:string;
   firstName:string;
   lastName:string;

  constructor(feedBack) {
    {
       this.tripFeedBackID = feedBack.tripFeedBackID || -1;
       this.dutySlipID = feedBack.dutySlipID || '';
       this.allotmentID = feedBack.allotmentID || '';
       this.reservationID = feedBack.reservationID || '';
       this.driverID = feedBack.driverID || '';
       this.inventoryID = feedBack.inventoryID || '';
       this.passengerID = feedBack.passengerID || '';
       this.customerPersonID = feedBack.customerPersonID || '';
       this.employeeID = feedBack.employeeID || '';
       this.feedbackPointsOutOfFive = feedBack.feedbackPointsOutOfFive || '';
       this.feedbackRemark = feedBack.feedbackRemark || '';
       this.feedbackEnteredBy = feedBack.feedbackEnteredBy || '';
       this.dateOfFeedbackString = feedBack.dateOfFeedbackString || '';
       this.timeOfFeedbackString = feedBack.timeOfFeedbackString || '';
       this.activationStatus = feedBack.activationStatus || '';
       this.timeOfFeedback=new Date();
       this.dateOfFeedback=new Date();
    }
  }
  
}

