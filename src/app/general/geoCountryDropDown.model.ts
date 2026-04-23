// @ts-nocheck
import { formatDate } from '@angular/common';
export class GeoCountryDropDown {
   geoPointID: number;
   geoPointName: string;

  constructor(geoCountryDropDown) {
    {
       this.geoPointID = geoCountryDropDown.geoPointID || -1;
       this.geoPointName = geoCountryDropDown.geoPointName || '';
    }
  }
  
}

