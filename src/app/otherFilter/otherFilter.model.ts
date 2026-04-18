// @ts-nocheck
import { formatDate } from '@angular/common';
export class OtherFilter {
   otherFilterID: number;
   otherFilter: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(otherFilter) {
    {
       this.otherFilterID = otherFilter.otherFilterID || -1;
       this.otherFilter = otherFilter.otherFilter || '';
       this.activationStatus = otherFilter.activationStatus || '';
       this.updatedBy=otherFilter.updatedBy || 10;
       this.updateDateTime = otherFilter.updateDateTime;
    }
  }
  
}

