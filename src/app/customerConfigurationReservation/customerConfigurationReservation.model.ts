// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationReservation {
  customerConfigurationReservationID:number;
  customerID:number;
  markAllPassengerVIP:boolean;
  acceptBooking:boolean;
  bookingFromBookerOnly:boolean;
  allowBackDateBooking:boolean;
  sendFeedBackEMail:boolean;
  ccReservationEmail:string;
  passengerEmailIDMandatory:boolean;
  creditCardRequiredAtReservation:boolean;
  receiveReservationFrom:string;
  allowDuplicateBooking:boolean;
  activationStatus:boolean;
  userID: number;
  
  constructor(customerConfigurationReservation) {
    {
       this.customerConfigurationReservationID = customerConfigurationReservation.customerConfigurationReservationID || -1;
       this.customerID = customerConfigurationReservation.customerID || '';
       this.markAllPassengerVIP = customerConfigurationReservation.markAllPassengerVIP || '';
       this.acceptBooking = customerConfigurationReservation.acceptBooking || '';
       this.bookingFromBookerOnly = customerConfigurationReservation.bookingFromBookerOnly || '';
       this.allowBackDateBooking = customerConfigurationReservation.allowBackDateBooking || '';
       this.sendFeedBackEMail = customerConfigurationReservation.sendFeedBackEMail || '';
       this.ccReservationEmail = customerConfigurationReservation.ccReservationEmail || '';
       this.passengerEmailIDMandatory = customerConfigurationReservation.passengerEmailIDMandatory || '';
       this.creditCardRequiredAtReservation = customerConfigurationReservation.creditCardRequiredAtReservation || '';
       this.receiveReservationFrom = customerConfigurationReservation.receiveReservationFrom || '';
       this.allowDuplicateBooking = customerConfigurationReservation.allowDuplicateBooking || '';
       this.activationStatus = customerConfigurationReservation.activationStatus || '';
    }
  }
  
}

