// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierRateCardDropDown {
 
   supplierRateCardID: number;
   supplierRateCardName: string;

  constructor(supplierRateCardDropDown) {
    {
       this.supplierRateCardID = supplierRateCardDropDown.supplierRateCardID || -1;
       this.supplierRateCardName = supplierRateCardDropDown.supplierRateCardName || '';
    }
  }
  
}



export class SupplierContractForDropDownModel {
 
  supplierContractID: number;
  supplierContractName: string;

 constructor(supplierContractForDropDownModel) {
   {
      this.supplierContractID = supplierContractForDropDownModel.supplierContractID || -1;
      this.supplierContractName = supplierContractForDropDownModel.supplierContractName || '';
   }
 }
 
}

