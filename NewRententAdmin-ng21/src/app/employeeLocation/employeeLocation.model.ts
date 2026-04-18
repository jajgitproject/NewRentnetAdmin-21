// @ts-nocheck
import { formatDate } from '@angular/common';
export class EmployeeLocation {
   employeeLocationID: number;
   employeeID:number;
   firstName:string;
   lastName:string;
   locationID:number;
   location: string;
   userID:number;
   activationStatus: boolean;

  constructor(employeeLocation) {
    {
       this.employeeLocationID = employeeLocation.employeeLocationID || -1;
       this.employeeID = employeeLocation.employeeID || '';
       this.firstName = employeeLocation.firstName || '';
       this.lastName = employeeLocation.lastName || '';
       this.locationID = employeeLocation.locationID || '';
       this.location = employeeLocation.location || '';
       this.activationStatus = employeeLocation.activationStatus || '';
    }
  }
  
}

