// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryBlock {
   inventoryBlockID: number;
   inventoryID: number;
   inventoryBlockStartDateString: string;
   inventoryBlockStartDate:Date;
   inventoryBlockEndDateString:string;
   inventoryBlockEndDate:Date;
   inventoryBlockReason:string;
   reasonReference:string;
   activationStatus: boolean;
   userID:number;

  constructor(inventoryBlock) {
    {
       this.inventoryBlockID = inventoryBlock.inventoryBlockID || -1;
       this.inventoryID = inventoryBlock.inventoryID || '';
       this.inventoryBlockReason = inventoryBlock.inventoryBlockReason || '';
       this.reasonReference = inventoryBlock.reasonReference || '';
       this.inventoryBlockStartDateString = inventoryBlock.inventoryBlockStartDateString  || '';
       this.activationStatus = inventoryBlock.activationStatus || '';
       this.inventoryBlockEndDateString=inventoryBlock.inventoryBlockEndDateString || '';
       this.inventoryBlockStartDate=new Date();
       this.inventoryBlockEndDate=new Date();
      
    }
  }
  
}

