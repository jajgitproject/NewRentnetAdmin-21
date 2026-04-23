// @ts-nocheck
import { formatDate } from '@angular/common';
export class CityGroupDropDown {
 
   cityGroupID: number;
   name: string;

  constructor(cityGroupDropDown) {
    {
       this.cityGroupID = cityGroupDropDown.cityGroupID || -1;
       this.name = cityGroupDropDown.name || '';
    }
  }
  
}

