// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationCustomerDetails {
    primaryPassengerID: number;
    primaryBookerID: number;
    customerPersonName:string;
    gender:string;
    importance:string;
    primaryMobile:string;
    customerDepartment:string;
    customerDesignation:string;
    customerID:number;
    customerName:string;
    customerGroupID:number;
    customerGroup:string;
    bookerInfo:string;
    passengerInfo:string;

  constructor(reservationCustomerDetails) {
    {
       this.primaryPassengerID = reservationCustomerDetails.primaryPassengerID || '';
       this.primaryBookerID = reservationCustomerDetails.primaryBookerID || '';
       this.customerPersonName = reservationCustomerDetails.customerPersonName || '';
       this.gender = reservationCustomerDetails.gender || '';
       this.importance = reservationCustomerDetails.importance || '';
       this.primaryMobile = reservationCustomerDetails.primaryMobile || '';
       this.customerDepartment = reservationCustomerDetails.customerDepartment || '';
       this.customerDesignation = reservationCustomerDetails.customerDesignation || '';
       this.customerID = reservationCustomerDetails.customerID || '';
       this.customerName = reservationCustomerDetails.customerName || '';
       this.customerGroupID = reservationCustomerDetails.customerGroupID || '';
       this.customerGroup = reservationCustomerDetails.customerGroup || '';
    }
  }
  
}

