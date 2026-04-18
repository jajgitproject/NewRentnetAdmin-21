// @ts-nocheck
import { formatDate } from '@angular/common';
export class DepartmentDropDown {
 
   departmentID: number;
   department: string;

  constructor(departmentDropDown) {
    {
       this.departmentID = departmentDropDown.departmentID || -1;
       this.department = departmentDropDown.department || '';
    }
  }
  
}

