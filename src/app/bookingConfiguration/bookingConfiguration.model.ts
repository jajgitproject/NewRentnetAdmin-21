// @ts-nocheck
import { formatDate } from '@angular/common';
export class BookingConfigurationCustomerDetails {
  customerTravelRequestNumber :string;
  customerID : number;
  customerName : string;
  aggregatorName:string;
  pickupDate:Date;
  pickupTime:Date;
  dropOffDate:Date;
  dropOffTime:Date;
  primaryBookerID:number;
  customerTypeID:number;
  customerGroupID:number;
  reservationSourceID:number;
  reservationSource:string;
  emailLink:string;
  reservationStatus:string;
  primaryPassengerID:number;
  
  constructor(bookingConfigurationCustomerDetails) {
    {

      this.customerTravelRequestNumber = bookingConfigurationCustomerDetails.customerTravelRequestNumber || '';
      this.customerID  = bookingConfigurationCustomerDetails.customerID || '';
      this.customerName = bookingConfigurationCustomerDetails.customerName || '';
      this.aggregatorName = bookingConfigurationCustomerDetails.aggregatorName || '';
      this.pickupDate = bookingConfigurationCustomerDetails.pickupDate || '';
      this.pickupTime = bookingConfigurationCustomerDetails.pickupTime || '';
      this.dropOffDate = bookingConfigurationCustomerDetails.dropOffDate || '';
      this.dropOffTime = bookingConfigurationCustomerDetails.dropOffTime || '';
      this.primaryBookerID = bookingConfigurationCustomerDetails.primaryBookerID || '';
      this.customerTypeID = bookingConfigurationCustomerDetails.customerTypeID || '';
      this.customerGroupID = bookingConfigurationCustomerDetails.customerGroupID || '';
      this.reservationSourceID = bookingConfigurationCustomerDetails.reservationSourceID || '';
      this.reservationSource = bookingConfigurationCustomerDetails.reservationSource || '';
      this.emailLink = bookingConfigurationCustomerDetails.emailLink || '';
      this.reservationStatus = bookingConfigurationCustomerDetails.reservationStatus || '';
      this.primaryPassengerID = bookingConfigurationCustomerDetails.primaryPassengerID || '';
    }
  } 
}


export class BookingConfigurationStopDetails {
  integrationRequestStopID :number;
  integrationRequestStopType :string;
  integrationRequestStopDate :Date;
  integrationRequestStopTime :Date;
  integrationRequestStopCity :string;
  integrationRequestStopAddress :string;
  integrationRequestStopLatitude:string;
  integrationRequestStopLongitude:string;
  priorityOrder:number;
  
  constructor(bookingConfigurationStopDetails) {
    {

       this.integrationRequestStopID = bookingConfigurationStopDetails.integrationRequestStopID || '';
       this.integrationRequestStopType  = bookingConfigurationStopDetails.integrationRequestStopType || '';
       this.integrationRequestStopDate = bookingConfigurationStopDetails.integrationRequestStopDate || '';
       this.integrationRequestStopTime = bookingConfigurationStopDetails.integrationRequestStopTime || '';
       this.integrationRequestStopCity  = bookingConfigurationStopDetails.integrationRequestStopCity || '';
       this.integrationRequestStopAddress = bookingConfigurationStopDetails.integrationRequestStopAddress || '';

    }
  } 
}


export class BookingConfigurationPassengerDetails {
  integrationRequestPassengerID : number;
  integrationRequestPassenger : string;
  integrationRequestPassengerMobile : string;
  integrationRequestPassengerEmail : string;
  integrationRequestPassengerGender : string;
  pickupStopType : string;
  dropOffStopType : string;
  integrationRequestPickupStopID : number;
  integrationRequestDropoffStopID : number;
  passengerID : number;
  
  constructor(bookingConfigurationPassengerDetails) {
    {

       this.integrationRequestPassengerID = bookingConfigurationPassengerDetails.integrationRequestPassengerID || '';
       this.integrationRequestPassenger  = bookingConfigurationPassengerDetails.integrationRequestPassenger || '';
       this.integrationRequestPassengerMobile = bookingConfigurationPassengerDetails.integrationRequestPassengerMobile || '';
       this.integrationRequestPassengerEmail = bookingConfigurationPassengerDetails.integrationRequestPassengerEmail || '';
       this.integrationRequestPassengerGender  = bookingConfigurationPassengerDetails.integrationRequestPassengerGender || '';
       this.pickupStopType = bookingConfigurationPassengerDetails.pickupStopType || '';
       this.dropOffStopType = bookingConfigurationPassengerDetails.dropOffStopType || '';
       this.integrationRequestPickupStopID  = bookingConfigurationPassengerDetails.integrationRequestPickupStopID || '';
       this.integrationRequestDropoffStopID = bookingConfigurationPassengerDetails.integrationRequestDropoffStopID || '';

    }
  } 
}

export class BookingPackageVehcileDetails {
  packageTypeID:number;
  packageType:string;
  packageID:number;
  package:string;
  vehicleCategoryID:number;
  vehicleCategory:string;
  vehicleID:number;
  vehicle:string;
  customerTravelRequestNumber:string;
  
  constructor(bookingPackageVehcileDetails) {
    {
      this.packageTypeID = bookingPackageVehcileDetails.packageTypeID || '';
      this.packageType  = bookingPackageVehcileDetails.packageType || '';
      this.packageID = bookingPackageVehcileDetails.packageID || '';
      this.package = bookingPackageVehcileDetails.package || '';
      this.vehicleCategoryID  = bookingPackageVehcileDetails.vehicleCategoryID || '';
      this.vehicleCategory = bookingPackageVehcileDetails.vehicleCategory || '';
      this.vehicleID = bookingPackageVehcileDetails.vehicleID || '';
      this.vehicle  = bookingPackageVehcileDetails.vehicle || '';
      this.customerTravelRequestNumber  = bookingPackageVehcileDetails.customerTravelRequestNumber || '';
    }
  } 
}


export class BookingConfiguration {
  packageTypeID : number;
  packageType : string;
  packageID:number;
  package:string;
  pickupCityID:number;
  pickupCity:string;
  vehicleID:number;
  vehicle:string;
  vehicleCategoryID:number;
  requestType:string;
  pickupDate:Date;
  pickupTime:Date;
  pickupAddress:string;
  pickupAddressLatLong:string;
  pickupAddressDetails:string;
  serviceLocationID:number;
  serviceLocation:string;
  dropOffCityID:number;
  dropOffCity:string;
  dropOffAddressDetails:string;
  dropOffAddress:string;
  dropOffAddressLatLong:string;
  
  constructor(bookingConfigurationPassengerDetails) {
    {

       this.packageTypeID = bookingConfigurationPassengerDetails.packageTypeID || '';
       this.packageType  = bookingConfigurationPassengerDetails.packageType || '';
       this.packageID = bookingConfigurationPassengerDetails.packageID || '';
       this.package  = bookingConfigurationPassengerDetails.package || '';
       this.pickupCityID = bookingConfigurationPassengerDetails.pickupCityID || '';
       this.pickupCity  = bookingConfigurationPassengerDetails.pickupCity || '';
       this.vehicleID = bookingConfigurationPassengerDetails.vehicleID || '';
       this.vehicle  = bookingConfigurationPassengerDetails.vehicle || '';
       this.vehicleCategoryID = bookingConfigurationPassengerDetails.vehicleCategoryID || '';
       this.requestType = bookingConfigurationPassengerDetails.requestType || '';
       this.pickupDate = bookingConfigurationPassengerDetails.pickupDate || '';
       this.pickupTime = bookingConfigurationPassengerDetails.pickupTime || '';
       this.pickupAddress = bookingConfigurationPassengerDetails.pickupAddress || '';
       this.pickupAddressLatLong = bookingConfigurationPassengerDetails.pickupAddressLatLong || '';
       this.pickupAddressDetails = bookingConfigurationPassengerDetails.pickupAddressDetails || '';
       this.serviceLocationID = bookingConfigurationPassengerDetails.serviceLocationID || '';
       this.serviceLocation = bookingConfigurationPassengerDetails.serviceLocation || '';
       this.dropOffCityID = bookingConfigurationPassengerDetails.dropOffCityID || '';
       this.dropOffCity = bookingConfigurationPassengerDetails.dropOffCity || '';
       this.dropOffAddressDetails = bookingConfigurationPassengerDetails.dropOffAddressDetails || '';
       this.dropOffAddress = bookingConfigurationPassengerDetails.dropOffAddress || '';
       this.dropOffAddressLatLong = bookingConfigurationPassengerDetails.dropOffAddressLatLong || '';

    }
  } 
}


export class ReservationGroupModel {
  reservationID: number;
  userID:number;
  customerTypeID: number; 
  customerID: number;
  customer:string;
  customerGroupID: number;
  customerGroup:string;
  primaryBookerID: number;
  primaryBooker:string;

  reservationGroupID:number;
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
  bookingID:number;
  customerTravelRequestNumber :string;

 constructor(reservation) {
   {
      this.reservationID = reservation.reservationID || -1;
      this.customerTypeID = reservation.customerTypeID || '';
      this.customerID = reservation.customerID || '';
      this.customerGroupID=reservation.customerGroupID || '';
      this.primaryBookerID = reservation.primaryBookerID || '';

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
      this.bookingID = reservation.bookingID || '';
      this.kam = reservation.kam || '';
      this.kamID = reservation.kamID || '';
      this.customerTravelRequestNumber = reservation.customerTravelRequestNumber || '';
      this.reservationStartDate=new Date();
      this.reservationEndDate=new Date();
   }
 }
}

export class B2cDataDetails {
  packageTypeID:number;
  packageType:string;
  packageID:number;
  package:string;
  vehicleCategoryID:number;
  vehicleCategory:string;
  vehicleID:number;
  vehicle:string;
  cityID:number;
  city : string;
  pickupAddress : string;
  dropOffAddress : string;
  
  constructor(b2cDataDetails) {
    {
      this.packageTypeID = b2cDataDetails.packageTypeID || '';
      this.packageType  = b2cDataDetails.packageType || '';
      this.packageID = b2cDataDetails.packageID || '';
      this.package = b2cDataDetails.package || '';
      this.vehicleCategoryID  = b2cDataDetails.vehicleCategoryID || '';
      this.vehicleCategory = b2cDataDetails.vehicleCategory || '';
      this.vehicleID = b2cDataDetails.vehicleID || '';
      this.vehicle  = b2cDataDetails.vehicle || '';
      this.cityID  = b2cDataDetails.cityID || '';
      this.city  = b2cDataDetails.city || '';
      this.pickupAddress  = b2cDataDetails.pickupAddress || '';
      this.dropOffAddress  = b2cDataDetails.dropOffAddress || '';
    }
  } 
}


export class Reservation {
   reservationID: number;
   userID:number;
   reservationGroupID: number;
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
   pickupPriorityOrder:number;
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
   dropOffPriorityOrder:number;
   dropOffDate:Date;
   dropOffDateString:string;
   dropOffTime:Date;
   dropOffTimeString:string;
   etrDate:Date;
   etrDateString:string;
   etrTime:Date;
   etrTimeString:string;
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
   ecoCompanyID:number;

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
   serviceLocationBasedOnCity:string
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

   pickupAddressLatitude:string;
   pickupAddressLongitude:string;
   pickupAddressLatLong:string;
   dropOffAddressLatitude:string;
   dropOffAddressLongitude:string;
   dropOffAddressLatLong:string;
   gstNumber:string;
   gstRate:string;
   billingStateName:string;
   customerConfigurationInvoicingID:number;
   isTimeNotConfirmed:boolean;
   tripTo:string;
   requestStatus:string;  
}
