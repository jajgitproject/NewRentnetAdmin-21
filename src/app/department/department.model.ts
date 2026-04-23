// @ts-nocheck
import { formatDate } from '@angular/common';
export class Department {
   departmentID: number;
   department: string;
   activationStatus:boolean;
   userID: number;
  constructor(department) {
    {
       this.departmentID = department.departmentID || -1;
       this.department = department.department || '';
       this.activationStatus = department.activationStatus || '';
    }
  }
  
}

