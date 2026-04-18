// @ts-nocheck
import { formatDate } from '@angular/common';
export class  DisputeHistory {
  dutySlipID: number;
  disputeID: number;
  dutySlipForBillingID: number;
  disputeKM: number;
  disputeMinutes:number;
  // disputeApprovedByID:number;
  disputeDetails:string;
  disputeBy:string;
  disputeTypeID: number;
  disputeType: string;
  userID: number;
  disputeByID: number;
  disputeDate: Date;
  disputeTime: Date;
disputeDateString:string;
  disputeTimeString:string;
  disputeSupportingDoc:string
  activationStatus: boolean;
  
 constructor(disputeHistory) {
   {
    this.disputeID  = disputeHistory.disputeID  || -1;
    this.disputeTypeID = disputeHistory.disputeTypeID || 0;
    this.dutySlipID = disputeHistory.dutySlipID || '';
    this.disputeByID = disputeHistory.disputeByID || '';
    this.dutySlipForBillingID = disputeHistory.dutySlipForBillingID || 0;
    this.disputeKM = disputeHistory.disputeKM || '';
    this.disputeMinutes = disputeHistory.disputeMinutes || '';
    // this.disputeApprovedByID = dispute.disputeApprovedByID || '';
    this.disputeDetails = disputeHistory.disputeDetails || '';
    this.disputeSupportingDoc = disputeHistory.disputeSupportingDoc || '';
    this.disputeBy = disputeHistory.disputeBy || '';
   
    this.disputeType = disputeHistory.disputeType || ''; 
    this.disputeDateString = disputeHistory.disputeDateString || '';  
    this.disputeTimeString = disputeHistory.disputeTimeString || '';     
    this.activationStatus = disputeHistory.activationStatus || '';
    this.disputeDate=new Date();
    this.disputeTime=new Date();   
   }
 }
}
