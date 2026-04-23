// @ts-nocheck
import { formatDate } from '@angular/common';
export class FetchDataRBE {
   pickupDateString:string;
   pickupDate:Date;
   pickupTimeString:string;
   pickupTime:Date;

  constructor(fetchDataRBE) {
    {
       this.pickupDateString = fetchDataRBE.pickupDateString || '';
       this.pickupTimeString = fetchDataRBE.pickupTimeString || '';
       
       this.pickupDate=new Date();
       this.pickupTime=new Date();
    }
  }
  
}

