// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierVerificationDocuments {
   supplierVerificationDocumentsID: number;
   supplierID: number;
   userID:number;
   supplierRequiredDocumentsID:number;
   supplierRequiredDocumentsImage:string;
   supplierRequiredDocumentsNumber:string;
   supplierRequiredDocumentNonAvailabilityReason:string;
   supplierRequiredDocumentAddedByEmployeeID:number;
   supplierRequiredDocumentAdditionDateString: string;
   supplierRequiredDocumentAdditionDate:Date;
   activationStatus: boolean;
  supplierName: string;
  employeeName:string;
  documentName:string;
  validTill:Date;
  validTillString:string;

  constructor(supplierVerificationDocuments) {
    {
       this.supplierVerificationDocumentsID = supplierVerificationDocuments.supplierVerificationDocumentsID || -1;
       this.supplierID = supplierVerificationDocuments.supplierID || '';
       this.supplierRequiredDocumentsID = supplierVerificationDocuments.supplierRequiredDocumentsID || '';
       this.supplierRequiredDocumentsImage = supplierVerificationDocuments.supplierRequiredDocumentsImage || '';
       this.supplierRequiredDocumentsNumber=supplierVerificationDocuments.supplierRequiredDocumentsNumber || '';
       this.supplierRequiredDocumentNonAvailabilityReason=supplierVerificationDocuments.supplierRequiredDocumentNonAvailabilityReason || '';
       this.supplierRequiredDocumentAddedByEmployeeID = supplierVerificationDocuments.supplierRequiredDocumentAddedByEmployeeID;
       this.supplierRequiredDocumentAdditionDateString = supplierVerificationDocuments.supplierRequiredDocumentAdditionDateString;
       this.activationStatus = supplierVerificationDocuments.activationStatus || '';
       this.validTillString = supplierVerificationDocuments.validTillString || '';
       this.documentName = supplierVerificationDocuments.documentName || '';
       this.supplierRequiredDocumentAdditionDate=new Date();
       this.validTill=new Date();
      }

  }
  
}

