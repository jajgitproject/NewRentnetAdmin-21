// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDrivingLicenseDropDown {
 
   customerPersonDrivingLicenseID: number;
   customerPersonDrivingLicense: string;

  constructor(customerPersonDrivingLicenseDropDown) {
    {
       this.customerPersonDrivingLicenseID = customerPersonDrivingLicenseDropDown.customerPersonDrivingLicenseID || -1;
       this.customerPersonDrivingLicense = customerPersonDrivingLicenseDropDown.customerPersonDrivingLicense || '';
    }
  }
  
}

