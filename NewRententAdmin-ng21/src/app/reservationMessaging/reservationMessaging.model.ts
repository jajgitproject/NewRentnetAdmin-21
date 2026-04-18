// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationMessaging {
   reservationMessagingID: number;
   reservationID:number;
   sentToCustomerPersonOrEmployeeOrBooker:string;
   customerPersonMessageRecipientID:number;
   employeeMessageRecipientID:number;
   customerPersonName:string;
   firstName:string;
   lastName:string;
   recipientAddress:string;
   referenceID:string;
   messageType:string;
   messageDate:Date;
   messageTime:Date;
   messageSource:string;

  constructor(reservationMessaging) {
    {
       this.reservationMessagingID = reservationMessaging.reservationMessagingID || -1;
       this.reservationID = reservationMessaging.reservationID || '';
       this.sentToCustomerPersonOrEmployeeOrBooker = reservationMessaging.sentToCustomerPersonOrEmployeeOrBooker || '';
       this.customerPersonMessageRecipientID = reservationMessaging.customerPersonMessageRecipientID || -1;
       this.employeeMessageRecipientID = reservationMessaging.employeeMessageRecipientID || '';
       this.customerPersonName = reservationMessaging.customerPersonName || '';
       this.firstName = reservationMessaging.firstName || '';
       this.lastName = reservationMessaging.lastName || '';
       this.recipientAddress = reservationMessaging.recipientAddress || '';
       this.referenceID = reservationMessaging.referenceID || '';
       this.messageType = reservationMessaging.messageType || '';
       this.messageDate = reservationMessaging.messageDate || '';
       this.messageTime = reservationMessaging.messageTime || '';
       this.messageSource = reservationMessaging.messageSource || '';
    }
  }
  
  
}

export class ReservationMessagingData {
  totalRecords: number;
  reservationMessagingModel: ReservationMessaging[];
  constructor(carAndDriverAllotmentData) {
    this.totalRecords = carAndDriverAllotmentData.totalRecords || '';
    this.reservationMessagingModel = carAndDriverAllotmentData.reservationMessagingModel;
  }
}

