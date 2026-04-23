// @ts-nocheck

import { formatDate } from '@angular/common';
export class BookingScreen {
    reservationID: number;
    customerTypeID: number;
    customerID: number;
    customerGroupID: number;
    primaryBookerID: number;
    primaryPassengerID: number;
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
 
   constructor(bookingScreen) {
     {
        this.reservationID = bookingScreen.reservationID || -1;
        this.customerTypeID = bookingScreen.customerTypeID || '';
        this.customerID = bookingScreen.customerID || '';
        this.customerGroupID=bookingScreen.customerGroupID || '';
        this.primaryBookerID = bookingScreen.primaryBookerID || '';
        this.primaryPassengerID = bookingScreen.primaryPassengerID || '';
        this.vehicleCategoryID = bookingScreen.vehicleCategoryID || '';
        this.vehicleID=bookingScreen.vehicleID || '';
        this.packageTypeID = bookingScreen.packageTypeID || '';
        this.packageID = bookingScreen.packageID || '';
 
        this.pickupCityID = bookingScreen.pickupCityID || '';
        this.pickupDateString = bookingScreen.pickupDateString || '';
        this.pickupTimeString = bookingScreen.pickupTimeString || '';
        this.pickupSpotTypeID=bookingScreen.pickupSpotTypeID || '';
        this.pickupSpotID = bookingScreen.pickupSpotID || '';
        this.pickupAddress = bookingScreen.pickupAddress || '';
        this.pickupAddressDetails = bookingScreen.pickupAddressDetails || '';
 
        this.locationOutTimeString = bookingScreen.locationOutTimeString || '';
        this.serviceLocationID=bookingScreen.serviceLocationID || '';
 
        this.dropOffDateString = bookingScreen.dropOffDateString || '';
        this.dropOffTimeString = bookingScreen.dropOffTimeString || '';
        this.dropOffCityID = bookingScreen.dropOffCityID || '';
        this.dropOffSpotTypeID = bookingScreen.dropOffSpotTypeID || '';
        this.dropOffSpotID=bookingScreen.dropOffSpotID || '';
        this.dropOffAddress = bookingScreen.dropOffAddress || '';
        this.dropOffAddressDetails = bookingScreen.dropOffAddressDetails || '';
 
        this.ticketNumber = bookingScreen.ticketNumber || '';
        this.attachment = bookingScreen.attachment || '';
        this.emailLink=bookingScreen.emailLink || '';
        this.reservationSourceID = bookingScreen.reservationSourceID || '';
        this.reservationSourceDetail = bookingScreen.reservationSourceDetail || '';
        this.referenceNumber = bookingScreen.referenceNumber || '';
        this.reservationStatus = bookingScreen.reservationStatus || '';
     }
   }
   
}


