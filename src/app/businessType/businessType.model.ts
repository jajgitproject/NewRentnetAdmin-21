// @ts-nocheck
import { formatDate } from '@angular/common';
export class BusinessTypeModel {
  businessTypeID:number;
  businessTypeName:string;
  userID:number;
  activationStatus: boolean;

    constructor(businessTypeModel) {
    {
      this.businessTypeID = businessTypeModel.businessTypeID || -1;
      this.businessTypeName = businessTypeModel.businessTypeName || '';
      this.activationStatus = businessTypeModel.activationStatus || '';
    }
  }  
}

