// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverFeedbackInfo {
  driverID: number;
  tripTripFeedBackID: number;
  dutySlipID: number;
  allotmentID: number;
  reservationID: number;
  
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

  constructor(DriverFeedbackInfo) {
    {
      this.dutySlipID = DriverFeedbackInfo.dutySlipID || '';
      this.allotmentID = DriverFeedbackInfo.allotmentID || '';
      this.reservationID = DriverFeedbackInfo.reservationID || '';
      this.driverID = DriverFeedbackInfo.driverID || '';
      this.inventoryID = DriverFeedbackInfo.inventoryID || '';
      this.passengerID = DriverFeedbackInfo.passengerID || '';
      this.customerPersonID = DriverFeedbackInfo.customerPersonID || '';
      this.employeeID = DriverFeedbackInfo.employeeID || '';
      this.feedbackPointsOutOfFive = DriverFeedbackInfo.feedbackPointsOutOfFive || '';
      this.feedbackRemark = DriverFeedbackInfo.feedbackRemark || '';
      this.feedbackEnteredBy = DriverFeedbackInfo.feedbackEnteredBy || '';
      this.dateOfFeedbackString = DriverFeedbackInfo.dateOfFeedbackString || '';
      this.timeOfFeedbackString = DriverFeedbackInfo.timeOfFeedbackString || '';
      this.activationStatus = DriverFeedbackInfo.activationStatus || '';
      this.timeOfFeedback=new Date();
      this.dateOfFeedback=new Date();
    }
  }
 
}
export class DriverFeedBackData {
  totalRecords: number;
  driverFeedbackInfoModel: DriverFeedbackInfo[];
  driverDutyData: DriverFeedbackInfo[];
  constructor(driverFeedBackData) {
    this.totalRecords = driverFeedBackData.totalRecords || '';
    this.driverDutyData = driverFeedBackData.driverDutyData;
  }
}
