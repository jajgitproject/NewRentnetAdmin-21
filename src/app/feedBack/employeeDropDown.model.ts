// @ts-nocheck
import { formatDate } from '@angular/common';
export class EmployeesDropDown {
 
  //  employeeID: number;
  primaryPassengerID:number
   customerPersonName:string;
   passengerID:string;
   firstName: string;
   lastName: string;
  constructor(employeeDropDown) {
    {
      this.primaryPassengerID = employeeDropDown.primaryPassengerID || -1;
      this.passengerID = employeeDropDown.passengerID || '';
       this.customerPersonName = employeeDropDown.customerPersonName || '';
       this.firstName = employeeDropDown.firstName || '';
       this.lastName = employeeDropDown.lastName || '';
     
    }
  }
  
}


