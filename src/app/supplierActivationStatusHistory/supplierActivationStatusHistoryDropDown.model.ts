// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierActivationStatusHistoryDropDown {
 
   supplierActivationStatusHistoryID: number;
   supplierStatus: string;

  constructor(supplierActivationStatusHistoryDropDown) {
    {
       this.supplierActivationStatusHistoryID = supplierActivationStatusHistoryDropDown.supplierActivationStatusHistoryID || -1;
       this.supplierStatus = supplierActivationStatusHistoryDropDown.supplierStatus || '';
    }
  }
  
}

