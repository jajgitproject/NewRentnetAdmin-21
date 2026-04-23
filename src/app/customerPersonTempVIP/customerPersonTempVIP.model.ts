// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonTempVIP {
  customerPersonTempVIPID: number;
  customerPersonID: number;
  incidenceID:number;
  forNumberofBookings:number;
  vipStatusStartDate: Date;
  vipStatusEndDate:Date;
  forNumberofBookingsStartsFrom:Date;
  vipStatusStartDateString:string;
  remark:string;
  forNumberofBookingsStartsFromString:string;
  vipStatusEndDateString:string;
   activationStatus:boolean;
   userID:number
  constructor(customerPersonTempVIP) {
    {
       this.customerPersonTempVIPID = customerPersonTempVIP.customerPersonTempVIPID || -1;
       this.customerPersonID = customerPersonTempVIP.customerPersonID || '';
       this.incidenceID = customerPersonTempVIP.incidenceID || '';
       this.forNumberofBookings = customerPersonTempVIP.forNumberofBookings || '';
       this.remark = customerPersonTempVIP.remark || '';
       this.vipStatusStartDateString = customerPersonTempVIP.vipStatusStartDateString || '';
       this.vipStatusEndDateString = customerPersonTempVIP.vipStatusEndDateString || '';
       this.vipStatusStartDate=new Date();
       this.vipStatusEndDate=new Date();
       this.forNumberofBookingsStartsFrom=new Date();
       this.activationStatus = customerPersonTempVIP.activationStatus || '';
    }
  }
  
}

