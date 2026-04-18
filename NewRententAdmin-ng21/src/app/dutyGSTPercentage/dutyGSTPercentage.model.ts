// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyGSTPercentage {
  dutyGSTPercentageID: number;
  dutySlipID: number;
  gstPercentageID: number;
  gstPercentage: string;
  changedByID: number;
  changedByName: string;
  reasonOfChange: string;
  changeDateTimeString:string;
  changeDateTime:Date;
  activationStatus: boolean;
  userID: number;

  constructor(dutyGSTPercentage) {
    {
       this.dutyGSTPercentageID = dutyGSTPercentage.dutyGSTPercentageID || -1;
       this.dutySlipID = dutyGSTPercentage.dutySlipID || '';
       this.gstPercentageID = dutyGSTPercentage.gstPercentageID || '';
       this.gstPercentage = dutyGSTPercentage.gstPercentage || '';
       this.changedByID = dutyGSTPercentage.changedByID || '';
       this.reasonOfChange = dutyGSTPercentage.reasonOfChange || '';
       this.changeDateTimeString = dutyGSTPercentage.changeDateTimeString || '';
       this.activationStatus = dutyGSTPercentage.activationStatus || '';
       this.changeDateTime=new Date();
    }
  }
  
}
