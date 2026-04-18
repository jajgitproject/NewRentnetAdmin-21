// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDropDown {
 
   customerPersonID: number;
   customerPersonName: string;
   customerName:string;
   gender:string;
   importance:string;
   phone:string;
   primaryEmail:string;
   primaryMobile:string;
   customerDepartment:string;
   customerDesignation:string;
  passengerID: Number;

  constructor(customerPersonDropDown) {
    {
       this.customerPersonID = customerPersonDropDown.customerPersonID || -1;
       this.customerPersonName = customerPersonDropDown.customerPersonName || '';
       this.customerName = customerPersonDropDown.customerName || '';
       this.gender = customerPersonDropDown.gender || '';
       this.importance = customerPersonDropDown.importance || '';
       this.phone = customerPersonDropDown.phone || '';
       this.primaryEmail = customerPersonDropDown.primaryEmail || '';
       this.primaryMobile = customerPersonDropDown.primaryMobile || '';
       this.customerDepartment = customerPersonDropDown.customerDepartment || '';
       this.customerDesignation = customerPersonDropDown.customerDesignation || '';
    }
  }
  
}

