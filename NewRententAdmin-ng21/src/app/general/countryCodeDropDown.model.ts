// @ts-nocheck
import { formatDate } from '@angular/common';
export class CountryCodeDropDown {
   geoPointID: number;
   countryISDCode: string;
   countryISOCode:string;
   icon:string;

  constructor(countryCodeDropDown) {
    {
       this.geoPointID = countryCodeDropDown.geoPointID || '';
       this.countryISDCode = countryCodeDropDown.countryISDCode || '';
       this.countryISOCode = countryCodeDropDown.countryISOCode || '';
       this.icon = countryCodeDropDown.icon || '';
    }
  }
  
}

