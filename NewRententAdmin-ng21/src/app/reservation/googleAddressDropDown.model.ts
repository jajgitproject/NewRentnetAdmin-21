// @ts-nocheck
import { formatDate } from '@angular/common';
export class GoogleAddressDropDown {
   geoPointID: number;
   geoSearchString: string;
   spot: string;
   spotTypeID: number;
   spotType: string;
   geoLocation: string;

  constructor(googleAddressDropDown) {
    {
       this.geoPointID = googleAddressDropDown.geoPointID || -1;
       this.geoSearchString = googleAddressDropDown.geoSearchString || '';
       this.spot = googleAddressDropDown.spot || '';
       this.spotTypeID = googleAddressDropDown.spotTypeID || '';
       this.spotType = googleAddressDropDown.spotType || '';
       this.geoLocation = googleAddressDropDown.geoLocation || '';
    }
  }
  
}

