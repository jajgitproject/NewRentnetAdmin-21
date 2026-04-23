// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDocument {
  customerPersonDocumentID: number;
  customerPersonID : number;
  documentID : number;
  documentNumber:string;
  documentIssuingAuthority:string;
  documentImage:string;
  documentImageNonAvailabilityReason:string;
  addressCityID:number;
  addressCity:string;
  address:string;
  pin:string;
  documentName:string;
  documentExpiry :Date; 
  documentExpiryString:string;
  activationStatus: Boolean;
  verified:string;
  verifiedData:string;
  verifiedBy:string;
  verfiedRemark:string;
  verficationDate:string;
  userID:number
  constructor(customerPersonDocument) {
    {
       this.customerPersonDocumentID = customerPersonDocument.customerPersonDocumentID || -1;
       this.customerPersonID = customerPersonDocument.customerPersonID||'';
       this.documentID = customerPersonDocument.documentID || '';
       this.documentNumber = customerPersonDocument.documentNumber || '';
       this.documentIssuingAuthority = customerPersonDocument.documentIssuingAuthority || '';
       this.documentImage = customerPersonDocument.documentImage || '';
       this.documentImageNonAvailabilityReason = customerPersonDocument.documentImageNonAvailabilityReason || '';
       this.addressCityID = customerPersonDocument.addressCityID || '';
       this.address = customerPersonDocument.address || '';
       this.pin = customerPersonDocument.pin || '';
       this.documentImageNonAvailabilityReason = customerPersonDocument.documentImageNonAvailabilityReason || '';
       this.addressCityID = customerPersonDocument.addressCityID || '';
       this.address = customerPersonDocument.address || '';
       this.pin = customerPersonDocument.pin || '';
       this.documentExpiryString = customerPersonDocument.documentExpiryString || '';
  
       this.activationStatus = customerPersonDocument.activationStatus || '';
       this.documentExpiry=new Date();
      
    }
  }
  
}

