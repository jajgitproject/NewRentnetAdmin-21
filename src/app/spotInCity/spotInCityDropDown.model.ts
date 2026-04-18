// @ts-nocheck
import { formatDate } from '@angular/common';
export class SpotInCityDropDown {
 
   geoPointID: number;
   geoPointName: string;

  constructor(spotInCityDropDown) {
    {
       this.geoPointID = spotInCityDropDown.geoPointID || -1;
       this.geoPointName = spotInCityDropDown.geoPointName || '';
    }
  }
  
}

