// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorContractCityTiersDropDown {
 
   vendorContractCityTiersID: number;
   vendorContractCityTier: string;

  constructor(vendorContractCityTiersDropDown) {
    {
       this.vendorContractCityTiersID = vendorContractCityTiersDropDown.vendorContractCityTiersID || -1;
       this.vendorContractCityTier = vendorContractCityTiersDropDown.vendorContractCityTier || '';
    }
  }
  
}

