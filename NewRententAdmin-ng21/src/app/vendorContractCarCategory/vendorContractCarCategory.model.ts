// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorContractCarCategoryModel {
  vendorContractCarCategoryID: number;
  vendorContractCarCategory:string;
  vendorContractID: number;
  vendorContractName:string;
  vehicleCategoryID:number;  
  activationStatus:boolean;
  userID:number;
  
  constructor(vendorContractCarCategoryModel) {
    {
      this.vendorContractCarCategoryID = vendorContractCarCategoryModel.vendorContractCarCategoryID || -1;
      this.vendorContractID = vendorContractCarCategoryModel.vendorContractID || 0;
      this.vendorContractCarCategory = vendorContractCarCategoryModel.vendorContractCarCategory || '';
      this.vendorContractName = vendorContractCarCategoryModel.vendorContractName || '';
      this.activationStatus = vendorContractCarCategoryModel.activationStatus || '';
      this.vehicleCategoryID = vendorContractCarCategoryModel.vehicleCategoryID || 0;
      this.userID = vendorContractCarCategoryModel.userID || 0;
    }
  }
  
}


export class VendorContractCarCategoryDropDownModel {
  vendorContractCarCategory: string;
  vendorContractCarCategoryID: number;

  constructor(vendorContractCarCategoryDropDownModel) {
    {
      this.vendorContractCarCategory = vendorContractCarCategoryDropDownModel.vendorContractCarCategory || -1;
      this.vendorContractCarCategoryID = vendorContractCarCategoryDropDownModel.vendorContractCarCategoryID || '';
    }
  }
  
}


export class VendorCategoryDropDownModel {
  vendorCategoryID: number;
  vendorCategory: string;

  constructor(vendorCategoryDropDownModel) {
  {
    this.vendorCategoryID = vendorCategoryDropDownModel.vendorCategoryID || -1;
    this.vendorCategory = vendorCategoryDropDownModel.vendorCategory || '';
  }
  }
  
}


export class VendorContractDropDownModel { 
  vendorContractID: number;
  vendorContractName: string;

  constructor(vendorContractDropDownModel) {
    {
      this.vendorContractID = vendorContractDropDownModel.vendorContractID || -1;
      this.vendorContractName = vendorContractDropDownModel.vendorContractName || '';
    }
  }
  
}
