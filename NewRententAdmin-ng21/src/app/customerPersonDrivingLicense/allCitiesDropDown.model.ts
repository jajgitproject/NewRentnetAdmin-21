// @ts-nocheck
import { formatDate } from '@angular/common';
export class AllCitiesDropDown {
  geoPointID: number;
  geoPointName: string;

  constructor(cityDropDown) {
    {
      this.geoPointID = cityDropDown.geoPointID || -1;
      this.geoPointName = cityDropDown.geoPointName || '';
    }
  }
  
}

