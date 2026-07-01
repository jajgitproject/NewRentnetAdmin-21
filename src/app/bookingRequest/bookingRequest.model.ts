// @ts-nocheck
import { formatDate } from '@angular/common';
export class BookingRequest {
  integrationRequestID:number;
  integrationRequestGroupID?: number;
  customerTravelRequestNumber :string;
  customerID : number;
  customerName : string;
  requestDate : Date;
  requestTime : Date;
  pickupDate : Date;
  pickupTime : Date;
  dropOffDate : Date;
  dropOffTime : Date;
  requestStatus : string;
  reservationCreatedBy :string;
  reservationID : number;
  reservationGroupID?: number;
  checkedByEcoEmployeeID : number;
  checkedByEco : boolean;
  reservationCreatedOn : Date;
  
  constructor(bookingRequest) {
    {
       this.integrationRequestID = bookingRequest.integrationRequestID || '';
       this.integrationRequestGroupID = bookingRequest.integrationRequestGroupID || '';
       this.customerTravelRequestNumber = bookingRequest.customerTravelRequestNumber || '';
       this.customerID  = bookingRequest.customerID || '';
       this.customerName = bookingRequest.customerName || '';
       this.requestDate = bookingRequest.requestDate || '';
       this.requestTime = bookingRequest.requestTime || '';
       this.pickupDate = bookingRequest.pickupDate || '';
       this.pickupTime = bookingRequest.pickupTime || '';
       this.dropOffDate  = bookingRequest.dropOffDate || '';
       this.dropOffTime= bookingRequest.dropOffTime || '';
       this.requestStatus = bookingRequest.requestStatus || '';
       this.reservationCreatedBy = bookingRequest.reservationCreatedBy || '';
       this.reservationID = bookingRequest.reservationID || '';
       this.reservationGroupID = bookingRequest.reservationGroupID || '';
       this.checkedByEcoEmployeeID = bookingRequest.checkedByEcoEmployeeID || '';
       this.checkedByEco = bookingRequest.checkedByEco || '';
        this.reservationCreatedOn = bookingRequest.reservationCreatedOn || '';

       
    }
  }
  
}

