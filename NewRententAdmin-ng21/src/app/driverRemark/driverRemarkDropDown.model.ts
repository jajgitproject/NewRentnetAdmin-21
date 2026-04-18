// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverRemarkDropDown {
   driverRemarkID: number;
   driverRemark: string;

  constructor(driverRemarkDropDown) {
    {
       this.driverRemarkID = driverRemarkDropDown.driverRemarkID || -1;
       this.driverRemark = driverRemarkDropDown.driverRemark || '';
    }
  }
  
}

