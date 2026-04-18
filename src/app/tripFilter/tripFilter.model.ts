// @ts-nocheck
import { formatDate } from '@angular/common';
export class TripFilter {
   tripFilterID: number;
   tripFilter: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(tripFilter) {
    {
       this.tripFilterID = tripFilter.tripFilterID || -1;
       this.tripFilter = tripFilter.tripFilter || '';
       this.activationStatus = tripFilter.activationStatus || '';
       this.updatedBy=tripFilter.updatedBy || 10;
       this.updateDateTime = tripFilter.updateDateTime;
    }
  }
  
}

