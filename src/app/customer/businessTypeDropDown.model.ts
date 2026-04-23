// @ts-nocheck
import { formatDate } from '@angular/common';
export class BusinessTypeDropDown {
   businessTypeID: number;
   businessTypeName: string;

  constructor(businessTypeDropDown) {
    {
       this.businessTypeID = businessTypeDropDown.businessTypeID || -1;
       this.businessTypeName = businessTypeDropDown.businessTypeName || '';
    }
  }
  
}

