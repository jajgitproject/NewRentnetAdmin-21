// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContactPerson {
  customerContactPersonID: number;
  customerID: number;
  salutationID: number;
  customerDesignationID: number;
  customerDepartmentID: number;
  contactPersonName:string;
  email:string;
  mobile:string;
  isMPOC:boolean;
  isActive:boolean;
  userID:number;
  constructor(customerContactPerson) {
    {
       this.customerContactPersonID = customerContactPerson.customerContactPersonID || -1;
       this.customerID = customerContactPerson.customerID || '';
       this.salutationID = customerContactPerson.salutationID || '';
       this.customerDesignationID = customerContactPerson.customerDesignationID || '';
       this.customerDepartmentID = customerContactPerson.customerDepartmentID || '';
       this.contactPersonName = customerContactPerson.contactPersonName || '';
       this.email = customerContactPerson.email || '';
       this.mobile = customerContactPerson.mobile || '';
       this.isActive = customerContactPerson.isActive || '';
       this.isMPOC = customerContactPerson.isMPOC || '';
    }
  }
  
}

