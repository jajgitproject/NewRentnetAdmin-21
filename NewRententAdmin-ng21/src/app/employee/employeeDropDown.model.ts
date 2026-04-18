// @ts-nocheck
import { formatDate } from '@angular/common';
export class 
EmployeeDropDown {
  
  assignedToEmployeeID: number;
   employeeID: number;
   firstName: string;
   lastName: string;
   mobile:string;
   email:string;
   name:string;
   customerPersonName:string;
   passengerID: number;
   employeeOfficeID:string;
  oldKAMID: number;
  newKAMID:number;
  oldCustomerkamEmployee:string;
  newCustomerkamEmployee:string
  employeeLastName:string;
  employeeFirstName:string;
  oldSalesManagerID : number;
  newSalesManagerID:number;
  oldCustomerSalesManagerEmployee:string;
  newCustomerSalesManagerEmployee:string;
   
  constructor(employeeDropDown) {
    {
       this.employeeID = employeeDropDown.employeeID || -1;
       this.firstName = employeeDropDown.firstName || '';
       this.lastName = employeeDropDown.lastName || '';
        this.employeeFirstName = employeeDropDown.employeeFirstName || '';
       this.employeeLastName = employeeDropDown.employeeLastName || '';
       this.email = employeeDropDown.email || '';
       this.mobile = employeeDropDown.mobile || '';
       this.customerPersonName = employeeDropDown.customerPersonName || '';
        this.oldCustomerkamEmployee = employeeDropDown.oldCustomerkamEmployee || '';
         this.oldKAMID = employeeDropDown.oldKAMID || '';
         this.newKAMID = employeeDropDown.newKAMID || '';
         this.oldSalesManagerID = employeeDropDown.oldSalesManagerID || '';
         this.newSalesManagerID = employeeDropDown.newSalesManagerID || '';
         this.oldCustomerSalesManagerEmployee = employeeDropDown.oldCustomerSalesManagerEmployee || '';
         this.newCustomerSalesManagerEmployee = employeeDropDown.newCustomerSalesManagerEmployee || '';
    }
  }
  
}

export class LocationDropDown {
 organizationalEntityID: number;
 employeeAttachedToLocationID: number;
 organizationalEntityName: string;

 constructor(locationDropDown) {
   {
      this.organizationalEntityID = locationDropDown.organizationalEntityID || -1;
      this.organizationalEntityName = locationDropDown.organizationalEntityName || '';
   }
 }
 
}

