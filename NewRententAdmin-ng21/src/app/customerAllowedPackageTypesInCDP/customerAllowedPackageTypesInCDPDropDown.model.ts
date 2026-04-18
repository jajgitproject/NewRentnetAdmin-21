// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerAllowedPackageTypesInCDPDropDown {
 
  allowedPackageTypesInCDPID: number;
  customerAllowedPackageTypesInCDP: string;

  constructor(customerAllowedPackageTypesInCDP) {
    {
       this.allowedPackageTypesInCDPID = customerAllowedPackageTypesInCDP.allowedPackageTypesInCDPID || -1;
       this.customerAllowedPackageTypesInCDP = customerAllowedPackageTypesInCDP.customerAllowedPackageTypesInCDP || '';
    }
  }
  
}

