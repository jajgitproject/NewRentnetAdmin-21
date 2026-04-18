// @ts-nocheck
import { formatDate } from '@angular/common';
export class OtherFields {
   otherFieldsID: number;
   otherFields: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(otherFields) {
    {
       this.otherFieldsID = otherFields.otherFieldsID || -1;
       this.otherFields = otherFields.otherFields || '';
       this.activationStatus = otherFields.activationStatus || '';
       this.updatedBy=otherFields.updatedBy || 10;
       this.updateDateTime = otherFields.updateDateTime;
    }
  }
  
}

