// @ts-nocheck
import { formatDate } from '@angular/common';
export class Dispute {
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
  reservationID: number;
  approvalStatus:boolean;
  
  constructor(dispute) {
    {
      this.disputeID  = dispute.disputeID  || -1;
      this.disputeTypeID = dispute.disputeTypeID || 0;
      this.dutySlipID = dispute.dutySlipID || '';
      this.disputeByID = dispute.disputeByID || '';
      this.dutySlipForBillingID = dispute.dutySlipForBillingID || 0;
      this.disputeKM = dispute.disputeKM || '';
      this.disputeMinutes = dispute.disputeMinutes || '';
      // this.disputeApprovedByID = dispute.disputeApprovedByID || '';
      this.disputeDetails = dispute.disputeDetails || '';
      this.disputeSupportingDoc = dispute.disputeSupportingDoc || '';
      this.disputeBy = dispute.disputeBy || '';
     
      this.disputeType = dispute.disputeType || ''; 
      this.disputeDateString = dispute.disputeDateString || '';  
      this.disputeTimeString = dispute.disputeTimeString || '';     
      this.activationStatus = dispute.activationStatus || '';
      this.disputeDate=new Date();
      this.disputeTime=new Date();
      this.approvalStatus=dispute.approvalStatus || '';   
    }
  }
  
}

