// @ts-nocheck
import { formatDate } from '@angular/common';

export class GarageOutDetails {
  locationOutEntryExecutiveID: number;
  dutySlipID:number;
  dutySlipByDriverID:number;
  locationOutEntryMethod: string;
  executive:string;
  locationOutLocationOrHubID:number;
  locationOutLocationOrHub:string;
  locationOutKM:number;
  locationOutDateString:string;
  locationOutDate:Date;
  locationOutTimeString:string;
  locationOutTime:Date;
  locationOutAddressString:string;
  locationOutLatitude:string;
  locationOutLongitude:string;
  manualDutySlipNumber:string;
  actualCarMovedFrom:string;
  firstName:string;
  lastName:string;
  locationOutLatLong:string;

  locationOutKMByApp:number;
  locationOutLatitudeByApp:string;
  locationOutLongitudeByApp:string;
  locationOutAddressStringByApp:string;
  locationOutDateByApp:Date;
  locationOutDateByAppString:string;
  locationOutTimeByApp:Date;
  locationOutTimeByAppString:string;
  locationOutLatLongByApp:string;

  constructor(GarageOutDetails) {
    {
       this.locationOutEntryExecutiveID = GarageOutDetails.locationOutEntryExecutiveID || '';
       this.manualDutySlipNumber = GarageOutDetails.manualDutySlipNumber || '';
       this.dutySlipID = GarageOutDetails.dutySlipID || '';
       this.dutySlipByDriverID = GarageOutDetails.dutySlipByDriverID || '';
       this.locationOutEntryMethod = GarageOutDetails.locationOutEntryMethod || '';
       //this.manualDutySlipNo = GarageOutDetails.manualDutySlipNo || '';
       this.locationOutKM = GarageOutDetails.locationOutKM || '';
       this.locationOutLocationOrHubID = GarageOutDetails.locationOutLocationOrHubID || '';
       this.locationOutLocationOrHub = GarageOutDetails.locationOutLocationOrHub || '';
       this.locationOutDateString = GarageOutDetails.locationOutDateString || '';
       this.locationOutTimeString = GarageOutDetails.locationOutTimeString || '';
       this.locationOutAddressString = GarageOutDetails.locationOutAddressString || '';
       this.locationOutLatitude = GarageOutDetails.locationOutLatitude || '';
       this.locationOutLongitude = GarageOutDetails.locationOutLongitude || '';
       this.actualCarMovedFrom = GarageOutDetails.actualCarMovedFrom || '';

       this.locationOutDateByAppString = GarageOutDetails.locationOutDateByAppString || '';
       this.locationOutTimeByAppString = GarageOutDetails.locationOutTimeByAppString || '';
       this.locationOutAddressStringByApp = GarageOutDetails.locationOutAddressStringByApp || '';
       this.locationOutLatitudeByApp = GarageOutDetails.locationOutLatitudeByApp || '';
       this.locationOutLongitudeByApp = GarageOutDetails.locationOutLongitudeByApp || '';
       this.locationOutKMByApp = GarageOutDetails.locationOutKMByApp || '';

       this.locationOutDate=new Date();
       this.locationOutTime=new Date();
       this.locationOutDateByApp=new Date();
       this.locationOutTimeByApp=new Date();
    }
  }
  
}

