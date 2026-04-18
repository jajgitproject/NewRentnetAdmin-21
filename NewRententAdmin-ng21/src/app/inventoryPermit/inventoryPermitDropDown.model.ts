// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryPermitDropDown {
 
   inventoryPermitID: number;
   inventoryPermit: string;

  constructor(inventoryPermitDropDown) {
    {
       this.inventoryPermitID = inventoryPermitDropDown.inventoryPermitID || -1;
       this.inventoryPermit = inventoryPermitDropDown.inventoryPermit || '';
    }
  }
  
}

