// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerAlertMessage {
  customerAlertMessageID: number;
  customerID: number;
  customerName: string;
  customerAlertMessageTypeID: number;
  customerAlertMessageType: string;
  instructedBy: number;
  employeeName: string;
  customerAlertMessage: string;
  customerAlertMessageDocument: string;
  startDateString: string;
  startDate: Date;
  endDateString: string;
  endDate: Date;
  activationStatus: boolean;
  userID:number;

  constructor(customerAlertMessage) {
    {
      this.customerAlertMessageID = customerAlertMessage.customerAlertMessageID || -1;
      this.customerID = customerAlertMessage.customerID || '';
      this.customerName = customerAlertMessage.customerName || '';
      this.customerAlertMessageTypeID = customerAlertMessage.customerAlertMessageTypeID || '';
      this.instructedBy = customerAlertMessage.instructedBy || '';
      this.employeeName = customerAlertMessage.employeeName || '';
      this.customerAlertMessageType = customerAlertMessage.customerAlertMessageType || '';
      this.customerAlertMessage = customerAlertMessage.customerAlertMessage || '';
      this.customerAlertMessageDocument = customerAlertMessage.customerAlertMessageDocument || '';
      this.startDateString = customerAlertMessage.startDateString || '';
      this.endDateString = customerAlertMessage.endDateString || '';
      this.activationStatus = customerAlertMessage.activationStatus || '';

      this.startDate=new Date();
      this.endDate=new Date();
    }
  }
  
}


export class CustomerAlertMessageTypeForDropDown {
  customerAlertMessageTypeID: number;
  customerAlertMessageType: string;

  constructor(customerAlertMessageType) {
    {
      this.customerAlertMessageTypeID = customerAlertMessageType.customerAlertMessageTypeID || -1;
      this.customerAlertMessageType = customerAlertMessageType.customerAlertMessageType || '';
    }
  }
  
}
