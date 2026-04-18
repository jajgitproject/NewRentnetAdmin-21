// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryPUCDropDown {
 
  inventoryPUCID: number;
    inventoryPUC: string;

  constructor(inventoryPUCDropDown) {
    {
       this.inventoryPUCID = inventoryPUCDropDown.inventoryPUCID || -1;
       this.inventoryPUC = inventoryPUCDropDown.inventoryPUC || '';
    }
  }
  
}

