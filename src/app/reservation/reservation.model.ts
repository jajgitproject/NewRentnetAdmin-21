// @ts-nocheck
import { formatDate } from '@angular/common';
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
   tripType:string;
  constructor(reservation) {
    {
       this.reservationID = reservation.reservationID || -1;
       this.customerTypeID = reservation.customerTypeID || '';
       this.customerCustomerGroup = reservation.customerCustomerGroup || '';
       this.customerID = reservation.customerID || '';
       this.customerGroupID=reservation.customerGroupID || '';
       this.primaryBookerID = reservation.primaryBookerID || '';
       this.primaryPassengerID = reservation.primaryPassengerID || '';
       this.vehicleCategoryID = reservation.vehicleCategoryID || '';
       this.vehicleID=reservation.vehicleID || '';
       this.packageTypeID = reservation.packageTypeID || '';
       this.packageID = reservation.packageID || '';
       this.pickupCityID = reservation.pickupCityID || '';
       this.pickupPriorityOrder = reservation.pickupPriorityOrder || '';
       this.dropOffPriorityOrder = reservation.dropOffPriorityOrder || '';
       this.pickupDateString = reservation.pickupDateString || '';
       this.pickupTimeString = reservation.pickupTimeString || '';
       this.pickupSpotTypeID=reservation.pickupSpotTypeID || 0;
       this.pickupSpotID = reservation.pickupSpotID || 0;
       this.pickupAddress = reservation.pickupAddress || '';
       this.pickupAddressDetails = reservation.pickupAddressDetails || '';
       this.locationOutDateString = reservation.locationOutDateString || '';
       this.locationOutTimeString = reservation.locationOutTimeString || '';
       this.serviceLocationID=reservation.serviceLocationID || '';
       this.transferedLocationID=reservation.transferedLocationID || '';
       this.dropOffDateString = reservation.dropOffDateString || '';
       this.dropOffTimeString = reservation.dropOffTimeString || '';
       this.dropOffCityID = reservation.dropOffCityID || '';
       this.dropOffSpotTypeID = reservation.dropOffSpotTypeID || 0;
       this.dropOffSpotID=reservation.dropOffSpotID || 0;
       this.dropOffAddress = reservation.dropOffAddress || '';
       this.dropOffAddressDetails = reservation.dropOffAddressDetails || '';
       this.ticketNumber = reservation.ticketNumber || '';
       this.attachment = reservation.attachment || '';
       this.emailLink=reservation.emailLink || '';
       this.reservationSourceID = reservation.reservationSourceID || '';
       this.reservationSourceDetail = reservation.reservationSourceDetail || '';
       this.referenceNumber = reservation.referenceNumber || '';
       this.reservationStatus = reservation.reservationStatus || '';
       this.modeOfPaymentID=reservation.modeOfPaymentID || '';
       this.modeOfPayment=reservation.modeOfPayment || '';
       this.customerConfigurationInvoicingID=reservation.customerConfigurationInvoicingID || '';
       this.gstNumber=reservation.gstNumber || '';
       this.gstRate=reservation.gstRate || '';
       this.billingStateName=reservation.billingStateName || '';
       this.isTimeNotConfirmed=reservation.isTimeNotConfirmed || '';
       this.tripTo=reservation.tripTo || '';
       this.tripType=reservation.tripType || '';
    }

  }
  
}

export class GoogleAddress {
  geoPointID: number;
  geoLocation: string;
  latitude:string;
  longitude:string;
  geoSearchString: string;;
  geoPointName: string;
  googlePlacesID:string;
  activationStatus:string;

 constructor(googleAddress) {
   {
      this.geoPointID = googleAddress.geoPointID || -1;
      this.geoLocation = googleAddress.geoLocation || '';
      this.geoSearchString = googleAddress.geoSearchString || '';
      this.geoPointName = googleAddress.geoPointName || '';
      this.googlePlacesID = googleAddress.googlePlacesID || '';
      this.activationStatus = googleAddress.activationStatus || '';
   }
 }
 
}

export class SavedAddress {
  country: number;
  state: string;;
  city: string;
  address:string;
  landamrk:string;
  isFavourite:boolean;
  addressStringForMap:string;

 constructor(savedAddress) {
   {
      this.country = savedAddress.country || '';
      this.state = savedAddress.state || '';
      this.city = savedAddress.city || '';
      this.address = savedAddress.address || '';
      this.landamrk = savedAddress.landamrk || '';
      this.isFavourite = savedAddress.isFavourite || '';
      this.addressStringForMap= savedAddress.addressStringForMap||'';
   }
 }

}


export class ReservationStatusLog {
  reservationStatusLogID: number;
  reservationID: string;;
  reservationStatus: string;
  reservationStatusText:string;
  reservationStatusDetails:string;
  reservationStatusChangedByID:string;

 constructor(reservationStatusLog) {
   {
      this.reservationStatusLogID = reservationStatusLog.reservationStatusLogID || '';
      this.reservationID = reservationStatusLog.reservationID || '';
      this.reservationStatus = reservationStatusLog.reservationStatus || '';
      this.reservationStatusText = reservationStatusLog.reservationStatusText || '';
      this.reservationStatusDetails = reservationStatusLog.reservationStatusDetails || '';
      this.reservationStatusChangedByID= reservationStatusLog.reservationStatusChangedByID||'';
   }
 }

}

export class ModelForReservation {
  reservationID : number;
  customerTypeID : number;
  customerType : string;
  customerID : number;
  customerName : string;
  customerGroupID : number; 
  customerGroup : string;
  primaryBookerID : number; 
  primaryBooker : string; 
  gender : string; 
  importance : string; 
  phone : string; 
  customerForBooker : string; 
  customerDepartment : string; 
  customerDesignation : string;

 constructor(modelForReservation) {
   {
      this.reservationID = modelForReservation.reservationID || '';
      this.customerTypeID = modelForReservation.customerTypeID || '';
      this.customerType = modelForReservation.customerType || '';
      this.customerID = modelForReservation.customerID || '';
      this.customerName= modelForReservation.customerName||'';
      this.customerGroupID = modelForReservation.customerGroupID || '';
      this.customerGroup = modelForReservation.customerGroup || '';
      this.primaryBookerID = modelForReservation.primaryBookerID || '';
      this.primaryBooker= modelForReservation.primaryBooker||'';
      this.gender = modelForReservation.gender || '';
      this.importance = modelForReservation.importance || '';
      this.phone = modelForReservation.phone || '';
      this.customerForBooker= modelForReservation.customerForBooker||'';
      this.customerDepartment = modelForReservation.customerDepartment || '';
      this.customerDesignation= modelForReservation.customerDesignation||'';
   }
 }

}
export class UpdatePickupModel{
   reservationID : number;
      pickupTime:Date;
   pickupTimeString:string;
     dropOffTime:Date;
  dropOffTimeString:string;
  locationOutTime:Date;
  locationOutTimeString:string;
  constructor(modelForReservation) {
   {
      this.reservationID = modelForReservation.reservationID || '';    
      this.pickupTimeString = modelForReservation.pickupTimeString || '';
      this.dropOffTimeString= modelForReservation.dropOffTimeString||'';
      this.locationOutTimeString = modelForReservation.locationOutTimeString || '';
      
   }
 }


}

