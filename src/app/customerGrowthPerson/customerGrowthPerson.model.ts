// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerGrowthPerson {
  customerGrowthPersonID: number;
  customerID : number;
  employeeID : number;
  employee:string;
 growthPersonCode:string;
  growthPersonManageCode:string;
    growthPersonManagerID:number;
   activationStatus: Boolean;
   employeeName:string;
 growthPersonManager:string;
  userID: number;
  

  constructor(customerGrowthPerson) {
    {
       this.customerGrowthPersonID = customerGrowthPerson.customerGrowthPersonID || -1;
       this.customerID = customerGrowthPerson.customerID || '';
       this.employeeID = customerGrowthPerson.employeeID || '';
      this.growthPersonManager = customerGrowthPerson.growthPersonManager || '';
       this.growthPersonCode = customerGrowthPerson.growthPersonCode || '';
       this.growthPersonManageCode = customerGrowthPerson.growthPersonManageCode || '';
       this.growthPersonManagerID = customerGrowthPerson.growthPersonManagerID || '';
       this.activationStatus = customerGrowthPerson.activationStatus || '';
      //  this.fromDate=new Date();
       //this.toDate=new Date();
    }
  }
  
}

