// @ts-nocheck
import { formatDate } from '@angular/common';
export class GeoPointTypeDropDown {
 
   geoPointTypeID: number;
   geoPointType: string;

  constructor(geoPointTypeDropDown) {
    {
       this.geoPointTypeID = geoPointTypeDropDown.geoPointTypeID || -1;
       this.geoPointType = geoPointTypeDropDown.geoPointType || '';
    }
  }
  
}

