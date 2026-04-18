// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonInventoryRestriction {
   customerPersonInventoryRestrictionID: number;
   customerPersonID:number;
 inventoryID: number;
  inventoryName: string;
  registrationNumber: string;
   remark: string;
   activationStatus:boolean;
   userID:number;
  constructor(customerPersonInventoryRestriction) {
    {
       this.customerPersonInventoryRestrictionID = customerPersonInventoryRestriction.customerPersonInventoryRestrictionID || -1;
       this.customerPersonID = customerPersonInventoryRestriction.customerPersonID || '';
       this.inventoryID = customerPersonInventoryRestriction.inventoryID || '';
       this.remark = customerPersonInventoryRestriction.remark || '';
       this.activationStatus = customerPersonInventoryRestriction.activationStatus || '';
    }
  }
  
}

