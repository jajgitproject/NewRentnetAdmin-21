// @ts-nocheck
import { formatDate } from '@angular/common';
export class PickUpByExecutive {
  dutySlipID:number;
  userID:number;
  pickupEntryExecutiveID: number;
  pickupEntryMethod:string;
  executive:string;
  pickUpDate:Date;
  pickUpDateString:string;
  pickUpTime:Date;
  pickUpTimeString:string;
  pickUpKM:number;
  pickUpAddressString:string;
  pickUpLatLong:string;
  pickUpLatitude:string;
  pickUpLongitude:string;
  firstName:string;
  lastName:string;

  constructor(pickUpByExecutive) {
    {
       this.dutySlipID = pickUpByExecutive.dutySlipID || '';
       this.pickupEntryExecutiveID = pickUpByExecutive.pickupEntryExecutiveID || '';
       this.executive = pickUpByExecutive.executive || '';
       this.pickupEntryMethod = pickUpByExecutive.pickupEntryMethod || '';
       this.pickUpDateString = pickUpByExecutive.pickUpDateString || '';
       this.pickUpTimeString = pickUpByExecutive.pickUpTimeString || '';
       this.pickUpKM = pickUpByExecutive.pickUpKM || '';
       this.pickUpAddressString = pickUpByExecutive.pickUpAddressString || '';
       this.pickUpLatitude = pickUpByExecutive.pickUpLatitude || '';
       this.pickUpLongitude = pickUpByExecutive.pickUpLongitude || '';
       this.pickUpDate=new Date();
       this.pickUpTime=new Date();
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

