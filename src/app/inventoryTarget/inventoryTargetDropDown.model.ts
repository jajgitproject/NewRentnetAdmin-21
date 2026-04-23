// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryTargetDropDown {
   inventoryTargetID: number;
   inventoryID: number;

  constructor(inventoryTargetDropDown) {
    {
       this.inventoryTargetID = inventoryTargetDropDown.inventoryTargetID || -1;
       this.inventoryID = inventoryTargetDropDown.inventoryID || '';
    }
  }
  
}

