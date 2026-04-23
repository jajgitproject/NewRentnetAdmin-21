// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorContractCityTiersCityMappingModel {
  vendorContractCityTiersCityMappingID: number;
  vendorContractCityTiersID: number;
  vendorContractName:string
  vendorContractCityTiers:string
  cityID: number;
  city: string;
  activationStatus:boolean;
  userID:number;
  constructor(vendorContractCityTiersCityMappingModel) {
    {
      this.vendorContractCityTiersCityMappingID = vendorContractCityTiersCityMappingModel.vendorContractCityTiersCityMappingID || -1;
      this.vendorContractCityTiersID = vendorContractCityTiersCityMappingModel.vendorContractCityTiersID || '';
      this.cityID = vendorContractCityTiersCityMappingModel.cityID || '';
      this.vendorContractName = vendorContractCityTiersCityMappingModel.vendorContractName || '';
      this.activationStatus = vendorContractCityTiersCityMappingModel.activationStatus || '';
    }
  }
  
}

