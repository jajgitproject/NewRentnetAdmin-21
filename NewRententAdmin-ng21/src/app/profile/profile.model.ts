// @ts-nocheck
import { formatDate } from '@angular/common';
export class Profile {
  employeeID: number;
  firstName: string;
  lastName: string;
  supplierID: number;
  supplierName: string;
  mobile: string;
  email: string;
  gender:string;

  constructor(profile) {
    {
      this.employeeID = profile.employeeID || -1;
      this.firstName = profile.firstName || '';
      this.lastName = profile.lastName || '';
      this.supplierID = profile.supplierID || '';
      this.supplierName = profile.supplierName || '';
      this.mobile = profile.mobile || '';
      this.email = profile.email || '';
      this.gender = profile.gender || '';
    }
  }

}

