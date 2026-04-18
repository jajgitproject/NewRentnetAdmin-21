// @ts-nocheck
import { formatDate } from '@angular/common';
export class CityDropDown {
  geoPointName: string;
  geoPointID: number;

  constructor(cityDropDown) {
    {
       this.geoPointID = cityDropDown.geoPointID || -1;
       this.geoPointName = cityDropDown.geoPointName || '';
    }
  }
  
}

