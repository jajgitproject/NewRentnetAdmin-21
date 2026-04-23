// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryPermit {
   inventoryPermitID: number;
   inventoryID: number;
   startDate:Date;
   startDateString:string;
   endDate:Date;
   endDateString:string;
   permitAmount:number;
   permitImage:string;
   activationStatus:boolean;
   userID:number;
  constructor(inventoryPermit) {
    {
       this.inventoryPermitID = inventoryPermit.inventoryPermitID || -1;
       this.inventoryID = inventoryPermit.inventoryID || '';
       this.startDateString = inventoryPermit.startDateString || '';
       this.endDateString = inventoryPermit.endDateString || '';
       this.permitAmount = inventoryPermit.permitAmount || '';
       this.permitImage = inventoryPermit.permitImage || '';
       this.activationStatus = inventoryPermit.activationStatus || '';
       this.startDate=new Date();
       this.endDate=new Date();
    }
  }
  
}

