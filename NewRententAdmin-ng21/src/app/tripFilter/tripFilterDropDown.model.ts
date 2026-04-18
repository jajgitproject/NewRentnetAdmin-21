// @ts-nocheck
import { formatDate } from '@angular/common';
export class TripFilterDropDown {
   tripFilterID: number;
   tripFilter: string;

  constructor(tripFilterDropDown) {
    {
       this.tripFilterID = tripFilterDropDown.tripFilterID || -1;
       this.tripFilter = tripFilterDropDown.tripFilter || '';
    }
  }
  
}

