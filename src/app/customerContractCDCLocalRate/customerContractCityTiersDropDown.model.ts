// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractCityTiersDropDown {
 
   customerContractCityTiersID: number;
   customerContractCityTier: string;

  constructor(customerContractCityTiersDropDown) {
    {
       this.customerContractCityTiersID = customerContractCityTiersDropDown.customerContractCityTiersID || -1;
       this.customerContractCityTier = customerContractCityTiersDropDown.customerContractCityTier || '';
    }
  }
  
}

