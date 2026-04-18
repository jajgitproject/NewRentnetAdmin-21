// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorContractCarCategoriesCarMappingModel {
  vendorContractCarCategoriesCarMappingID: number;
  vendorContractCarCategoryID: number;
  vendorVehicleName:string;
  vendorContractID:number;
  vendorContractName:string;  
  vendorVehicleCodeForIntegration:string;
  vehicleID: number;
  activationStatus:boolean;
  vehicle:string;
  userID:number;
  
  constructor(vendorContractCarCategoriesCarMappingModel) {
    {
       this.vendorContractCarCategoriesCarMappingID = vendorContractCarCategoriesCarMappingModel.vendorContractCarCategoriesCarMappingID || -1;
       this.vendorContractCarCategoryID = vendorContractCarCategoriesCarMappingModel.vendorContractCarCategoryID || '';
       this.vendorContractID = vendorContractCarCategoriesCarMappingModel.vendorContractID || '';
       this.vehicleID = vendorContractCarCategoriesCarMappingModel.vehicleID || '';
       this.vendorContractName = vendorContractCarCategoriesCarMappingModel.vendorContractName || '';
       this.vendorVehicleName = vendorContractCarCategoriesCarMappingModel.vendorVehicleName || '';
       this.vendorVehicleCodeForIntegration = vendorContractCarCategoriesCarMappingModel.vendorVehicleCodeForIntegration || '';
       this.activationStatus = vendorContractCarCategoriesCarMappingModel.activationStatus || '';
    }
  }
  
}

