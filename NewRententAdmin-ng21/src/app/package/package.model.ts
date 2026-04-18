// @ts-nocheck
import { formatDate } from '@angular/common';
export class Package {
   packageID: number;
   package: string;
   packageTypeID: number;
   activationStatus: boolean;
   packageType:string;
   userID:number;
   oldRentNetPackage:string;

  constructor(packages) {
    {
       this.packageID = packages.packageID || -1;
       this.packageTypeID = packages.packageTypeID || '';
       this.activationStatus = packages.activationStatus || '';
       this.package=packages.package || '';
       this.oldRentNetPackage=packages.oldRentNetPackage || '';
     
    }
  }
  
}

