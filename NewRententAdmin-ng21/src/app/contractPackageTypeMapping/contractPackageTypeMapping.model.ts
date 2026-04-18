// @ts-nocheck
import { formatDate } from '@angular/common';
export class ContractPackageTypeMapping {
  contractPackageTypeMappingID: number;
   packageTypeID:number;
   contractID:number;
   packageType: string;
   activationStatus: boolean;
   userID:number
  constructor(contractPackageTypeMapping) {
    {
       this.contractPackageTypeMappingID = contractPackageTypeMapping.contractPackageTypeMappingID || -1;
       this.packageType = contractPackageTypeMapping.packageType || '';
       this.contractID = contractPackageTypeMapping.contractID || '';
       this.packageTypeID = contractPackageTypeMapping.packageTypeID || '';

       this.activationStatus = contractPackageTypeMapping.activationStatus || '';
    }
  }
  
}

