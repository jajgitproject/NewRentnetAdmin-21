// @ts-nocheck
import { formatDate } from '@angular/common';
export class MigrationBookingConfigurationCustomerDetails {
  customerTravelRequestNumber :string;
  customerID : number;
  customerName : string;
  aggregatorName:string;
  packageType:string;
  packageID:number;
  package:string;
  vehicle :string;
  customerCodeForAPIIntegration :string;
  pickupDate:Date;
  pickupTime:Date;
  pickupTimeString:string;
  dropOffDate:Date;
  dropOffTime:Date;
  dropOffTimeString:string;
  primaryBookerID:number;
  customerTypeID:number;
  customerGroupID:number;
  reservationSourceID:number;
  reservationSource:string;
  emailLink:string;
  reservationStatus:string;
  primaryPassengerID:number;
  requestDate:Date;
  requestTime:Date;
  entityCode:string;
  entityName:string;
  gstin:string;
  location:string;
  specialRequest:string;
  
  constructor(migrationBookingConfigurationCustomerDetails) {
    {

      this.customerTravelRequestNumber = migrationBookingConfigurationCustomerDetails.customerTravelRequestNumber || '';
      this.customerID  = migrationBookingConfigurationCustomerDetails.customerID || '';
      this.customerName = migrationBookingConfigurationCustomerDetails.customerName || '';
      this.aggregatorName = migrationBookingConfigurationCustomerDetails.aggregatorName || '';
      this.packageType = migrationBookingConfigurationCustomerDetails.packageType || '';
      this.packageID = migrationBookingConfigurationCustomerDetails.packageID || '';
      this.package = migrationBookingConfigurationCustomerDetails.package || '';
      this.vehicle = migrationBookingConfigurationCustomerDetails.vehicle || '';
      this.pickupDate = migrationBookingConfigurationCustomerDetails.pickupDate || '';
      this.pickupTime = migrationBookingConfigurationCustomerDetails.pickupTime || '';
      this.pickupTimeString = migrationBookingConfigurationCustomerDetails.pickupTimeString || '';
      this.dropOffDate = migrationBookingConfigurationCustomerDetails.dropOffDate || '';
      this.dropOffTime = migrationBookingConfigurationCustomerDetails.dropOffTime || '';
      this.dropOffTimeString = migrationBookingConfigurationCustomerDetails.dropOffTimeString || '';
      this.primaryBookerID = migrationBookingConfigurationCustomerDetails.primaryBookerID || '';
      this.customerTypeID = migrationBookingConfigurationCustomerDetails.customerTypeID || '';
      this.customerGroupID = migrationBookingConfigurationCustomerDetails.customerGroupID || '';
      this.reservationSourceID = migrationBookingConfigurationCustomerDetails.reservationSourceID || '';
      this.reservationSource = migrationBookingConfigurationCustomerDetails.reservationSource || '';
      this.emailLink = migrationBookingConfigurationCustomerDetails.emailLink || '';
      this.reservationStatus = migrationBookingConfigurationCustomerDetails.reservationStatus || '';
      this.primaryPassengerID = migrationBookingConfigurationCustomerDetails.primaryPassengerID || '';
      this.requestDate = migrationBookingConfigurationCustomerDetails.requestDate || '';
      this.requestTime = migrationBookingConfigurationCustomerDetails.requestTime || '';
      this.entityCode = migrationBookingConfigurationCustomerDetails.entityCode || '';
      this.entityName = migrationBookingConfigurationCustomerDetails.entityName || '';
      this.gstin = migrationBookingConfigurationCustomerDetails.gstin || '';
      this.location = migrationBookingConfigurationCustomerDetails.location || '';
      this.specialRequest = migrationBookingConfigurationCustomerDetails.specialRequest || '';
    }
  } 
}


export class MigrationBookingConfigurationStopDetails {
  integrationRequestStopID :number;
  integrationRequestStopType :string;
  integrationRequestStopDate :Date;
  integrationRequestStopTime :Date;
  integrationRequestStopTimeString :string;
  integrationRequestStopCity :string;
  integrationRequestStopAddress :string;
  integrationRequestStopGeoLocation :string;
  landmark :string;
  integrationRequestStopLatitude:string;
  integrationRequestStopLongitude:string;
  priorityOrder:number;
  
  constructor(migrationBookingConfigurationStopDetails) {
    {

       this.integrationRequestStopID = migrationBookingConfigurationStopDetails.integrationRequestStopID || '';
       this.integrationRequestStopType  = migrationBookingConfigurationStopDetails.integrationRequestStopType || '';
       this.integrationRequestStopDate = migrationBookingConfigurationStopDetails.integrationRequestStopDate || '';
       this.integrationRequestStopTime = migrationBookingConfigurationStopDetails.integrationRequestStopTime || '';
       this.integrationRequestStopTimeString = migrationBookingConfigurationStopDetails.integrationRequestStopTimeString || '';
       this.integrationRequestStopCity  = migrationBookingConfigurationStopDetails.integrationRequestStopCity || '';
       this.integrationRequestStopAddress = migrationBookingConfigurationStopDetails.integrationRequestStopAddress || '';
       this.integrationRequestStopGeoLocation = migrationBookingConfigurationStopDetails.integrationRequestStopGeoLocation || '';
       this.landmark = migrationBookingConfigurationStopDetails.landmark || '';
       this.priorityOrder = migrationBookingConfigurationStopDetails.priorityOrder || 0;

    }
  } 
}


export class MigrationBookingConfigurationPassengerDetails {
  integrationRequestPassengerID : number;
  integrationRequestPassenger : string;
  integrationRequestPassengerMobile : string;
  integrationRequestPassengerEmail : string;
  integrationRequestPassengerGender : string;
  integrationRequestStopType:string;
  pickupStopType : string;
  dropOffStopType : string;
  integrationRequestPickupStopID : number;
  integrationRequestDropoffStopID : number;
  pickupAddress : string;
  dropoffAddress : string;
  passengerID : number;
  
  constructor(migrationBookingConfigurationPassengerDetails) {
    {

       this.integrationRequestPassengerID = migrationBookingConfigurationPassengerDetails.integrationRequestPassengerID || '';
       this.integrationRequestPassenger  = migrationBookingConfigurationPassengerDetails.integrationRequestPassenger || '';
       this.integrationRequestPassengerMobile = migrationBookingConfigurationPassengerDetails.integrationRequestPassengerMobile || '';
       this.integrationRequestPassengerEmail = migrationBookingConfigurationPassengerDetails.integrationRequestPassengerEmail || '';
       this.integrationRequestPassengerGender  = migrationBookingConfigurationPassengerDetails.integrationRequestPassengerGender || '';
       this.integrationRequestStopType = migrationBookingConfigurationPassengerDetails.integrationRequestStopType || '';
       this.pickupStopType = migrationBookingConfigurationPassengerDetails.pickupStopType || '';
       this.dropOffStopType = migrationBookingConfigurationPassengerDetails.dropOffStopType || '';
       this.integrationRequestPickupStopID  = migrationBookingConfigurationPassengerDetails.integrationRequestPickupStopID || '';
       this.integrationRequestDropoffStopID = migrationBookingConfigurationPassengerDetails.integrationRequestDropoffStopID || '';
       this.pickupAddress = migrationBookingConfigurationPassengerDetails.pickupAddress || '';
       this.dropoffAddress = migrationBookingConfigurationPassengerDetails.dropoffAddress || '';

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


export class MigrationBookingConfiguration {
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
  
  constructor(migrationBookingConfigurationPassengerDetails) {
    {

       this.packageTypeID = migrationBookingConfigurationPassengerDetails.packageTypeID || '';
       this.packageType  = migrationBookingConfigurationPassengerDetails.packageType || '';
       this.packageID = migrationBookingConfigurationPassengerDetails.packageID || '';
       this.package  = migrationBookingConfigurationPassengerDetails.package || '';
       this.pickupCityID = migrationBookingConfigurationPassengerDetails.pickupCityID || '';
       this.pickupCity  = migrationBookingConfigurationPassengerDetails.pickupCity || '';
       this.vehicleID = migrationBookingConfigurationPassengerDetails.vehicleID || '';
       this.vehicle  = migrationBookingConfigurationPassengerDetails.vehicle || '';
       this.vehicleCategoryID = migrationBookingConfigurationPassengerDetails.vehicleCategoryID || '';
       this.requestType = migrationBookingConfigurationPassengerDetails.requestType || '';
       this.pickupDate = migrationBookingConfigurationPassengerDetails.pickupDate || '';
       this.pickupTime = migrationBookingConfigurationPassengerDetails.pickupTime || '';
       this.pickupAddress = migrationBookingConfigurationPassengerDetails.pickupAddress || '';
       this.pickupAddressLatLong = migrationBookingConfigurationPassengerDetails.pickupAddressLatLong || '';
       this.pickupAddressDetails = migrationBookingConfigurationPassengerDetails.pickupAddressDetails || '';
       this.serviceLocationID = migrationBookingConfigurationPassengerDetails.serviceLocationID || '';
       this.serviceLocation = migrationBookingConfigurationPassengerDetails.serviceLocation || '';
       this.dropOffCityID = migrationBookingConfigurationPassengerDetails.dropOffCityID || '';
       this.dropOffCity = migrationBookingConfigurationPassengerDetails.dropOffCity || '';
       this.dropOffAddressDetails = migrationBookingConfigurationPassengerDetails.dropOffAddressDetails || '';
       this.dropOffAddress = migrationBookingConfigurationPassengerDetails.dropOffAddress || '';
       this.dropOffAddressLatLong = migrationBookingConfigurationPassengerDetails.dropOffAddressLatLong || '';

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
