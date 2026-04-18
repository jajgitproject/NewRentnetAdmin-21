// @ts-nocheck
import { formatDate } from '@angular/common';
export class TrackOnMapInfo {
  address:string;
  geoLocation:string;
  geoLatLong: string;
  longitude: number;
  locationTime:Date;
  dutySlipID:number;
  constructor(trackOnMapInfo) {
    {
       this.address = trackOnMapInfo.address || '';
       this.geoLocation = trackOnMapInfo.geoLocation || '';
       this.geoLatLong = trackOnMapInfo.geoLatLong || '';
       this.longitude = trackOnMapInfo.longitude || '';
       this.locationTime = trackOnMapInfo.locationTime || '';
       this.dutySlipID = trackOnMapInfo.dutySlipID || '';
      
    }
  }
  
}

