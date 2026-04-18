// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCityPercentage {
  supplierContractCityPercentageID: number;
  userID:number;
  supplierContractID : number;
  cityID : number;
  fromDate :Date;
  toDate :Date;
  toDateString:string;
  fromDateString:string;
  supplierPercentage :string;
  city:string;
   activationStatus: Boolean;
  

  constructor(supplierContractCityPercentage) {
    {
       this.supplierContractCityPercentageID = supplierContractCityPercentage.supplierContractCityPercentageID || -1;
       this.supplierContractID = supplierContractCityPercentage.supplierContractID || '';
       this.cityID = supplierContractCityPercentage.cityID || '';
       this.fromDateString = supplierContractCityPercentage.fromDateString || '';
       this.toDateString = supplierContractCityPercentage.toDateString || '';
       this.supplierPercentage = supplierContractCityPercentage.supplierPercentage || '';
       this.activationStatus = supplierContractCityPercentage.activationStatus || '';
       this.fromDate=new Date();
       this.toDate=new Date();
    }
  }
  
}

