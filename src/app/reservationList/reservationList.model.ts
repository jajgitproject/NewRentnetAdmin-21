// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationList {
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

   customerType: string;
   customerCustomerGroup: string;
   primaryBooker:string;
   primaryPassenger:string;
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

  constructor(reservationList) {
    {
       this.reservationID = reservationList.reservationID || -1;
       this.customerTypeID = reservationList.customerTypeID || '';
       this.customerID = reservationList.customerID || '';
       this.customerGroupID=reservationList.customerGroupID || '';
       this.primaryBookerID = reservationList.primaryBookerID || '';
       this.primaryPassengerID = reservationList.primaryPassengerID || '';
       this.vehicleCategoryID = reservationList.vehicleCategoryID || '';
       this.vehicleID=reservationList.vehicleID || '';
       this.packageTypeID = reservationList.packageTypeID || '';
       this.packageID = reservationList.packageID || '';
       this.pickupCityID = reservationList.pickupCityID || '';
       this.pickupDateString = reservationList.pickupDateString || '';
       this.pickupTimeString = reservationList.pickupTimeString || '';
       this.pickupSpotTypeID=reservationList.pickupSpotTypeID || '';
       this.pickupSpotID = reservationList.pickupSpotID || '';
       this.pickupAddress = reservationList.pickupAddress || '';
       this.pickupAddressDetails = reservationList.pickupAddressDetails || '';
       this.locationOutTimeString = reservationList.locationOutTimeString || '';
       this.serviceLocationID=reservationList.serviceLocationID || '';
       this.dropOffDateString = reservationList.dropOffDateString || '';
       this.dropOffTimeString = reservationList.dropOffTimeString || '';
       this.dropOffCityID = reservationList.dropOffCityID || '';
       this.dropOffSpotTypeID = reservationList.dropOffSpotTypeID || '';
       this.dropOffSpotID=reservationList.dropOffSpotID || '';
       this.dropOffAddress = reservationList.dropOffAddress || '';
       this.dropOffAddressDetails = reservationList.dropOffAddressDetails || '';
       this.ticketNumber = reservationList.ticketNumber || '';
       this.attachment = reservationList.attachment || '';
       this.emailLink=reservationList.emailLink || '';
       this.reservationSourceID = reservationList.reservationSourceID || '';
       this.reservationSourceDetail = reservationList.reservationSourceDetail || '';
       this.referenceNumber = reservationList.referenceNumber || '';
       this.reservationStatus = reservationList.reservationStatus || '';
    }
  }
  
}

