// @ts-nocheck
import { formatDate } from '@angular/common';
export class StatesDropDown {
 
   geoPointID: number;
   geoPointName: string;
   gstNumber:string;

  constructor(stateDropDown) {
    {
       this.geoPointID = stateDropDown.geoPointID || -1;
       this.geoPointName = stateDropDown.geoPointName || '';
    }
  }
  
}

