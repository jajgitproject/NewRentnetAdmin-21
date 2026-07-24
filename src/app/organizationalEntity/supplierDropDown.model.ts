// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierDropDown {
  supplierID: number;
  supplierName: string;
  oldRentnetCode: number;

  constructor(supplierDropDown) {
    {
      this.supplierID = supplierDropDown.supplierID || -1;
      this.supplierName = supplierDropDown.supplierName || '';
      this.oldRentnetCode = (supplierDropDown.oldRentnetCode && supplierDropDown.oldRentnetCode !== 0)
        ? Number(supplierDropDown.oldRentnetCode)
        : null;
    }
  }
  
}

