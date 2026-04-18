// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverDocumentVerification {
  driverDocumentID:number;
  driverID:number;
  driverName: string;
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
      //  this.documentVerified = driverDocument.documentVerified || '';
       this.verified = driverDocument.verified || '';
       this.verifiedBy = driverDocument.verifiedBy || '';
       this.verificationRemark = driverDocument.verificationRemark || '';
       this.verificationDateString = driverDocument.verificationDateString || '';

       this.verificationDate=new Date();
       this.documentExpiry=new Date();
    }
  }
  
}

