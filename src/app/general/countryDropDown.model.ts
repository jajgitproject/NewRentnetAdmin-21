// @ts-nocheck
import { formatDate } from '@angular/common';
export class CountryDropDown {
   geoPointID: number;
   geoPointName: string;

  constructor(countryDropDown) {
    {
       this.geoPointID = countryDropDown.geoPointID || -1;
       this.geoPointName = countryDropDown.geoPointName || '';
    }
  }
  
}

