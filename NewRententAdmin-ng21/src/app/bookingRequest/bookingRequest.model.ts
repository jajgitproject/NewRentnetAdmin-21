// @ts-nocheck
import { formatDate } from '@angular/common';
export class BookingRequest {
  integrationRequestID:number;
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
  reservationID : number;
  checkedByEcoEmployeeID : number;
  checkedByEco : boolean;
  
  constructor(bookingRequest) {
    {
       this.integrationRequestID = bookingRequest.integrationRequestID || '';
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
       this.reservationID = bookingRequest.reservationID || '';
       this.checkedByEcoEmployeeID = bookingRequest.checkedByEcoEmployeeID || '';
       this.checkedByEco = bookingRequest.checkedByEco || '';
       
    }
  }
  
}

