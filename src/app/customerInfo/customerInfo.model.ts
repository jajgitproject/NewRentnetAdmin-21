// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerInfo {
  //customerID: number;
  customerType: string;
  customerName: string; 
  customerCategory: string;
  billingInstrunction: string;
  otherInstrunctions: string;

  constructor(customerInfo) {
    {
      this.customerName = customerInfo.customerName || '';
      this.customerType = customerInfo.customerType || '';
      this.customerCategory = customerInfo.customerCategory || '';
      this.billingInstrunction=customerInfo.billingInstrunction || '';
      this.otherInstrunctions = customerInfo.otherInstrunctions || '';
    }
  }
  
}

