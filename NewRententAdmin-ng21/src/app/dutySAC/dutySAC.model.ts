// @ts-nocheck

import { formatDate } from '@angular/common';
export class DutySACModel {
  dutySACID: number;
  dutySlipID: number;
  sacid: number;
  sacNumber: string;
  changedByID: number;
  changedByName: string;
  reasonOfChange: string;
  changeDateTimeString:string;
  changeDateTime:Date;
  activationStatus: boolean;
  length: number;
  userID: number;

  constructor(dutySACModel) {
    {
       this.dutySACID = dutySACModel.dutySACID || -1;
       this.dutySlipID = dutySACModel.dutySlipID || '';
       this.sacid = dutySACModel.sacid || '';
       this.sacNumber = dutySACModel.sacNumber || '';
       this.changedByID = dutySACModel.changedByID || '';
       this.reasonOfChange = dutySACModel.reasonOfChange || '';
       this.changeDateTimeString = dutySACModel.changeDateTimeString || '';
       this.activationStatus = dutySACModel.activationStatus || '';
       this.changeDateTime=new Date();
    }
  }
  
}
