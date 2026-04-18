// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverDocumentDropDown {
 
   driverDocumentID: number;
   documentNumber: string;

  constructor(driverDocumentDropDown) {
    {
       this.driverDocumentID = driverDocumentDropDown.driverDocumentID || -1;
       this.documentNumber = driverDocumentDropDown.documentNumber || '';
    }
  }
  
}

