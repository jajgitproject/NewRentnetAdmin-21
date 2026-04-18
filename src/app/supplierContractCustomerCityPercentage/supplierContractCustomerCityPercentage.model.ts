// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCustomerCityPercentage {
    supplierContractCustomerCityPercentageID: number;
    userID:number;
    supplierContractID: number;
    cityID: number;
    customerID: number;
    fromDate:Date;
    fromDateString:string;
    toDate:Date;
    city:string;
    customerName:string;
    toDateString:string;
    supplierPercentage:number;
    activationStatus:boolean;
  constructor(supplierContractCustomerCityPercentage) {
    {
       this.supplierContractCustomerCityPercentageID = supplierContractCustomerCityPercentage.supplierContractCustomerCityPercentageID || -1;
       this.supplierContractID=supplierContractCustomerCityPercentage.supplierContractID||'';
       this.cityID=supplierContractCustomerCityPercentage.cityID||'';
       this.customerID = supplierContractCustomerCityPercentage. customerID || '';
       this.fromDateString = supplierContractCustomerCityPercentage. fromDateString || '';
       this.toDateString = supplierContractCustomerCityPercentage. toDateString || '';
       this.supplierPercentage = supplierContractCustomerCityPercentage. supplierPercentage || '';
       this.activationStatus =  supplierContractCustomerCityPercentage.activationStatus || '';
       this.fromDate=new Date();
       this.toDate=new Date();
    }
  }
  
}

