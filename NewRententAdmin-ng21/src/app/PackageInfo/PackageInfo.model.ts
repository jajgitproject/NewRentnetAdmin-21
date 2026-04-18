// @ts-nocheck
import { formatDate } from '@angular/common';
export class PackageInfo {
   PackageInfoID: number;
   PackageInfo: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(PackageInfo) {
    {
       this.PackageInfoID = PackageInfo.PackageInfoID || -1;
       this.PackageInfo = PackageInfo.PackageInfo || '';
       this.activationStatus = PackageInfo.activationStatus || '';
       this.updatedBy=PackageInfo.updatedBy || 10;
       this.updateDateTime = PackageInfo.updateDateTime;
    }
  }
  
}

