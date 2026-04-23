// @ts-nocheck
import { formatDate } from '@angular/common';
export class PackageDropDown {
   packageID: number;
   package: string;

  constructor(packageDropDown) {
    {
       this.packageID = packageDropDown.packageID || -1;
       this.package = packageDropDown.package || '';
    }
  }
  
}

