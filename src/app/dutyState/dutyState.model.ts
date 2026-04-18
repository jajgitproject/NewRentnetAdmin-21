// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyState {
  dutyStateID: number;
  dutySlipID :number;
  stateID:number;
  changedByID:number;
  firstName:string;
   lastName:string;
   state:string;
   changeDateTime:Date;
   changeDateTimeString:string;
   reasonOfChange:string;

   activationStatus: boolean;
  userID: number;

  constructor(dutyState) {
    {
       this.dutyStateID = dutyState.dutyStateID || -1;
       this.dutySlipID = dutyState.dutySlipID || '';
       this.stateID = dutyState.stateID || '';
       this.changedByID = dutyState.changedByID || '';
       this.firstName = dutyState.firstName || '';
       this.lastName = dutyState.lastName || '';
       this.changeDateTimeString = dutyState.changeDateTimeString || '';
       this.reasonOfChange=dutyState.reasonOfChange || '';
       this.activationStatus = dutyState.activationStatus || '';
       this.changeDateTime =new Date();
    }
  }
  
}

