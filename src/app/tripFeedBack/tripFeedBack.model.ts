// @ts-nocheck
import { formatDate } from '@angular/common';
export class TripFeedBack {
   tripTripFeedBackID: number;
   dutySlipID: number;
   allotmentID: number;
   reservationID: number;
   driverID: number;
   inventoryID: number;
   passengerID: number;
   customerPersonID:number;
   employeeID: number;
   feedbackPointsOutOfFive:string;
   feedbackRemark:string;
   feedbackEnteredBy:string;
   activationStatus: boolean;
   dateOfFeedbackString:string;
   dateOfFeedback:Date;
   timeOfFeedback:Date;
   timeOfFeedbackString:string;
   registrationNumber:string;
   driverName:string;

  constructor(tripFeedBack) {
    {
       this.tripTripFeedBackID = tripFeedBack.tripTripFeedBackID || -1;
       this.dutySlipID = tripFeedBack.dutySlipID || '';
       this.allotmentID = tripFeedBack.allotmentID || '';
       this.reservationID = tripFeedBack.reservationID || '';
       this.driverID = tripFeedBack.driverID || '';
       this.inventoryID = tripFeedBack.inventoryID || '';
       this.passengerID = tripFeedBack.passengerID || '';
       this.customerPersonID = tripFeedBack.customerPersonID || '';
       this.employeeID = tripFeedBack.employeeID || '';
       this.feedbackPointsOutOfFive = tripFeedBack.feedbackPointsOutOfFive || '';
       this.feedbackRemark = tripFeedBack.feedbackRemark || '';
       this.feedbackEnteredBy = tripFeedBack.feedbackEnteredBy || '';
       this.dateOfFeedbackString = tripFeedBack.dateOfFeedbackString || '';
       this.timeOfFeedbackString = tripFeedBack.timeOfFeedbackString || '';
       this.activationStatus = tripFeedBack.activationStatus || '';
       this.timeOfFeedback=new Date();
       this.dateOfFeedback=new Date();
    }
  }
  
}

