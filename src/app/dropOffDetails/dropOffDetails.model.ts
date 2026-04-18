// @ts-nocheck
import { formatDate } from '@angular/common';
export class DropOffDetails {
   dropOffDetailsID: number;
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
   dropOffDetails:string;

  constructor(dropOffDetails) {
    {
       this.dropOffDetailsID = dropOffDetails.dropOffDetailsID || -1;
       this.reservationID = dropOffDetails.reservationID || '';
       //this.location = dropOffDetails.location || '';
       this.stopCityID = dropOffDetails.stopCityID || '';
       this.stopAddress = dropOffDetails.stopAddress || '';
       this.stopAddressGeoLocation = dropOffDetails.stopAddressGeoLocation || '';
       this.stopLongitude = dropOffDetails.stopLongitude || '';
       this.stopLatitude = dropOffDetails.stopLatitude || '';
       this.stopSpotID = dropOffDetails.stopSpotID || '';
      // this.stopTime = dropOffDetails.stopTime || '';
       this.stopDateString = dropOffDetails.stopDateString || '';
       this.stopTimeString= dropOffDetails.stopTimeString||'',
       this.activationStatus = dropOffDetails.activationStatus || '';
       this.updatedBy=dropOffDetails.updatedBy || 10;
       this.updateDateTime = dropOffDetails.updateDateTime;
       this.stopDate=new Date();
       this.stopTime=new Date();
    }
  }
  
}

