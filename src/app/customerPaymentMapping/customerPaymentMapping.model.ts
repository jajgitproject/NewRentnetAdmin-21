// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPaymentMapping {
  customerPaymentMappingID: number;
  modeOfPaymentID: number;
  customerID: number;
  modeOfPayment: string;
  activationStatus: boolean;
  userID: number;
  constructor(customerPaymentMapping) {
    {
      this.customerPaymentMappingID = customerPaymentMapping.customerPaymentMappingID || -1;
      this.modeOfPayment = customerPaymentMapping.modeOfPayment || '';
      this.customerID = customerPaymentMapping.customerID || '';
      this.modeOfPaymentID = customerPaymentMapping.modeOfPaymentID || '';
      this.activationStatus = customerPaymentMapping.activationStatus || '';
    }
  }
}

export class CustomerPaymentMappingCustomerDropDown {
  customerID: number;
  customerName: string;
}
