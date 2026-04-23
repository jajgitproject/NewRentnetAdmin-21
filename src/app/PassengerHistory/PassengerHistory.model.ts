// @ts-nocheck
import { formatDate } from '@angular/common';
export class PassengerHistory {
  passengerHistory: string;
  primaryPassengerName: string;
  passengerHistoryID:number;
  Packages: string;
   updatedBy:number;
   updateDateTime: Date;
   activationStatus:boolean;
  constructor(PassengerHistory) {
    {
       this.passengerHistoryID = PassengerHistory.passengerHistoryID || -1;
       this.passengerHistory = PassengerHistory.passengerHistory || '';
       this.Packages = PassengerHistory.Packages || '';
       this.updatedBy=PassengerHistory.updatedBy || 10;
       this.updateDateTime = PassengerHistory.updateDateTime;
       this.activationStatus = PassengerHistory.activationStatus || '';
    }
  }
  
}





export class PassengerData {
  totalRecords: number;
  passengerHistoryModel: PassengerHistory[];
  driverDutyData: PassengerHistory[];
  constructor(PassengerData) {
    this.totalRecords = PassengerData.totalRecords || '';
    this.passengerHistoryModel = PassengerData.passengerHistoryModel;
  }
}

