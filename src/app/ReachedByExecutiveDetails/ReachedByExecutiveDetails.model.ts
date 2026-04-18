// @ts-nocheck
import { formatDate } from '@angular/common';

export class ReachedByExecutiveDetails {
  dutySlipID:number;
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

  constructor(ReachedByExecutiveDetails) {
    {
      this.dutySlipID = ReachedByExecutiveDetails.dutySlipID || '';
       this.reportingToGuestEntryExecutiveID = ReachedByExecutiveDetails.reportingToGuestEntryExecutiveID || '';
       this.reportingToGuestEntryMethod = ReachedByExecutiveDetails.reportingToGuestEntryMethod || '';
       this.executive = ReachedByExecutiveDetails.executive || '';
       this.firstName = ReachedByExecutiveDetails.firstName || '';
       this.lastName = ReachedByExecutiveDetails.lastName || '';
       this.reportingToGuestDateString = ReachedByExecutiveDetails.reportingToGuestDateString || '';
       this.reportingToGuestTimeString = ReachedByExecutiveDetails.reportingToGuestTimeString || '';
       this.reportingToGuestAddressString = ReachedByExecutiveDetails.reportingToGuestAddressString || '';
       this.latitude = ReachedByExecutiveDetails.latitude || '';
       this.longitude = ReachedByExecutiveDetails.longitude || '';
       this.reportingToGuestKM = ReachedByExecutiveDetails.reportingToGuestKM || '';
       this.reportingToGuestLatLong = ReachedByExecutiveDetails.reportingToGuestLatLong || '';
       this.pickupDateString = ReachedByExecutiveDetails.pickupDateString || '';
       this.pickupTimeString = ReachedByExecutiveDetails.pickupTimeString || '';

       this.reportingToGuestDateStringByApp = ReachedByExecutiveDetails.reportingToGuestDateStringByApp || '';
       this.reportingToGuestTimeStringByApp = ReachedByExecutiveDetails.reportingToGuestTimeStringByApp || '';
       this.reportingToGuestAddressStringByApp = ReachedByExecutiveDetails.reportingToGuestAddressStringByApp || '';
       this.latitudeByApp = ReachedByExecutiveDetails.latitudeByApp || '';
       this.longitudeByApp = ReachedByExecutiveDetails.longitudeByApp || '';
       this.reportingToGuestKMByApp = ReachedByExecutiveDetails.reportingToGuestKMByApp || '';
       this.reportingToGuestLatLongByApp = ReachedByExecutiveDetails.reportingToGuestLatLongByApp || '';
       
       this.pickupDate=new Date();
       this.pickupTime=new Date();
       this.reportingToGuestDate=new Date();
       this.reportingToGuestTime=new Date();

       this.reportingToGuestDateByApp=new Date();
       this.reportingToGuestTimeByApp=new Date();
    }
  } 
}


