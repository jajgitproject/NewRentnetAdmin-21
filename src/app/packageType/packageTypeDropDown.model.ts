// @ts-nocheck
import { formatDate } from '@angular/common';
export class PackageTypeDropDown {
 
   packageTypeID: number;
   packageType: string;

  constructor(packageTypeDropDown) {
    {
       this.packageTypeID = packageTypeDropDown.packageTypeID || -1;
       this.packageType = packageTypeDropDown.packageType || '';
    }
  }
  
}

