// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierDropDown {
  supplierID: number;
  supplierName: string;

  constructor(supplierDropDown) {
    {
      this.supplierID = supplierDropDown.supplierID || -1;
      this.supplierName = supplierDropDown.supplierName || '';
    }
  }
  
}

