// @ts-nocheck
import { formatDate } from '@angular/common';
export class PackageType {
   packageTypeID: number;
   packageType: string;
 serviceTypeID:number;
  serviceType:string;
   activationStatus: boolean;
   userID:number;
   oldRentNetDuty_Type:string

  constructor(packageType) {
    {
       this.packageTypeID = packageType.packageTypeID || -1;
       this.serviceTypeID = packageType.serviceTypeID || '';
       this.activationStatus = packageType.activationStatus || '';
       this.packageType=packageType.packageType || '';
       this.serviceType=packageType.serviceType || '';
       this.oldRentNetDuty_Type=packageType.oldRentNetDuty_Type || '';
     
    }
  }
  
}

