// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverDocumentVerificationDropDown {
 
   driverDocumentVerificationID: number;
   documentNumber: string;

  constructor(driverDocumentVerificationDropDown) {
    {
       this.driverDocumentVerificationID = driverDocumentVerificationDropDown.driverDocumentVerificationID || -1;
       this.documentNumber = driverDocumentVerificationDropDown.documentNumber || '';
    }
  }
  
}

