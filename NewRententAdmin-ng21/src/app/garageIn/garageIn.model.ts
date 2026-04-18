// @ts-nocheck
import { formatDate } from '@angular/common';
export class GarageIn {
  locationInEntryExecutiveID: number;
  userID:number;
  dutySlipID:number;
  dutySlipByDriverID:number;
  locationInEntryMethod: string;
  executive:string;
 // locationInLocationOrHubID:number;
  locationInLocationOrHub:string;
  locationInKM:number;
  locationInDateString:string;
  locationInDate:Date;
  locationInTimeString:string;
  locationInTime:Date;
  locationInAddressString:string;
  locationInLatitude:string;
  locationInLongitude:string;
  manualDutySlipNumber:string;
  actualCarMovedFrom:string;
  firstName:string;
  lastName:string;
  locationInLatLong:string;

  locationInKMByApp:number;
  locationInLatitudeByApp:string;
  locationInLongitudeByApp:string;
  locationInAddressStringByApp:string;
  locationInDateByApp:Date;
  locationInDateByAppString:string;
  locationInTimeByApp:Date;
  locationInTimeByAppString:string;
  locationInLatLongByApp:string;

  constructor(garageIn) {
    {
       this.locationInEntryExecutiveID = garageIn.locationInEntryExecutiveID || '';
       this.manualDutySlipNumber = garageIn.manualDutySlipNumber || '';
       this.dutySlipID = garageIn.dutySlipID || '';
       this.dutySlipByDriverID = garageIn.dutySlipByDriverID || '';
       this.locationInEntryMethod = garageIn.locationInEntryMethod || '';
       //this.manualDutySlipNo = garageIn.manualDutySlipNo || '';
       this.locationInKM = garageIn.locationInKM || '';
       //this.locationInLocationOrHubID = garageIn.locationInLocationOrHubID || '';
       this.locationInLocationOrHub = garageIn.locationInLocationOrHub || '';
       this.locationInDateString = garageIn.locationInDateString || '';
       this.locationInTimeString = garageIn.locationInTimeString || '';
       this.locationInAddressString = garageIn.locationInAddressString || '';
       this.locationInLatitude = garageIn.locationInLatitude || '';
       this.locationInLongitude = garageIn.locationInLongitude || '';
       this.actualCarMovedFrom = garageIn.actualCarMovedFrom || '';

       this.locationInDateByAppString = garageIn.locationInDateByAppString || '';
       this.locationInTimeByAppString = garageIn.locationInTimeByAppString || '';
       this.locationInAddressStringByApp = garageIn.locationInAddressStringByApp || '';
       this.locationInLatitudeByApp = garageIn.locationInLatitudeByApp || '';
       this.locationInLongitudeByApp = garageIn.locationInLongitudeByApp || '';
       this.locationInKMByApp = garageIn.locationInKMByApp || '';

      //  this.locationInDate=new Date();
      //  this.locationInTime=new Date();
      //  this.locationInDateByApp=new Date();
      //  this.locationInTimeByApp=new Date();
    }
  }
  
}

export class FetchDataFromApp {
  pickupDate:Date;
  pickupTime:Date;
  pickupKM:string;
  pickupAddressString:string;
  pickupLatitude:string;
  pickupLongitude:string;

  constructor(fetchDataFromApp) {
    {
       this.pickupKM = fetchDataFromApp.pickupKM || '';
       this.pickupAddressString = fetchDataFromApp.pickupAddressString || '';
       this.pickupLatitude = fetchDataFromApp.pickupLatitude || '';
       this.pickupLongitude = fetchDataFromApp.pickupLongitude || '';
       this.pickupDate=new Date();
       this.pickupTime=new Date();
    }
  }
  
}

