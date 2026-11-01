// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierDropDown {
 
   supplierID: number;
   supplierName: string;
   oldRentnetCode: number;
   pan: string;

  constructor(supplierDropDown) {
    {
       this.supplierID = supplierDropDown.supplierID ?? supplierDropDown.SupplierID ?? -1;
       this.supplierName = supplierDropDown.supplierName ?? supplierDropDown.SupplierName ?? '';
       this.oldRentnetCode = supplierDropDown.oldRentnetCode ?? supplierDropDown.OldRentnetCode ?? null;
       if (this.oldRentnetCode === 0) {
         this.oldRentnetCode = null;
       }
       this.pan = supplierDropDown.pan ?? supplierDropDown.PAN ?? '';
    }
  }
  
}

