// @ts-nocheck
import { formatDate } from '@angular/common';
export class LocationGroup {
   locationGroupID: number;
   locationGroup: string;
   activationStatus: boolean;
   userID:number;

  constructor(locationGroup) {
    {
       this.locationGroupID = locationGroup.locationGroupID || -1;
       this.locationGroup = locationGroup.locationGroup || '';
       this.activationStatus = locationGroup.activationStatus || '';
    }
  }
  
}

