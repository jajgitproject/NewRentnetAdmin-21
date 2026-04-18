// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorLocalTransferRateDropDown {
 
   vendorLocalTransferRateID: number;
   vendorLocalTransferRate: string;

  constructor(vendorLocalTransferRateDropDown) {
    {
       this.vendorLocalTransferRateID = vendorLocalTransferRateDropDown.vendorLocalTransferRateID || -1;
       this.vendorLocalTransferRate = vendorLocalTransferRateDropDown.vendorLocalTransferRate || '';
    }
  }
  
}

