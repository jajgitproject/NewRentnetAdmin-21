// @ts-nocheck
import { formatDate } from '@angular/common';

export class StopDetailsShowModel {
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
  country:string;
  state:string;
  city:string;
  geoPointID: any;
  activationStatus:boolean;
}


