// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorContractPackageTypeMapping {
  vendorContractPackageTypeMappingID: number;
   packageTypeID:number;
   vendorContractID:number;
   packageType: string;
   activationStatus: boolean;
   userID:number
  constructor(vendorContractPackageTypeMapping) {
    {
       this.vendorContractPackageTypeMappingID = vendorContractPackageTypeMapping.vendorContractPackageTypeMappingID || -1;
       this.packageType = vendorContractPackageTypeMapping.packageType || '';
       this.vendorContractID = vendorContractPackageTypeMapping.vendorContractID || '';
       this.packageTypeID = vendorContractPackageTypeMapping.packageTypeID || '';

       this.activationStatus = vendorContractPackageTypeMapping.activationStatus || '';
    }
  }
  
}

