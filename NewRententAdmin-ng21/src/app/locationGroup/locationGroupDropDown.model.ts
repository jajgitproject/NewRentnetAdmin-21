// @ts-nocheck
import { formatDate } from '@angular/common';
export class LocationGroupDropDown {
   locationGroupID: number;
   locationGroup: string;

  constructor(locationGroupDropDown) {
    {
       this.locationGroupID = locationGroupDropDown.locationGroupID || -1;
       this.locationGroup = locationGroupDropDown.locationGroup || '';
    }
  }
  
}

