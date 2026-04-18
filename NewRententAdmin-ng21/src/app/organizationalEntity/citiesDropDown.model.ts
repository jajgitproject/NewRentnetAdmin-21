// @ts-nocheck
import { formatDate } from '@angular/common';
export class CitiesDropDown {
  geoPointID: number;
  geoPointName: string;

  constructor(cityDropDown) {
    {
      this.geoPointID = cityDropDown.geoPointID || -1;
      this.geoPointName = cityDropDown.geoPointName || '';
    }
  }
  
}

