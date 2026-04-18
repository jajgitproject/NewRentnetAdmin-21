// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierCityMapping {
   supplierCityMappingID: number;
   userID:number;
   supplierID: number;
   cityID: number;
   city:string;
   activationStatus:boolean;
  constructor(supplierCityMapping) {
    {
       this.supplierCityMappingID = supplierCityMapping.supplierCityMappingID || -1;
       this.supplierID = supplierCityMapping.supplierID || '';
       this.cityID = supplierCityMapping.cityID || '';
       this.activationStatus = supplierCityMapping.activationStatus || '';
    }
  }
  
}

