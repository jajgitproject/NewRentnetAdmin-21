// @ts-nocheck
import { formatDate } from '@angular/common';
export class SpotTypeDropDown {
 
   geoPointTypeID: number;
   geoPointType: string;

  constructor(spotTypeDropDown) {
    {
       this.geoPointTypeID = spotTypeDropDown.geoPointTypeID || -1;
       this.geoPointType = spotTypeDropDown.geoPointType || '';
    }
  }
  
}

