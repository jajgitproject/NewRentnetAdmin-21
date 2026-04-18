// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDrivingLicenseVerificationDropDown {
   customerPersonDrivingLicenseVerificationID: number;
   supplierContractID: string;

  constructor(customerPersonDrivingLicenseVerificationDropDown) {
    {
       this.customerPersonDrivingLicenseVerificationID = customerPersonDrivingLicenseVerificationDropDown.customerPersonDrivingLicenseVerificationID || -1;
       this.supplierContractID = customerPersonDrivingLicenseVerificationDropDown.supplierContractID || '';
    }
  }
  
}

