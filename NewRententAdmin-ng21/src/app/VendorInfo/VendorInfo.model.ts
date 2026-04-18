// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorInfo {
   VendorInfoID: number;
   VendorInfo: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(VendorInfo) {
    {
       this.VendorInfoID = VendorInfo.VendorInfoID || -1;
       this.VendorInfo = VendorInfo.VendorInfo || '';
       this.activationStatus = VendorInfo.activationStatus || '';
       this.updatedBy=VendorInfo.updatedBy || 10;
       this.updateDateTime = VendorInfo.updateDateTime;
    }
  }
  
}

