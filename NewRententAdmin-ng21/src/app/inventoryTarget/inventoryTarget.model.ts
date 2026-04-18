// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryTarget {
   inventoryTargetID: number;
   inventoryID: number;
   registrationNumber:string;
   monthlyTarget: number;
   dailyTarget: number;
   startDate:Date;
   startDateString:string;
   endDate: Date;
   endDateString:string;
   activationStatus: boolean;
   userID:number;

  constructor(inventoryTarget) {
    {
       this.inventoryTargetID = inventoryTarget.inventoryTargetID || -1;
        this.inventoryID = inventoryTarget.inventoryID || '';
        this.registrationNumber = inventoryTarget.registrationNumber || '';
       this.monthlyTarget = inventoryTarget.monthlyTarget || '';
       this.dailyTarget = inventoryTarget.dailyTarget || '';
       this.startDate = inventoryTarget. startDate ||'';
       this.endDate = inventoryTarget. endDate ||'';
       this.activationStatus = inventoryTarget.activationStatus || '';
       this.startDate=new Date();
       this.endDate=new Date();
    }
  }
  
}

