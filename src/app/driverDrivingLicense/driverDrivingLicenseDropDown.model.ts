// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverDrivingLicenseDropDown {
 
   driverDrivingLicenseID: number;
   driverDrivingLicense: string;

  constructor(driverDrivingLicenseDropDown) {
    {
       this.driverDrivingLicenseID = driverDrivingLicenseDropDown.driverDrivingLicenseID || -1;
       this.driverDrivingLicense = driverDrivingLicenseDropDown.driverDrivingLicense || '';
    }
  }
  
}

