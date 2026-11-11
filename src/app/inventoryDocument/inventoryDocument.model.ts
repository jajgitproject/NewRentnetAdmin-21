// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryDocumentModel {
  inventoryDocumentID:number;
  inventoryID:number;
  inventoryName: string;
  document: string;
  documentID:number;
  addressCity:string;
  documentNumber:string;
  documentIssuingAuthority:string;
  documentImage:string;
  documentImageNonAvailabilityReason:string;
  documentExpiry:Date;
  documentExpiryString:string;
  documentStartDate:Date;
  documentStartDateString:string;
  addressCityID:number;
  address:string;
  pin:string;
  activationStatus:boolean;
  verified:string;
  verifiedData:string;
  verifiedBy:string;
  verificationRemark:string;
  verificationDate:string;
  verificationTime:string;
  documentUploadDate:string;
  documentUploadTime:string;
  documentUploadByID:number;
  documentUploadBy:string;
  userID:number;
  constructor(inventoryDocumentModel) {
    {
       this.inventoryDocumentID = inventoryDocumentModel.inventoryDocumentID || -1;
       this.inventoryID = inventoryDocumentModel.inventoryID || '';
       this.inventoryName = inventoryDocumentModel.inventoryName || '';
       this.document = inventoryDocumentModel.document || '';
       this.documentID = inventoryDocumentModel.documentID || '';
       this.documentNumber = inventoryDocumentModel.documentNumber || '';
       this.documentIssuingAuthority = inventoryDocumentModel.documentIssuingAuthority || '';
       this.documentImage = inventoryDocumentModel.documentImage ?? inventoryDocumentModel.DocumentImage ?? '';
       this.documentImageNonAvailabilityReason =
         inventoryDocumentModel.documentImageNonAvailabilityReason
         ?? inventoryDocumentModel.DocumentImageNonAvailabilityReason
         ?? '';
       this.addressCityID = inventoryDocumentModel.addressCityID || 0;
       this.address = inventoryDocumentModel.address || '';
       this.documentExpiryString = inventoryDocumentModel.documentExpiryString || '';
       this.documentStartDateString = inventoryDocumentModel.documentStartDateString || '';
       this.pin = inventoryDocumentModel.pin || '';
       this.activationStatus = inventoryDocumentModel.activationStatus || '';
       this.verified = inventoryDocumentModel.verified || '';
       this.verifiedBy = inventoryDocumentModel.verifiedBy || '';
       this.verificationRemark = inventoryDocumentModel.verificationRemark || '';
       this.verificationDate = inventoryDocumentModel.verificationDate || '';
       this.verificationTime = inventoryDocumentModel.verificationTime ?? inventoryDocumentModel.VerificationTime ?? '';
       this.documentExpiry = inventoryDocumentModel.documentExpiry ?? null;
       this.documentStartDate = inventoryDocumentModel.documentStartDate ?? null;
       this.documentUploadDate = inventoryDocumentModel.documentUploadDate ?? inventoryDocumentModel.DocumentUploadDate ?? '';
       this.documentUploadTime = inventoryDocumentModel.documentUploadTime ?? inventoryDocumentModel.DocumentUploadTime ?? '';
       this.documentUploadByID = inventoryDocumentModel.documentUploadByID ?? inventoryDocumentModel.DocumentUploadByID ?? null;
       this.documentUploadBy = inventoryDocumentModel.documentUploadBy ?? inventoryDocumentModel.DocumentUploadBy ?? '';
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
  verificationTime:string;
  status:string;
  userID:number;
  constructor(inventoryDocumentVerificationModel) {
    {
       this.inventoryDocumentID = inventoryDocumentVerificationModel.inventoryDocumentID || -1;
       this.inventoryID = inventoryDocumentVerificationModel.inventoryID || '';
       this.inventoryName = inventoryDocumentVerificationModel.inventoryName || '';
       this.document =
         inventoryDocumentVerificationModel.document ??
         inventoryDocumentVerificationModel.Document ??
         inventoryDocumentVerificationModel.documentName ??
         inventoryDocumentVerificationModel.DocumentName ??
         '';
       this.documentID = inventoryDocumentVerificationModel.documentID || '';
       this.documentNumber = inventoryDocumentVerificationModel.documentNumber || '';
       this.documentIssuingAuthority = inventoryDocumentVerificationModel.documentIssuingAuthority || '';
       this.documentImage =
         inventoryDocumentVerificationModel.documentImage
         ?? inventoryDocumentVerificationModel.DocumentImage
         ?? '';
       this.documentImageNonAvailabilityReason =
         inventoryDocumentVerificationModel.documentImageNonAvailabilityReason
         ?? inventoryDocumentVerificationModel.DocumentImageNonAvailabilityReason
         ?? '';
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
       this.verificationTime = inventoryDocumentVerificationModel.verificationTime ?? inventoryDocumentVerificationModel.VerificationTime ?? '';

       const verificationDateRaw = inventoryDocumentVerificationModel.verificationDate ?? inventoryDocumentVerificationModel.VerificationDate;
       this.verificationDate = verificationDateRaw || null;
       const documentExpiryRaw =
         inventoryDocumentVerificationModel.documentExpiry ??
         inventoryDocumentVerificationModel.DocumentExpiry;
       this.documentExpiry = documentExpiryRaw ? new Date(documentExpiryRaw) : null;
    }
  }
  
}

