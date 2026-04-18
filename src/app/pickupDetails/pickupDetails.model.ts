// @ts-nocheck
import { formatDate } from '@angular/common';
export class PickupDetails {
   pickupDetailsID: number;
   reservationID: number;
   stopCityID:number;
   stopAddress:string;
   date:string;
   time:string;
   country:string
   state:string;
   stopAddressGeoLocation:string;
   //location:string;
   stopLongitude:string;
   stopLatitude:string;
   stopSpotID:Number;
   stopDate:Date;
   stopDateString:string;
   stopTime:Date;
   stopTimeString:string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;
   cityGroup:string;
   city:string;
   googleAddressString:string;
   pickupDetails:string;

  constructor(pickupDetails) {
    {
       this.pickupDetailsID = pickupDetails.pickupDetailsID || -1;
       this.reservationID = pickupDetails.reservationID || '';
       //this.location = pickupDetails.location || '';
       this.stopCityID = pickupDetails.stopCityID || '';
       this.stopAddress = pickupDetails.stopAddress || '';
       this.stopAddressGeoLocation = pickupDetails.stopAddressGeoLocation || '';
       this.stopLongitude = pickupDetails.stopLongitude || '';
       this.stopLatitude = pickupDetails.stopLatitude || '';
       this.stopSpotID = pickupDetails.stopSpotID || '';
      // this.stopTime = pickupDetails.stopTime || '';
       this.stopDateString = pickupDetails.stopDateString || '';
       this.stopTimeString= pickupDetails.stopTimeString||'',
       this.activationStatus = pickupDetails.activationStatus || '';
       this.updatedBy=pickupDetails.updatedBy || 10;
       this.updateDateTime = pickupDetails.updateDateTime;
       this.stopDate=new Date();
       this.stopTime=new Date();
    }
  }
  
}

