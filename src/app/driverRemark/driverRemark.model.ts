// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverRemark {
  dutySlipID: number;
  userID:number;
   driverRemark: string;
   activationStatus: boolean;

  constructor(driverRemark) {
    {
       this.dutySlipID = driverRemark.dutySlipID || -1;
       this.driverRemark = driverRemark.driverRemark || '';
       this.activationStatus = driverRemark.activationStatus || '';
    }
  }
  
}

