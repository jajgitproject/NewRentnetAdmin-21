// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonPreferedDriver {
   customerPersonPreferedDriverID: number;
   customerPersonID:number;
   driverID:number;
   driver:string;
   activationStatus:boolean;
  userID:number;
  constructor(customerPersonPreferedDriver) {
    {
       this.customerPersonPreferedDriverID = customerPersonPreferedDriver.customerPersonPreferedDriverID || -1;
       this.customerPersonID = customerPersonPreferedDriver.customerPersonID || '';
       this.driverID = customerPersonPreferedDriver.driverID || '';
       this.activationStatus = customerPersonPreferedDriver.activationStatus || '';
    }
  }
  
}

