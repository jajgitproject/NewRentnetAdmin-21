// @ts-nocheck
import { formatDate } from '@angular/common';
export class CityGroupDropDown {
   cityGroupID: number;
   cityGroup: string;

  constructor(cityGroupDropDown) {
    {
       this.cityGroupID = cityGroupDropDown.cityGroupID || -1;
       this.cityGroup = cityGroupDropDown.cityGroup || '';
    }
  }
  
}

