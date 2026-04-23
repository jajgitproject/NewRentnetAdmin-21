// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReachedByExecutive {
  dutySlipID:number;
  userID:number;
  dutySlipByDriverID:number;
  reportingToGuestEntryExecutiveID: number;
  reportingToGuestEntryMethod: string;
  executive:string;
  firstName:string;
  lastName:string;
  reportingToGuestDate:Date;
  reportingToGuestDateString:string;
  reportingToGuestTime:Date;
  reportingToGuestTimeString:string;
  reportingToGuestAddressString:string;
  latitude:string;
  longitude:string;
  reportingToGuestKM:number;
  reportingToGuestLatLong:string;

  reportingToGuestDateByApp:Date;
  reportingToGuestDateStringByApp:string;
  reportingToGuestTimeByApp:Date;
  reportingToGuestTimeStringByApp:string;
  reportingToGuestAddressStringByApp:string;
  latitudeByApp:string;
  longitudeByApp:string;
  reportingToGuestKMByApp:number;
  reportingToGuestLatLongByApp:string;

  pickupDateString:string;
  pickupDate:Date;
  pickupTimeString:string;
  pickupTime:Date;

  constructor(reachedByExecutive) {
    {
      this.dutySlipID = reachedByExecutive.dutySlipID || '';
       this.reportingToGuestEntryExecutiveID = reachedByExecutive.reportingToGuestEntryExecutiveID || '';
       this.reportingToGuestEntryMethod = reachedByExecutive.reportingToGuestEntryMethod || '';
       this.executive = reachedByExecutive.executive || '';
       this.firstName = reachedByExecutive.firstName || '';
       this.lastName = reachedByExecutive.lastName || '';
       this.reportingToGuestDateString = reachedByExecutive.reportingToGuestDateString || '';
       this.reportingToGuestTimeString = reachedByExecutive.reportingToGuestTimeString || '';
       this.reportingToGuestAddressString = reachedByExecutive.reportingToGuestAddressString || '';
       this.latitude = reachedByExecutive.latitude || '';
       this.longitude = reachedByExecutive.longitude || '';
       this.reportingToGuestKM = reachedByExecutive.reportingToGuestKM || '';
       this.reportingToGuestLatLong = reachedByExecutive.reportingToGuestLatLong || '';
       this.pickupDateString = reachedByExecutive.pickupDateString || '';
       this.pickupTimeString = reachedByExecutive.pickupTimeString || '';

       this.reportingToGuestDateStringByApp = reachedByExecutive.reportingToGuestDateStringByApp || '';
       this.reportingToGuestTimeStringByApp = reachedByExecutive.reportingToGuestTimeStringByApp || '';
       this.reportingToGuestAddressStringByApp = reachedByExecutive.reportingToGuestAddressStringByApp || '';
       this.latitudeByApp = reachedByExecutive.latitudeByApp || '';
       this.longitudeByApp = reachedByExecutive.longitudeByApp || '';
       this.reportingToGuestKMByApp = reachedByExecutive.reportingToGuestKMByApp || '';
       this.reportingToGuestLatLongByApp = reachedByExecutive.reportingToGuestLatLongByApp || '';
       
       this.pickupDate=new Date();
       this.pickupTime=new Date();
      //  this.reportingToGuestDate=new Date();
       this.reportingToGuestTime=new Date();

       this.reportingToGuestDateByApp=new Date();
       this.reportingToGuestTimeByApp=new Date();
    }
  } 
}


export class DateTimeKMModel
{
  locationOutDate:Date;
  locationOutTime:Date;
  locationOutKM:number;
  reportingToGuestDate:Date;
  reportingToGuestTime:Date;
  reportingToGuestKM:number;
  pickupDate:Date;
  pickupTime:Date;
  pickupKM:number;
  dropOffDate:Date;
  dropOffTime:Date;
  dropOffKM:number;
}

