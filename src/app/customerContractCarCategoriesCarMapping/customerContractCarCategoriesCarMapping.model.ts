// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractCarCategoriesCarMapping {
  customerContractCarCategoriesCarMappingID: number;
   customerContractCarCategoryID: number;
   customerContractName:string;
   customerVehicleName:string;
   customerVehicleCodeForIntegration:string;
   vehicleID: number;
   activationStatus:boolean;
   vehicle:string;
   userID:number;
   customerContractID:number;
  constructor(customerContractCarCategoriesCarMapping) {
    {
       this.customerContractCarCategoriesCarMappingID = customerContractCarCategoriesCarMapping.customerContractCarCategoriesCarMappingID || -1;
       this.customerContractCarCategoryID = customerContractCarCategoriesCarMapping.customerContractCarCategoryID || '';
       this.customerContractID = customerContractCarCategoriesCarMapping.customerContractID || '';
       this.vehicleID = customerContractCarCategoriesCarMapping.vehicleID || '';
       this.customerContractName = customerContractCarCategoriesCarMapping.customerContractName || '';
       this.customerVehicleName = customerContractCarCategoriesCarMapping.customerVehicleName || '';
       this.customerVehicleCodeForIntegration = customerContractCarCategoriesCarMapping.customerVehicleCodeForIntegration || '';
       this.activationStatus = customerContractCarCategoriesCarMapping.activationStatus || '';
    }
  }
  
}

