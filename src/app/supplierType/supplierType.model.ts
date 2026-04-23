// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierTypeModel {
  supplierTypeID: number;
  supplierType: string;
  activationStatus: boolean;
  userID:number;

  constructor(supplierTypeModel) {
    {
       this.supplierTypeID = supplierTypeModel.supplierTypeID || -1;
       this.supplierType = supplierTypeModel.supplierType || '';
       this.activationStatus = supplierTypeModel.activationStatus || '';
    }
  }
  
}

export class SupplierTypeDropDownModel {
  supplierTypeID: number;
  supplierType: string;

 constructor(supplierTypeDropDownModel) {
   {
      this.supplierTypeID = supplierTypeDropDownModel.supplierTypeID || -1;
      this.supplierType = supplierTypeDropDownModel.supplierType || '';
   }
 }
 
}


