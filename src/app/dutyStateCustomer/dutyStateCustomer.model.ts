// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyStateCustomer {
  dutyStateCustomerID: number;
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

  constructor(dutyStateCustomer) {
    {
       this.dutyStateCustomerID = dutyStateCustomer.dutyStateCustomerID || -1;
       this.dutySlipID = dutyStateCustomer.dutySlipID || '';
       this.stateID = dutyStateCustomer.stateID || '';
       this.changedByID = dutyStateCustomer.changedByID || '';
       this.firstName = dutyStateCustomer.firstName || '';
       this.lastName = dutyStateCustomer.lastName || '';
       this.changeDateTimeString = dutyStateCustomer.changeDateTimeString || '';
       this.reasonOfChange=dutyStateCustomer.reasonOfChange || '';
       this.activationStatus = dutyStateCustomer.activationStatus || '';
       this.changeDateTime =new Date();
    }
  }
  
}

