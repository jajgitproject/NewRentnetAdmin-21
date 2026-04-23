// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationGroup
{
  reservationGroupID:number; 

  customerID:number;  
  customer :string;
  customerTypeID:number;
  customerType:string;
  customerGroupID:number;  
  customerGroup:string;
  customerCustomerGroup:string;

  primaryBookerID:number;  
  primaryBooker :string;
  gender:string;
  importance:string;
  phone:string;
  customerDesignation:string;
  customerDepartment:string;
  customerForBooker:string;

  reservationStartDate:Date; 
  reservationStartDateString:string; 
  reservationEndDate:Date; 
  reservationEndDateString:string;
  numberOfBookings:string;
  reservationExecutiveID:number; 

  salesExecutiveID:number; 
  salesExecutive:string;
  firstName:string;
  lastName:string;
  mobile:string;
  email:string;
  bookingType:string;
  bookingGroupType:string;

  kamFirstName:string;
  kamLastName:string;
  kamMobile:string;
  kamEmail:string;

  kam:string;
  kamID:number;

  locationID:number;
  locationName:string;

  activationStatus:boolean; 
  constructor(reservationGroup) {
    {
       this.reservationGroupID = reservationGroup.reservationGroupID || -1;
       this.customerID = reservationGroup.customerID || '';
       this.customer=reservationGroup.customer || '';
       this.primaryBookerID = reservationGroup.primaryBookerID || '';
       this.primaryBooker = reservationGroup.primaryBooker || '';
       this.reservationStartDateString = reservationGroup.reservationStartDateString || '';
       this.reservationEndDateString=reservationGroup.reservationEndDateString || '';
       this.numberOfBookings = reservationGroup.numberOfBookings || '';
       this.reservationExecutiveID = reservationGroup.reservationExecutiveID || '';
       this.salesExecutiveID = reservationGroup.salesExecutiveID || '';
       this.activationStatus = reservationGroup.activationStatus || '';
       this.bookingType = reservationGroup.bookingType || '';
       this.kam = reservationGroup.kam || '';
      this.kamID = reservationGroup.kamID || '';
      this.locationID = reservationGroup.locationID || '';
      this.locationName = reservationGroup.locationName || '';
    }
  }
}

