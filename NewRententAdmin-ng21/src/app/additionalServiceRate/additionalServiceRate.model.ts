// @ts-nocheck
import { formatDate } from '@angular/common';
export class AdditionalServiceRate {
   additionalServiceRateID: number;
   additionalServiceID: number;
   serviceTypeName: string;
   serviceType:string;
   cityID:number;
   startDateString:string;
   startDate:Date;
   endDateString:string;
   endDate:Date;
   uom:string;
   city:string;
   rate:string
   activationStatus: boolean;
   geoPointName:string;
  userID: number;

  constructor(additionalServiceRate) {
    {
       this.additionalServiceRateID = additionalServiceRate.additionalServiceRateID || -1;
       this.additionalServiceID = additionalServiceRate.additionalServiceID || '';
       this.serviceTypeName = additionalServiceRate.serviceTypeName || '';
       this.serviceType = additionalServiceRate.serviceType || '';
       this.cityID = additionalServiceRate.cityID  || '';
       this.startDateString = additionalServiceRate.startDateString  || '';
       this.activationStatus = additionalServiceRate.activationStatus || '';
       this.endDateString=additionalServiceRate.endDateString || '';
       this.startDate=new Date();
       this.endDate=new Date();
      
    }
  }
  
}

