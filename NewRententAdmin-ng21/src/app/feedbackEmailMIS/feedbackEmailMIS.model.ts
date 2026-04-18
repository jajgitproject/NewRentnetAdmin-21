// @ts-nocheck
import { formatDate } from '@angular/common';
export class FeedbackEmailMIS {
  reservationID :number;
  customerID  :number;
  allotmentID :number;
  vehicleID  :number;
  dutySlipID:number;
  CustomerTypeID :number; 
 
  pickupDate :Date; 

  customerName :string;
  vehicle :string;
  userName:string;

  guestName:string;
  gender:string;
  primaryMobile :string;
  primaryEmail:string;
  city :string;
  customerType:string;
  driverName :string;
 
  message:string;
  messageType :string;
  messageSource:string;
  registrationNumber:string;
  vehicleCategory:string;
  isBooker:boolean;
  isPassenger:boolean;
  reachedSMSToBooker:boolean;
  reachedSMSToPassenger:boolean;
  sendSMSWhatsApp:boolean;
 
  constructor(feedbackEmailMIS) {
    {

       this.reservationID = feedbackEmailMIS.reservationID || '';
       this.customerID  = feedbackEmailMIS.customerID || '';
       this.vehicleID  = feedbackEmailMIS.vehicleID || '';
       this.dutySlipID= feedbackEmailMIS.dutySlipID || '';
       this.allotmentID = feedbackEmailMIS.allotmentID || '';
       this.CustomerTypeID = feedbackEmailMIS.CustomerTypeID || '';



       this.pickupDate= feedbackEmailMIS.pickupDate || '';
       this.customerName= feedbackEmailMIS.customerName || '';
       this.vehicle= feedbackEmailMIS.vehicle || '';
       this.userName= feedbackEmailMIS.userName || '';

       this.guestName= feedbackEmailMIS.guestName || '';
       this.gender= feedbackEmailMIS.gender || '';       
       this.primaryMobile= feedbackEmailMIS.primaryMobile || '';
       this.primaryEmail= feedbackEmailMIS.primaryEmail || '';
       this.city= feedbackEmailMIS.city || '';
       this.customerType= feedbackEmailMIS.customerType || '';
       this.driverName= feedbackEmailMIS.driverName || '';
       this.message= feedbackEmailMIS.message || '';
       this.messageType= feedbackEmailMIS.messageType || '';
       this.messageSource= feedbackEmailMIS.messageSource || '';
       this.registrationNumber= feedbackEmailMIS.registrationNumber || '';
       this.vehicleCategory= feedbackEmailMIS.vehicleCategory || '';
       this.isBooker= feedbackEmailMIS.isBooker || '';
       this.isPassenger= feedbackEmailMIS.isPassenger || '';
       this.reachedSMSToBooker = feedbackEmailMIS.reachedSMSToBooker || '';
      this.reachedSMSToPassenger = feedbackEmailMIS.reachedSMSToPassenger || '';
      this.sendSMSWhatsApp = feedbackEmailMIS.sendSMSWhatsApp || '';
     
    }
  }
  
}

