// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierRateCardSupplierMapping {
  supplierContractMappingID: number;
  userID:number;
   supplierID: number;
   supplierContractID: number;
   supplierName:string;
   supplierContractName:string;
   activationStatus:boolean;
  constructor(supplierRateCardSupplierMapping) {
    {
       this.supplierContractMappingID = supplierRateCardSupplierMapping.supplierContractMappingID || -1;
       this.supplierID = supplierRateCardSupplierMapping.supplierID || '';
       this.supplierContractID = supplierRateCardSupplierMapping.supplierContractID || '';
       this.supplierName = supplierRateCardSupplierMapping.supplierName || '';
       this.activationStatus = supplierRateCardSupplierMapping.activationStatus || '';
    }
  }
  
}

