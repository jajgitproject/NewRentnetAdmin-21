// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerAllowedPackageTypesInCDP {
  allowedPackageTypesInCDPID: number;
  customerGroupID: number;
  packageTypeID: number;
  packageType: string;
   activationStatus:boolean;
   userID:number;
  constructor(customerAllowedPackageTypesInCDP) {
    {
       this.allowedPackageTypesInCDPID = customerAllowedPackageTypesInCDP.allowedPackageTypesInCDPID || -1;
       this.customerGroupID = customerAllowedPackageTypesInCDP.customerGroupID || '';
       this.packageTypeID = customerAllowedPackageTypesInCDP.packageTypeID || '';
       this.packageType = customerAllowedPackageTypesInCDP.packageType || '';
       this.activationStatus = customerAllowedPackageTypesInCDP.activationStatus || '';
    }
  }
  
}

