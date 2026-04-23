// @ts-nocheck
import { formatDate } from '@angular/common';
export class DocumentDropDown {
 
   documentID: number;
   documentName: string;

  constructor(documentDropDown) {
    {
       this.documentID = documentDropDown.documentID || -1;
       this.documentName = documentDropDown.documentName || '';
    }
  }
  
}

