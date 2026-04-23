// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractCityTiersCityMapping {
  customerContractCityTiersCityMappingID: number;
   customerContractCityTiersID: number;
   customerContractName:string
   customerContractCityTiers:string
   cityID: number;
   city: string;
   activationStatus:boolean;
   userID:number;
  constructor(customerContractCityTiersCityMapping) {
    {
       this.customerContractCityTiersCityMappingID = customerContractCityTiersCityMapping.customerContractCityTiersCityMappingID || -1;
       this.customerContractCityTiersID = customerContractCityTiersCityMapping.customerContractCityTiersID || '';
       this.cityID = customerContractCityTiersCityMapping.cityID || '';
       this.customerContractName = customerContractCityTiersCityMapping.customerContractName || '';
       this.activationStatus = customerContractCityTiersCityMapping.activationStatus || '';
    }
  }
  
}

