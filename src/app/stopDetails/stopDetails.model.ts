// @ts-nocheck
import { formatDate } from '@angular/common';
export class StopDetails {
  reservationStopID:number;
  reservationID:number;
  procCalledFrom:string;
  reservationStopType:string;
  reservationStopCityID:number;
  reservationStopSpotTypeID:number;
  reservationStopSpotType:string;
  reservationStopSpotID:number;
  reservationStopSpot:string;
  reservationStopAddress:string;
  reservationStopAddressDetails:string;
  reservationStopDate:Date;
  reservationStopTime: Date;
  reservationStopDateString:string;
  reservationStopTimeString:string;
  activationStatus:boolean;
  country:string;
  state:string;
  city:string;
  geoPointID: any;

  constructor(stopDetails) {
    {
      this.reservationStopID = stopDetails.reservationStopID || -1;
      this.reservationID = stopDetails.reservationID || '';
      this.procCalledFrom = stopDetails.procCalledFrom || '';
      this.reservationStopType = stopDetails.reservationStopType || '';
      this.reservationStopCityID = stopDetails.reservationStopCityID || '';
      this.reservationStopSpotTypeID = stopDetails.reservationStopSpotTypeID || '';
      this.reservationStopSpotID = stopDetails.reservationStopSpotID || '';
      this.reservationStopAddress = stopDetails.reservationStopAddress || '';
      this.reservationStopDateString = stopDetails.reservationStopDateString || '';
      this.reservationStopDate = stopDetails.reservationStopDate || '';
      this.reservationStopTimeString = stopDetails.reservationStopTimeString || '';
      this.reservationStopAddressDetails = stopDetails.reservationStopAddressDetails || '';
      this.activationStatus = stopDetails.activationStatus || '';
    }
  }
  
}

