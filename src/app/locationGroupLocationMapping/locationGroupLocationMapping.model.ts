// @ts-nocheck
import { formatDate } from '@angular/common';
export class LocationGroupLocationMapping {
  locationGroupLocationMappingID:number;
  locationGroupID: number;
  locationID:number;
  location:string;
  activationStatus: boolean;
  userID:number;

  constructor(locationGroupLocationMappin) {
    {
      this.locationGroupLocationMappingID = locationGroupLocationMappin.locationGroupLocationMappingID || -1;
      this.locationGroupID = locationGroupLocationMappin.locationGroupID || '';
       this.locationID = locationGroupLocationMappin.locationID || '';
       this.location = locationGroupLocationMappin.location || '';
       this.activationStatus = locationGroupLocationMappin.activationStatus || '';
  
       
    }
  }
  
}

