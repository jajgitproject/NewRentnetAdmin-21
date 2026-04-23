// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorContractCityTiersModel {
  vendorContractCityTiersID: number;
  vendorContractID: number;
  vendorContractName:string
  cityTierID:number;
  vendorContractCityTier:string;  
  activationStatus:boolean;
  userID:number;
  
  constructor(vendorContractCityTiersModel) {
    {
      this.vendorContractCityTiersID = vendorContractCityTiersModel.vendorContractCityTiersID || -1;
      this.vendorContractID = vendorContractCityTiersModel.vendorContractID || 0;
      this.vendorContractCityTier = vendorContractCityTiersModel.vendorContractCityTier || '';
      this.vendorContractName = vendorContractCityTiersModel.vendorContractName || '';
      this.activationStatus = vendorContractCityTiersModel.activationStatus || '';
      this.userID = vendorContractCityTiersModel.userID || '';
      this.cityTierID = vendorContractCityTiersModel.cityTierID || '';
    }
  }
  
}

