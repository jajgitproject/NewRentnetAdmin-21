// @ts-nocheck
import { formatDate } from '@angular/common';
export class DispatchFetchData {
  pickupDateString:string;
  pickupDate:Date;
  pickupTimeString:string;
  pickupTime:Date;
  
  constructor(dispatchFetchData) {
    {
       this.pickupDateString = dispatchFetchData.pickupDateString || '';
       this.pickupTimeString = dispatchFetchData.pickupTimeString || '';
       
       this.pickupDate=new Date();
       this.pickupTime=new Date();
    }
  }
  
}

