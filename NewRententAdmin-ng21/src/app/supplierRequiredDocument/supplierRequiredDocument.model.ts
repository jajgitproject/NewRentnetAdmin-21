// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierRequiredDocument {
  supplierRequiredDocumentsID: number;
  documentID: number;
  documentName: string;
   validToString:string;
   validFromString:string;
   validFrom:Date;
   validTo:Date;
   requiredForSoftAttachment:Boolean;
   requiredForFullAttachment:Boolean;
   activationStatus: Boolean;
   userID:number;
  

  constructor(supplierRequiredDocument) {
    {
       this.supplierRequiredDocumentsID = supplierRequiredDocument.supplierRequiredDocumentsID || -1;
       this.documentID = supplierRequiredDocument.documentID || '';
       this.validToString = supplierRequiredDocument.validToString || '';
       this.validFromString = supplierRequiredDocument.validFromString || '';
       this.requiredForFullAttachment = supplierRequiredDocument.requiredForFullAttachment || '';
       this.requiredForSoftAttachment = supplierRequiredDocument.requiredForSoftAttachment || '';
       this.activationStatus = supplierRequiredDocument.activationStatus || '';
       this.validFrom=new Date();
       this.validTo=new Date();
      
    }
  }
  
}

