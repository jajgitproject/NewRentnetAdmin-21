// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDesignationDropDown {
 
  customerDesignationID: number;
  customerDesignation: string;

  constructor(customerDesignation) {
    {
       this.customerDesignationID = customerDesignation.customerDesignationID || -1;
       this.customerDesignation = customerDesignation.customerDesignation || '';
    }
  }
  
}

