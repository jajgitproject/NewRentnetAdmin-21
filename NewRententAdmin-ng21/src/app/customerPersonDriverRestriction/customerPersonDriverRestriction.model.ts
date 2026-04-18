// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDriverRestriction {
   customerPersonDriverRestrictionID: number;
   customerPersonID:number;
   driverID:number;
   driver:string;
   remark: string;
   activationStatus:boolean;
   userID:number;
  constructor(customerPersonDriverRestriction) {
    {
       this.customerPersonDriverRestrictionID = customerPersonDriverRestriction.customerPersonDriverRestrictionID || -1;
       this.customerPersonID = customerPersonDriverRestriction.customerPersonID || '';
       this.driverID = customerPersonDriverRestriction.driverID || '';
       this.remark = customerPersonDriverRestriction.remark || '';
       this.activationStatus = customerPersonDriverRestriction.activationStatus || '';
    }
  }
  
}

