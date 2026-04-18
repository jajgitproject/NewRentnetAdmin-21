// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryDropDown {
 
   inventoryID: number;
   registrationNumber: string;

  constructor(inventoryDropDown) {
    {
       this.inventoryID = inventoryDropDown.inventoryID || -1;
       this.registrationNumber = inventoryDropDown.registrationNumber || '';
    }
  }
  
}

