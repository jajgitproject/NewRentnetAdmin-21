// @ts-nocheck
import { formatDate } from '@angular/common';
export class OtherFilterDropDown {
   otherFilterID: number;
   otherFilter: string;

  constructor(otherFilterDropDown) {
    {
       this.otherFilterID = otherFilterDropDown.otherFilterID || -1;
       this.otherFilter = otherFilterDropDown.otherFilter || '';
    }
  }
  
}

