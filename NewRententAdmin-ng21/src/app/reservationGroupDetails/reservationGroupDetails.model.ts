// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationGroupModel {
  reservationID: number;
  userID:number;
  customerTypeID: number; 
  customerID: number;
  customer:string;
  customerGroupID: number;
  customerGroup:string;
  primaryBookerID: number;
  primaryBooker:string
  primaryPassengerID: number;
  primaryPassenger: string;
  vehicleCategoryID: number;
  vehicleID: number;
  packageTypeID: number;
  packageID: number;
  pickupDate:Date;
  pickupDateString:string;
  pickupTime:Date;
  pickupTimeString:string;
  pickupCityID: number;
  pickupSpotTypeID:number;
  pickupSpotID:number;
  pickupAddress:string;
  pickupAddressDetails:string;
  locationOutDate:Date;
  locationOutDateString:string;
  locationOutTime:Date;
  locationOutTimeString:string;
  serviceLocationID:number;
  dropOffDate:Date;
  dropOffDateString:string;
  dropOffTime:Date;
  dropOffTimeString:string;
  dropOffCityID:number;
  dropOffSpotTypeID:number;
  dropOffSpotID:number;
  dropOffAddress:string;
  dropOffAddressDetails:string;   
  ticketNumber:string;
  attachment:string;
  emailLink:string;
  reservationSourceID:number;
  reservationSourceDetail:string;
  referenceNumber:string;
  reservationStatus:string;

  customerType: string;
  customerCustomerGroup: string;
  booker:string;
  passenger:string;
  vehicle:string;
  pickupCity:string;
  packageType:string;
  package:string;
  pickupSpotType:string;
  pickupSpot:string;
  serviceLocation:string;
  dropOffSpotType:string;
  dropOffSpot:string;
  dropOffCity:string;
  reservationSource:string;
  googleAddresses:boolean;
  googleAdressesDropOff:boolean;
  reservationStatusDetails:string;
  reservationStatusText:string;
  reservationStatusChangedByID:number;

  modeOfPaymentID:number;
  modeOfPayment:string;
  fieldName:string;
  projectCode:string;
  customerReservationFieldID:string;
  transferedLocationID:number;

  reservationGroupID:number; 
  // customerID:number;  
  // customer :string;
  // primaryBookerID:number;  
  // primaryBooker :string;
  reservationStartDate:Date; 
  reservationStartDateString:string; 
  reservationEndDate:Date; 
  reservationEndDateString:string;
  numberOfBookings:string;
  reservationExecutiveID:number;  
  salesExecutiveID:number;
  salesExecutive:string; 
  bookingType:string;
  bookingGroupType:string;  
  kam:string;
  kamID:number;
  activationStatus:boolean; 
  locationID:number;
  locationName:string;

 constructor(reservation) {
   {
      this.reservationID = reservation.reservationID || -1;
      this.customerTypeID = reservation.customerTypeID || '';
      this.customerID = reservation.customerID || '';
      this.customerGroupID=reservation.customerGroupID || '';
      this.primaryBookerID = reservation.primaryBookerID || '';
      this.primaryPassengerID = reservation.primaryPassengerID || '';
      this.vehicleCategoryID = reservation.vehicleCategoryID || '';
      this.vehicleID=reservation.vehicleID || '';
      this.packageTypeID = reservation.packageTypeID || '';
      this.packageID = reservation.packageID || '';
      this.pickupCityID = reservation.pickupCityID || '';
      this.pickupDateString = reservation.pickupDateString || '';
      this.pickupTimeString = reservation.pickupTimeString || '';
      this.pickupSpotTypeID=reservation.pickupSpotTypeID || '';
      this.pickupSpotID = reservation.pickupSpotID || '';
      this.pickupAddress = reservation.pickupAddress || '';
      this.pickupAddressDetails = reservation.pickupAddressDetails || '';
      this.locationOutDateString = reservation.locationOutDateString || '';
      this.locationOutTimeString = reservation.locationOutTimeString || '';
      this.serviceLocationID=reservation.serviceLocationID || '';
      this.transferedLocationID=reservation.transferedLocationID || '';
      this.dropOffDateString = reservation.dropOffDateString || '';
      this.dropOffTimeString = reservation.dropOffTimeString || '';
      this.dropOffCityID = reservation.dropOffCityID || '';
      this.dropOffSpotTypeID = reservation.dropOffSpotTypeID || '';
      this.dropOffSpotID=reservation.dropOffSpotID || '';
      this.dropOffAddress = reservation.dropOffAddress || '';
      this.dropOffAddressDetails = reservation.dropOffAddressDetails || '';
      this.ticketNumber = reservation.ticketNumber || '';
      this.attachment = reservation.attachment || '';
      this.emailLink=reservation.emailLink || '';
      this.reservationSourceID = reservation.reservationSourceID || '';
      this.reservationSourceDetail = reservation.reservationSourceDetail || '';
      this.referenceNumber = reservation.referenceNumber || '';
      this.reservationStatus = reservation.reservationStatus || '';
      this.modeOfPaymentID=reservation.modeOfPaymentID || null;
      this.modeOfPayment=reservation.modeOfPayment || '';

      this.reservationGroupID = reservation.reservationGroupID || '';
      this.reservationStartDateString = reservation.reservationStartDateString || '';
      this.reservationEndDateString=reservation.reservationEndDateString || '';
      this.numberOfBookings = reservation.numberOfBookings || '';
      this.reservationExecutiveID = reservation.reservationExecutiveID || '';
      this.salesExecutiveID = reservation.salesExecutiveID || '';
      this.salesExecutive = reservation.salesExecutive || '';
      this.activationStatus=reservation.activationStatus || '';
      this.bookingType = reservation.bookingType || '';
      this.bookingGroupType = reservation.bookingGroupType || '';
      this.kam = reservation.kam || '';
      this.kamID = reservation.kamID || '';
      this.reservationStartDate=new Date();
      this.reservationEndDate=new Date();
      this.locationID = reservation.locationID || '';
      this.locationName = reservation.locationName || '';


   }
 }
 
}



export class ReservationGroup
{
  reservationGroupID:number; 
  reservationID:number;
  
  customerID:number;  
  customer :string;
  customerTypeID:number;
  customerType:string;
  customerGroupID:number;  
  customerGroup:string;

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
 activationStatus:boolean; 
 cancellationReason:string;

  kamFirstName:string;
  kamLastName:string;
  kamMobile:string;
  kamEmail:string;
 
 kam:string;
 kamID:number;
 locationID:number;
 locationName:string;

 
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
       this.bookingType = reservationGroup.bookingType || '';
       this.activationStatus = reservationGroup.activationStatus || '';
       this.kam = reservationGroup.kam || '';
      this.kamID = reservationGroup.kamID || '';
      this.locationID = reservationGroup.locationID || '';
      this.locationName = reservationGroup.locationName || '';
    }
  }
}


export class UnfilledBookingModel {
  sourceReservationID: any;
  destinationReservationID: any;
  constructor(reservationGroup) {
    {
       this.sourceReservationID = reservationGroup.sourceReservationID || '';
       this.destinationReservationID = reservationGroup.destinationReservationID || '';
    }
}
}

export class BookingWithDateRangeModel {
  startDate: Date;
  startDateString: string;
  endDate: Date;
  endDateString: string;
  constructor(bookingWithDateRangeModel) {
    {
       this.startDateString = bookingWithDateRangeModel.startDateString || '';
       this.endDateString = bookingWithDateRangeModel.endDateString || '';
    }
}
}

