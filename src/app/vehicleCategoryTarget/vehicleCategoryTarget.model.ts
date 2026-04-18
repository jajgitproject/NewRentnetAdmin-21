// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleCategoryTarget {
   vehicleCategoryTargetID: number;
   userID:number;
   vehicleCategoryID: number;
   vehicle:string;
   monthlyTarget: number;
   dailyTarget: number;
   startDate:Date;
   startDateString:string;
   endDate: Date;
   endDateString:string;
   activationStatus: boolean;

  constructor(vehicleCategoryTarget) {
    {
       this.vehicleCategoryTargetID = vehicleCategoryTarget.vehicleCategoryTargetID || -1;
        this.vehicleCategoryID = vehicleCategoryTarget.vehicleCategoryID || 0;
       this.monthlyTarget = vehicleCategoryTarget.monthlyTarget || '';
       this.dailyTarget = vehicleCategoryTarget.dailyTarget || '';
       this.startDate = vehicleCategoryTarget. startDate ||'';
       this.endDate = vehicleCategoryTarget. endDate ||'';
       this.activationStatus = vehicleCategoryTarget.activationStatus || '';
       this.startDate=new Date();
       this.endDate=new Date();
    }
  }
  
}

