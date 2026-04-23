// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorPaymentMapping {
  vendorContractPaymentMappingID: number;
   modeOfPaymentID:number;
   vendorcontractID:number;
   modeOfPayment: string;
   activationStatus: boolean;
userID:number
  constructor(vendorPaymentMapping) {
    {
       this.vendorContractPaymentMappingID = vendorPaymentMapping.vendorContractPaymentMappingID || -1;
       this.modeOfPayment = vendorPaymentMapping.modeOfPayment || '';
       this.vendorcontractID = vendorPaymentMapping.vendorcontractID || '';
       this.modeOfPaymentID = vendorPaymentMapping.modeOfPaymentID || '';

       this.activationStatus = vendorPaymentMapping.activationStatus || '';
    }
  }
  
}

