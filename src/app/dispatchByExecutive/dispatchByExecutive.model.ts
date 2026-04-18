// @ts-nocheck
import { formatDate } from '@angular/common';
export class DispatchByExecutive {
  locationOutEntryExecutiveID: number;
  userID:number;
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
  latitude:string;
  longitude:string;


  locationOutKMByApp:number;
  locationOutLatitudeByApp:string;
  locationOutLongitudeByApp:string;
  locationOutAddressStringByApp:string;
  locationOutDateByApp:Date;
  locationOutDateByAppString:string;
  locationOutTimeByApp:Date;
  locationOutTimeByAppString:string;
  locationOutLatLongByApp:string;

  constructor(dispatchByExecutive) {
    {
       this.locationOutEntryExecutiveID = dispatchByExecutive.locationOutEntryExecutiveID || '';
       this.manualDutySlipNumber = dispatchByExecutive.manualDutySlipNumber || '';
       this.dutySlipID = dispatchByExecutive.dutySlipID || '';
       this.dutySlipByDriverID = dispatchByExecutive.dutySlipByDriverID || '';
       this.locationOutEntryMethod = dispatchByExecutive.locationOutEntryMethod || '';
       //this.manualDutySlipNo = dispatchByExecutive.manualDutySlipNo || '';
       this.locationOutKM = dispatchByExecutive.locationOutKM || '';
       this.locationOutLocationOrHubID = dispatchByExecutive.locationOutLocationOrHubID || '';
       this.locationOutLocationOrHub = dispatchByExecutive.locationOutLocationOrHub || '';
       this.locationOutDateString = dispatchByExecutive.locationOutDateString || '';
       this.locationOutTimeString = dispatchByExecutive.locationOutTimeString || '';
       this.locationOutAddressString = dispatchByExecutive.locationOutAddressString || '';
       this.locationOutLatitude = dispatchByExecutive.locationOutLatitude || '';
       this.locationOutLongitude = dispatchByExecutive.locationOutLongitude || '';
       this.actualCarMovedFrom = dispatchByExecutive.actualCarMovedFrom || '';

       this.locationOutDateByAppString = dispatchByExecutive.locationOutDateByAppString || '';
       this.locationOutTimeByAppString = dispatchByExecutive.locationOutTimeByAppString || '';
       this.locationOutAddressStringByApp = dispatchByExecutive.locationOutAddressStringByApp || '';
       this.locationOutLatitudeByApp = dispatchByExecutive.locationOutLatitudeByApp || '';
       this.locationOutLongitudeByApp = dispatchByExecutive.locationOutLongitudeByApp || '';
       this.locationOutKMByApp = dispatchByExecutive.locationOutKMByApp || '';


       //this.locationOutDate=new Date();
       //this.locationOutTime=new Date();
       this.locationOutDateByApp=new Date();
       this.locationOutTimeByApp=new Date();
    }
  }
  
}

