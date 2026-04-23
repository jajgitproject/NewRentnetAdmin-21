// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryInsuranceDropDown {
 
   inventoryInsuranceID: number;
   inventoryInsurance: string;

  constructor(inventoryInsuranceDropDown) {
    {
       this.inventoryInsuranceID = inventoryInsuranceDropDown.inventoryInsuranceID || -1;
       this.inventoryInsurance = inventoryInsuranceDropDown.inventoryInsurance || '';
    }
  }
  
}

