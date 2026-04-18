// @ts-nocheck

import { formatDate } from '@angular/common';
import { DriverInventoryAssociation } from '../driverInventoryAssociation/driverInventoryAssociation.model';
export class CarAndDriverAllotment {
  public tripDetails:Array<TripDetails>=[]
  // public carDetails:CarDetails[];
  // public route:Route[];
  // public tripTracker:TripTracker[];
  // public billingDetails:BillingDetails[];
  // public paymentStatus:PaymentStatus[];
  // public passengers:Passengers[];
}

export class CarAndDriverAllotmentData {
  totalRecords: number;
  driverInventoryAssociationModel: DriverInventoryAssociation[];
  constructor(carAndDriverAllotmentData) {
    this.totalRecords = carAndDriverAllotmentData.totalRecords || '';
    this.driverInventoryAssociationModel = carAndDriverAllotmentData.driverInventoryAssociationModel;
  }
}

export class  TripDetails {
  bookingNumber: number=123;
  // booker: string;
  // vendorStatus:string;
  // vendor:string;
  // vehicleStatus:string;
  // vendorBookingNumber:number;

//  constructor(tripDetails) {
//    {
//       this.bookingNumber = tripDetails.bookingNumber || '';
//       this.booker = tripDetails.booker || '';
//       this.vendorStatus = tripDetails.vendorStatus || '';
//       this.vendor = tripDetails.vendor || '';
//       this.vehicleStatus =tripDetails.vehicleStatus || '';
//       this.vendorBookingNumber = tripDetails.vendorBookingNumber || '';
//    }
//  }
}

export class  DriverNotification {
  bidID: number;
  userID:number;
  reservationID: number;
  bidSentTo:string;
  driverIDList:number;
  bidOpenRemark:string;
  

 constructor(driverNotification) {
   {
      this.bidID = driverNotification.bidID || '';
      this.reservationID = driverNotification.reservationID || '';
      this.bidSentTo = driverNotification.bidSentTo || '';
      this.bidOpenRemark =driverNotification.bidOpenRemark || '';
   }
 }
}

export class  Notification {
  driverID: number;
  driverName: string;
  phone:string;
  driverSupplierID: number;
  driverSupplierName: string;
  driverSupplierEmail:string;
  driverSupplierPhone:string;
  
  inventoryID: number;
  registrationNumber: string;
  carSupplierID: number;
  carSupplierName: string;
  carSupplierEmail:string;
  carSupplierPhone:string;
  

 constructor(notification) {
   {
      this.driverID = notification.driverID || '';
      this.driverName = notification.driverName || '';
      this.phone = notification.phone || '';
      this.driverSupplierID = notification.driverSupplierID || '';
      this.driverSupplierName =notification.driverSupplierName || '';
      this.driverSupplierEmail = notification.driverSupplierEmail || '';
      this.driverSupplierPhone = notification.driverSupplierPhone || '';
      this.inventoryID = notification.inventoryID || '';
      this.registrationNumber = notification.registrationNumber || '';
      this.carSupplierID =notification.carSupplierID || '';
      this.carSupplierName = notification.carSupplierName || '';
      this.carSupplierEmail = notification.carSupplierEmail || '';
      this.carSupplierPhone = notification.carSupplierPhone || '';
   }
 }
}

export class BidDetails{
  dateOfBid: Date;
  timeOfBid: Date;
  bidStatus:string;
  bidOpenRemark:string;
  driverList: Notification[];
  constructor(bidDetails) {
    this.dateOfBid = bidDetails.dateOfBid || '';
    this.timeOfBid = bidDetails.timeOfBid || '';
    this.bidStatus = bidDetails.bidStatus || '';
    this.bidOpenRemark = bidDetails.bidOpenRemark || '';
    this.driverList = bidDetails.driverList;
  }
}

export class ExistingBidsData {
  bidDetailsList: BidDetails[];
  
  constructor(existingBidsData) {
    this.bidDetailsList = existingBidsData.bidDetailsList || '';
    
  }
}

export class DriverDutyData {
  allotmentID: number;
  reservationID: number;
  driverID:number;
  driverName:string;
  pickupDate:Date;
  pickupTime:Date;
  pickupSpotTypeID:number;
  pickupSpotType:string;
  pickupSpotID:number;
  pickupSpot:string;
  pickupAddress:string;
  pickupAddressDetails:string;
  dropOffDate:Date;
  dropOffTime:Date;
  dropOffAddress:string;
  allotmentStatus:string;

 constructor(driverDutyData) {
   {
      this.allotmentID = driverDutyData.allotmentID || -1;
      this.reservationID = driverDutyData.reservationID || '';
      this.driverID = driverDutyData.driverID || '';
      this.driverName = driverDutyData.driverName || '';
      this.pickupDate = driverDutyData.pickupDate || '';
      this.pickupTime = driverDutyData.pickupTime || '';
      this.pickupSpotTypeID = driverDutyData.pickupSpotTypeID || '';
      this.pickupSpotType=driverDutyData.pickupSpotType || '';
      this.pickupSpotID = driverDutyData.pickupSpotID || '';
      this.pickupSpot=driverDutyData.pickupSpot || '';
      this.pickupAddress = driverDutyData.pickupAddress || '';
      this.dropOffDate = driverDutyData.dropOffDate || '';
      this.dropOffTime = driverDutyData.dropOffTime || '';
      this.dropOffAddress=driverDutyData.dropOffAddress || '';
      this.allotmentStatus = driverDutyData.allotmentStatus || '';
   }
 }
 
}

export class AllotmentNotification {
  driverAllotmentNotificationID: number;
  userID:number;
  allotmentID: number;
  acceptanceNotificationSentToDriverRemark:string;
 constructor(allotmentNotification) {
   {
      this.driverAllotmentNotificationID = allotmentNotification.driverAllotmentNotificationID || -1;
      this.allotmentID = allotmentNotification.allotmentID || '';
      this.acceptanceNotificationSentToDriverRemark = allotmentNotification.acceptanceNotificationSentToDriverRemark || '';
      
   }
 }
 
}

export class AllotmentNotificationReply {
  driverAllotmentNotificationID: number;
  userID:number;
  allotmentID: number;
  driverAcceptanceStatus:string;
  driverAcceptanceRemark:string;
  driverAcceptanceEnteredByEmployeeID:number;
 constructor(allotmentNotificationReply) {
   {
      this.driverAllotmentNotificationID = allotmentNotificationReply.driverAllotmentNotificationID || '';
      this.allotmentID = allotmentNotificationReply.allotmentID || '';
      this.driverAcceptanceStatus = allotmentNotificationReply.driverAcceptanceStatus || '';
      this.driverAcceptanceRemark = allotmentNotificationReply.driverAcceptanceRemark || '';
      this.driverAcceptanceEnteredByEmployeeID = allotmentNotificationReply.driverAcceptanceEnteredByEmployeeID || '';
      
   }
 }
}


export class DriverModel {
  longitude:string;
  latitude:string;
  geoLocation:string;
  eTRAvailabilityGeoLocation: string;
 constructor(driverModel) {
   {
    this.eTRAvailabilityGeoLocation = driverModel.eTRAvailabilityGeoLocation || '';
    this.geoLocation = driverModel.geoLocation || '';
      this.latitude = driverModel.latitude || '';
      this.longitude = driverModel.longitude || '';
      //this.driverAcceptanceEnteredByEmployeeID = driverModel.driverAcceptanceEnteredByEmployeeID || '';

   }
 }


 
}

export class DriversRestrictedForPassengerModel {
  driverID:number;
  driverName:string;
  message:string;
 constructor(driversRestrictedForPassengerModel) {
  {
    this.driverID = driversRestrictedForPassengerModel.driverID || '';
    this.driverName = driversRestrictedForPassengerModel.driverName || '';
    this.message = driversRestrictedForPassengerModel.message || '';

  }
 }
}

export class CarsRestrictedForPassengerModel {
  inventoryID:number;
  registrationNumber:string;
  message:string;
 constructor(carsRestrictedForPassengerModel) {
  {
    this.inventoryID = carsRestrictedForPassengerModel.inventoryID || '';
    this.registrationNumber = carsRestrictedForPassengerModel.registrationNumber || '';
    this.message = carsRestrictedForPassengerModel.message || '';

  }
 }
}

