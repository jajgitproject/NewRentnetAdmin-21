// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryDocumentModel {
  inventoryDocumentID:number;
  inventoryID:number;
  inventoryName: string;
  documentID:number;
  addressCity:string;
  documentNumber:string;
  documentIssuingAuthority:string;
  documentImage:string;
  documentImageNonAvailabilityReason:string;
  documentExpiry:Date;
  documentExpiryString:string;
  addressCityID:number;
  address:string;
  pin:string;
  activationStatus:boolean;
  verified:string;
  verifiedData:string;
  verifiedBy:string;
  verificationRemark:string;
  verificationDate:string;
  userID:number;
  constructor(inventoryDocumentModel) {
    {
       this.inventoryDocumentID = inventoryDocumentModel.inventoryDocumentID || -1;
       this.inventoryID = inventoryDocumentModel.inventoryID || '';
       this.inventoryName = inventoryDocumentModel.inventoryName || '';
       this.documentID = inventoryDocumentModel.documentID || '';
       this.documentNumber = inventoryDocumentModel.documentNumber || '';
       this.documentIssuingAuthority = inventoryDocumentModel.documentIssuingAuthority || '';
       this.documentImage = inventoryDocumentModel.documentImage || '';
       this.documentImageNonAvailabilityReason = inventoryDocumentModel.documentImageNonAvailabilityReason || '';
       this.addressCityID = inventoryDocumentModel.addressCityID || 0;
       this.address = inventoryDocumentModel.address || '';
       this.documentExpiryString = inventoryDocumentModel.documentExpiryString || '';
       this.pin = inventoryDocumentModel.pin || '';
       this.activationStatus = inventoryDocumentModel.activationStatus || '';
       this.verified = inventoryDocumentModel.verified || '';
       this.verifiedBy = inventoryDocumentModel.verifiedBy || '';
       this.verificationRemark = inventoryDocumentModel.verificationRemark || '';
       this.verificationDate = inventoryDocumentModel.verificationDate || '';
       this.documentExpiry=new Date();
    }
  }
  
}


export class InventoryDocumentVerificationModel {
  inventoryDocumentID:number;
  inventoryID:number;
  inventoryName: string;
  document:string;
  documentID:number;
  addressCity:string;
  documentNumber:string;
  documentIssuingAuthority:string;
  documentImage:string;
  documentImageNonAvailabilityReason:string;
  documentExpiry:Date;
  driver:string;
  documentExpiryString:string;
  addressCityID:number;
  address:string;
  pin:string;
  activationStatus:boolean;
  verified:string;
  documentVerified:string;
  verifiedBy:string;
  verifiedByID:number;
  verificationRemark:string;
  verificationDate:Date;
  verificationDateString:string;
  status:string;
  userID:number;
  constructor(inventoryDocumentVerificationModel) {
    {
       this.inventoryDocumentID = inventoryDocumentVerificationModel.inventoryDocumentID || -1;
       this.inventoryID = inventoryDocumentVerificationModel.inventoryID || '';
       this.inventoryName = inventoryDocumentVerificationModel.inventoryName || '';
       this.documentID = inventoryDocumentVerificationModel.documentID || '';
       this.documentNumber = inventoryDocumentVerificationModel.documentNumber || '';
       this.documentIssuingAuthority = inventoryDocumentVerificationModel.documentIssuingAuthority || '';
       this.documentImage = inventoryDocumentVerificationModel.documentImage || '';
       this.documentImageNonAvailabilityReason = inventoryDocumentVerificationModel.documentImageNonAvailabilityReason || '';
       this.addressCityID = inventoryDocumentVerificationModel.addressCityID || 0;
       this.address = inventoryDocumentVerificationModel.address || '';
       this.documentExpiryString = inventoryDocumentVerificationModel.documentExpiryString || '';
       this.pin = inventoryDocumentVerificationModel.pin || '';
       this.activationStatus = inventoryDocumentVerificationModel.activationStatus || '';
      //  this.documentVerified = inventoryDocumentVerificationModel.documentVerified || '';
       this.verified = inventoryDocumentVerificationModel.verified || '';
       this.verifiedBy = inventoryDocumentVerificationModel.verifiedBy || '';
       this.verificationRemark = inventoryDocumentVerificationModel.verificationRemark || '';
       this.verificationDateString = inventoryDocumentVerificationModel.verificationDateString || '';

       this.verificationDate=new Date();
       this.documentExpiry=new Date();
    }
  }
  
}

