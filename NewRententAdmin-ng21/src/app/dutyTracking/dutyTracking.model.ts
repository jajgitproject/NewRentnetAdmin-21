// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyTrackingModel {
  dutyTrackingID:number;
  dutySlipID:number;
  trackedByEmployeeID:number;
  trackedByEmployeeName:string;
  trackingDate:Date;
  tackingTime:Date;
  modeOfTracking:string;
  trackingDetails:string;
  userID:number;
  activationStatus: boolean;

  constructor(dutyTrackingModel) {
    {
      this.dutyTrackingID = dutyTrackingModel.dutyTrackingID || -1;
      this.dutySlipID = dutyTrackingModel.dutySlipID || '';
      this.modeOfTracking = dutyTrackingModel.modeOfTracking || '';
      this.trackingDetails = dutyTrackingModel.trackingDetails || '';
      this.activationStatus = dutyTrackingModel.activationStatus || '';
    }
  }
}
