// @ts-nocheck
import { formatDate } from '@angular/common';
export class  DriverRemarkDetails {

  dutySlipID: number;
  driverRemark: string;
  
 constructor(DriverRemarkDetails) {
   {
      this.dutySlipID = DriverRemarkDetails.dutySlipID || '';
      this.driverRemark = DriverRemarkDetails.driverRemark || '';
     
   }
 }
}
