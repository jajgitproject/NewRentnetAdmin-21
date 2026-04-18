// @ts-nocheck
import { formatDate } from '@angular/common';
export class DisputeResolution {
  disputeResolutionID: number;
  disputeID: number;
  actionTakenDate:Date;
  actionTakenTimeString:string;
  actionTakenDateString:string;
  actionTakenTime:Date;
    actionTaken:string;
    actionTakenByID:number;
    actionTakenByName:string;
    activationStatus:boolean;
    userID: number;
   
  constructor(disputeResolution) {
    {
       this.disputeResolutionID = disputeResolution. disputeResolutionID || -1;
       this.disputeID = disputeResolution. disputeID || '';
       this.actionTakenTimeString = disputeResolution. actionTakenTimeString || '';
       this.actionTakenDateString = disputeResolution. actionTakenDateString || '';
       this.actionTaken = disputeResolution. actionTaken || '';
       this.actionTakenByID = disputeResolution. actionTakenByID || '';
       this.actionTakenByName = disputeResolution. actionTakenByName || '';
       this.activationStatus =  disputeResolution.activationStatus || '';
       this.actionTakenDate=new Date();
       this.actionTakenTime=new Date();
    }
  }
  
}

