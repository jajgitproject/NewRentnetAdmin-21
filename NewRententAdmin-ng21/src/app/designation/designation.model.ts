// @ts-nocheck
import { formatDate } from '@angular/common';
export class Designation {
   designationID: number;
   designation: string;
   activationStatus:boolean;
   userID: number;
  constructor(designation) {
    {
       this.designationID = designation.designationID || -1;
       this.designation = designation.designation || '';
       this.activationStatus = designation.activationStatus || '';
    }
  }
  
}

