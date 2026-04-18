// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverDocument {
  driverDocumentID:number;
  driverID:number;
  driverName: string;
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
  constructor(driverDocument) {
    {
       this.driverDocumentID = driverDocument.driverDocumentID || -1;
       this.driverID = driverDocument.driverID || '';
       this.driverName = driverDocument.driverName || '';
       this.documentID = driverDocument.documentID || '';
       this.documentNumber = driverDocument.documentNumber || '';
       this.documentIssuingAuthority = driverDocument.documentIssuingAuthority || '';
       this.documentImage = driverDocument.documentImage || '';
       this.documentImageNonAvailabilityReason = driverDocument.documentImageNonAvailabilityReason || '';
       this.addressCityID = driverDocument.addressCityID || 0;
       this.address = driverDocument.address || '';
       this.documentExpiryString = driverDocument.documentExpiryString || '';
       this.pin = driverDocument.pin || '';
       this.activationStatus = driverDocument.activationStatus || '';
       this.verified = driverDocument.verified || '';
       this.verifiedBy = driverDocument.verifiedBy || '';
       this.verificationRemark = driverDocument.verificationRemark || '';
       this.verificationDate = driverDocument.verificationDate || '';

       this.documentExpiry=new Date();
    }
  }
  
}

