// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContactPersonDropDown {
  customerContactPersonID: number;
  contactPersonName: string;

  constructor(customerSalesManagerDropDown) {
    {
       this.customerContactPersonID = customerSalesManagerDropDown.customerContactPersonID || -1;
       this.contactPersonName = customerSalesManagerDropDown.contactPersonName || '';
    }
  }
  
}

