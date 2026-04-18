// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDocumentVerification {
  customerPersonDocumentID: number;
  customerPersonID : number;
  documentID : number;
  documentName:string;
  addressCity:string;
  documentNumber:string;
  documentIssuingAuthority:string;
  documentImage:string;
  documentImageNonAvailabilityReason:string;
  addressCityID:number;
  address:string;
  pin:string;
  status:string;
  documentExpiry :Date; 
  documentExpiryString:string;
  activationStatus: Boolean;
  verified: string;
  documentVerified:string;
  documentVerifiedBy:string;
  documentVerifiedRemark:string;
  documentVerifiedDate:Date;
  documentVerifiedDateString:string;
  documentVerifiedByID:number;
  userID:number
  constructor(customerPersonDocumentVerification) {
    {
       this.customerPersonDocumentID = customerPersonDocumentVerification.customerPersonDocumentID || -1;
       this.customerPersonID = customerPersonDocumentVerification.customerPersonID||'';
       this.documentName =customerPersonDocumentVerification.documentName||'';
       this.documentID = customerPersonDocumentVerification.documentID || '';
       this.documentNumber = customerPersonDocumentVerification.documentNumber || '';
       this.documentIssuingAuthority = customerPersonDocumentVerification.documentIssuingAuthority || '';
       this.documentImage = customerPersonDocumentVerification.documentImage || '';
       this.documentImageNonAvailabilityReason = customerPersonDocumentVerification.documentImageNonAvailabilityReason || '';
       this.addressCityID = customerPersonDocumentVerification.addressCityID || '';
       this.address = customerPersonDocumentVerification.address || '';
       this.pin = customerPersonDocumentVerification.pin || '';
       this.verified = customerPersonDocumentVerification.verified || '';
       this.documentVerified = customerPersonDocumentVerification.documentVerified || '';
       this.documentVerifiedBy = customerPersonDocumentVerification.documentVerifiedBy || '';
       this.documentVerifiedRemark = customerPersonDocumentVerification.documentVerifiedRemark || '';
       this.documentVerifiedDateString = customerPersonDocumentVerification.documentVerifiedDateString || '';
       this.addressCity = customerPersonDocumentVerification.addressCity || '';

       this.documentExpiryString = customerPersonDocumentVerification.documentExpiryString || '';
  
       this.activationStatus = customerPersonDocumentVerification.activationStatus || '';
       this.documentVerifiedDate=new Date();
      
    }
  }
  
}

