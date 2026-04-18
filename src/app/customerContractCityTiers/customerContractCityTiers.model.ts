// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractCityTiers {
  customerContractCityTiersID: number;
  customerContractID: number;
  customerContractCityTier:string;
  customerContractName:string
   activationStatus:boolean;
   userID:number;
   cityTierID:number;
  constructor(customerContractCityTiers) {
    {
       this.customerContractCityTiersID = customerContractCityTiers.customerContractCityTiersID || -1;
       this.customerContractID = customerContractCityTiers.customerContractID || 0;
       this.customerContractCityTier = customerContractCityTiers.customerContractCityTier || '';
       this.customerContractName = customerContractCityTiers.customerContractName || '';
       this.activationStatus = customerContractCityTiers.activationStatus || '';
       this.userID = customerContractCityTiers.userID || '';
       this.cityTierID = customerContractCityTiers.cityTierID || '';
    }
  }
  
}

