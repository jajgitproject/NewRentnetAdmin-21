// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDesignation {
  customerDesignationID: number;
  customerGroupID: number;
  customerDesignation:string;
   activationStatus:boolean;
   userID: number;
  constructor(customerDesignation) {
    {
       this.customerDesignationID = customerDesignation.customerDesignationID || -1;
       this.customerGroupID = customerDesignation.customerGroupID || '';
       this.customerDesignation = customerDesignation.customerDesignation || '';
       this.activationStatus = customerDesignation.activationStatus || '';
    }
  }
  
}

