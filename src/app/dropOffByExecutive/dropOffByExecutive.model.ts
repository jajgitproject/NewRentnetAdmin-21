// @ts-nocheck
import { formatDate } from '@angular/common';
export class DropOffByExecutive {
  dropOffEntryExecutiveID: number;
  dutySlipID: number;
  userID:number;
  dutySlipByDriverID: number;
  dropOffEntryMethod:string;
  dropOffDate:Date;
  dropOffDateString:string;
  dropOffTime:Date;
  dropOffTimeString:string;
  firstName:string;
  lastName:string;
  //reservationID:number;
  dropOffKM: number;
   dropOffAddressString:string;
   dropOffLatLong:string;
   dropOffLongitude:string;
   dropOffLatitude:string;
   executive:string;
  pickupAddressString: any;

  constructor(dropOffByExecutive) {
    {
       this.dropOffEntryExecutiveID = dropOffByExecutive.dropOffEntryExecutiveID || '';
       this.dutySlipID = dropOffByExecutive.dutySlipID || '';
       this.dropOffEntryMethod = dropOffByExecutive.dropOffEntryMethod || '';
       this.dropOffDateString = dropOffByExecutive.dropOffDateString || '';
       this.dropOffTimeString = dropOffByExecutive.dropOffTimeString || '';
       this.dropOffKM = dropOffByExecutive.dropOffKM || '';
       this.dropOffAddressString = dropOffByExecutive.dropOffAddressString || '';
       this.dropOffLatLong = dropOffByExecutive.dropOffLatLong || '';
       this.dropOffLongitude = dropOffByExecutive.dropOffLongitude || '';
       this.dropOffLatitude = dropOffByExecutive.dropOffLatitude || '';
       this.firstName = dropOffByExecutive.firstName || '';
       this.lastName = dropOffByExecutive.lastName || '';
      //  this.dropOffTime=new Date();
      //  this.dropOffDate=new Date();

    }
  }
  
}

