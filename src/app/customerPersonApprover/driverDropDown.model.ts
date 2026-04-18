// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverDropDown {
 
   driverID: number;
   driverName: string;

  constructor(driverDropDown) {
    {
       this.driverID = driverDropDown.driverID || -1;
       this.driverName = driverDropDown.driverName || '';
    }
  }
  
}

