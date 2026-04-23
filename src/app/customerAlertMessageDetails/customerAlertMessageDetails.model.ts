// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerAlertMessageDetails {

  customerAlertMessage:string;

  constructor(CustomerAlertMessageDetails) {
    {
      this.customerAlertMessage = CustomerAlertMessageDetails.customerAlertMessage || '';
      
    }
  }
 
}
export class CustomerAlertMessageDetailsData {
  totalRecords: number;
  driverFeedbackInfoModel: CustomerAlertMessageDetails[];
  driverDutyData: CustomerAlertMessageDetails[];
  constructor(driverFeedBackData) {
    this.totalRecords = driverFeedBackData.totalRecords || '';
    this.driverDutyData = driverFeedBackData.driverDutyData;
  }
}
