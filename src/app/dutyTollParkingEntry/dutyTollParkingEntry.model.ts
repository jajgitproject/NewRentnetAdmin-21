// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyTollParkingEntry {
   dutyTollParkingID: number;
   tollParkingTypeID: number;
   tollParkingType:string;
   dutySlipID:number;
   tollParkingAmount:number;
   paymentType:string;
   tollParkingImage:string;
   approvalStatus:string;
   approvedByID:number;
   approvedBy:string;
   approvalRemark:string;
   approvalDate:Date;
   approvalDateString:string;
   activationStatus: boolean;
   firstName:string;
   lastName:string;
   userID:number

  constructor(dutyTollParkingEntry) {
    {
       this.dutyTollParkingID = dutyTollParkingEntry.dutyTollParkingID || -1;
       this.tollParkingTypeID = dutyTollParkingEntry.tollParkingTypeID || '';
       this.dutySlipID = dutyTollParkingEntry.dutySlipID || '';
       this.tollParkingAmount = dutyTollParkingEntry.tollParkingAmount || '';
       this.paymentType = dutyTollParkingEntry.paymentType || '';
       this.tollParkingImage = dutyTollParkingEntry.tollParkingImage || '';
       this.approvalStatus = dutyTollParkingEntry.approvalStatus || '';
       this.approvedByID = dutyTollParkingEntry.approvedByID || '';
       this.approvalRemark = dutyTollParkingEntry.approvalRemark || '';
       this.approvalDateString = dutyTollParkingEntry.approvalDateString || '';
       this.approvalDate=new Date();
       this.activationStatus = dutyTollParkingEntry.activationStatus || '';
    }
  }
  
}

