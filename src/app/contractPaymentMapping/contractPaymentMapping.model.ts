// @ts-nocheck
import { formatDate } from '@angular/common';
export class ContractPaymentMapping {
  contractPaymentMappingID: number;
   modeOfPaymentID:number;
   contractID:number;
   modeOfPayment: string;
   activationStatus: boolean;
userID:number
  constructor(contractPaymentMapping) {
    {
       this.contractPaymentMappingID = contractPaymentMapping.contractPaymentMappingID || -1;
       this.modeOfPayment = contractPaymentMapping.modeOfPayment || '';
       this.contractID = contractPaymentMapping.contractID || '';
       this.modeOfPaymentID = contractPaymentMapping.modeOfPaymentID || '';

       this.activationStatus = contractPaymentMapping.activationStatus || '';
    }
  }
  
}

