// @ts-nocheck
import { formatDate } from '@angular/common';
export class AddStop {
   addStopID: number;
   reservationID: number;
   stopCityID:number;
   stopAddress:string;
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

  constructor(addStop) {
    {
       this.addStopID = addStop.addStopID || -1;
       this.reservationID = addStop.reservationID || '';
       //this.location = addStop.location || '';
       this.stopCityID = addStop.stopCityID || '';
       this.stopAddress = addStop.stopAddress || '';
       this.stopAddressGeoLocation = addStop.stopAddressGeoLocation || '';
       this.stopLongitude = addStop.stopLongitude || '';
       this.stopLatitude = addStop.stopLatitude || '';
       this.stopSpotID = addStop.stopSpotID || '';
      // this.stopTime = addStop.stopTime || '';
       this.stopDateString = addStop.stopDateString || '';
       this.stopTimeString= addStop.stopTimeString||'',
       this.activationStatus = addStop.activationStatus || '';
       this.updatedBy=addStop.updatedBy || 10;
       this.updateDateTime = addStop.updateDateTime;
       this.stopDate=new Date();
       this.stopTime=new Date();
    }
  }
  
}

