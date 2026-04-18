// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryBlockDropDown {
 
   inventoryBlockID: number;
   name: string;

  constructor(inventoryBlockDropDown) {
    {
       this.inventoryBlockID = inventoryBlockDropDown.inventoryBlockID || -1;
       this.name = inventoryBlockDropDown.name || '';
    }
  }
  
}

