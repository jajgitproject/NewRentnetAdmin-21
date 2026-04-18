// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationStopDetails {
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
  reservationStopAddressLatLong:string;
  reservationStopAddressDetails:string;
  reservationStopDate:Date;
  reservationStopTime: Date;
  reservationStopDateString:string;
  reservationStopTimeDateString:string;
  activationStatus:boolean;
  country:string;
  state:string;
  city:string;
  geoPointID: any;
  geoPointName:string;
  reservationStopCity:string;
  reservationStopCountry:string;
  reservationStopState: string;
  userID:number;
  reservationStopOrderPriority:number;
  isTimeNotConfirmed:boolean
  constructor(reservationStopDetails) {
    {
       this.reservationStopID = reservationStopDetails.reservationStopID || -1;
       this.reservationID = reservationStopDetails.reservationID || '';
       this.procCalledFrom = reservationStopDetails.procCalledFrom || '';
       this.reservationStopType = reservationStopDetails.reservationStopType || '';
       this.reservationStopCityID = reservationStopDetails.reservationStopCityID || '';
       this.reservationStopSpotTypeID = reservationStopDetails.reservationStopSpotTypeID || 0;
       this.reservationStopSpotID = reservationStopDetails.reservationStopSpotID || 0;
       this.reservationStopAddress = reservationStopDetails.reservationStopAddress || '';
       this.reservationStopDateString = reservationStopDetails.reservationStopDateString || '';
       this.reservationStopTimeDateString = reservationStopDetails.reservationStopTimeDateString || '';
       this.reservationStopAddressDetails = reservationStopDetails.reservationStopAddressDetails || '';
       this.activationStatus = reservationStopDetails.activationStatus || '';
       this.reservationStopOrderPriority = reservationStopDetails.reservationStopOrderPriority || '';
       this.isTimeNotConfirmed = reservationStopDetails.isTimeNotConfirmed || '';
    }
  }
  
}

