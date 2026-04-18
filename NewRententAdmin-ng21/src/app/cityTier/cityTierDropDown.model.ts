// @ts-nocheck
import { formatDate } from '@angular/common';
export class CityTierDropDown {
   cityTierID: number;
   cityTierName: string;

  constructor(cityTierDropDown) {
    {
       this.cityTierID = cityTierDropDown.cityTierID || -1;
       this.cityTierName = cityTierDropDown.cityTierName || '';
    }
  }
  
}

