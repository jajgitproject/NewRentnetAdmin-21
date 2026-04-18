// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryPUC {
    inventoryPUCID: number;
    inventoryID:number;
    startDate:Date;
    startDateString:string;
    endDate:Date;
    endDateString:string;
    pucImage:string;
    activationStatus:boolean;
    userID:number;
  constructor(inventoryPUC) {
    {
       this.inventoryPUCID = inventoryPUC.inventoryPUCID || -1;
       this.inventoryID = inventoryPUC.inventoryID || '';
       this.startDateString = inventoryPUC.startDateString || '';
       this.endDateString = inventoryPUC.endDateString || '';
       this.pucImage = inventoryPUC.pucImage || '';
       this.activationStatus = inventoryPUC.activationStatus || '';
       this.startDate=new Date();
       this.endDate=new Date();
    }
  }
  
}

