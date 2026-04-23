// @ts-nocheck
import { formatDate } from '@angular/common';
export class Country {
    geoPointID: number;
    geoLocation: string;
    geoSearchString: string;
    geoPointName : string;
    countryISDCode : string;
    countryCurrencyID : number;
    countryISOCode : string;
    countryFlagIcon : string;
    apiIntegrationCode : string;
    bannerImage : string;
    bannerImageAltTag : string;
    icon : string;
    iconAltTag : string;
    latitude:string;
    longitude:string;
    currencyName:string;
    currency:string;
    activationStatus:boolean;
    userID:number;
    googlePlacesID:string;
    oldRentNetGeoPointName:string;
  constructor(country) {
    {
       this.geoPointID = country.geoPointID || -1;
       this.geoLocation = country.geoLocation || '';
       this.geoSearchString = country.geoSearchString || '';
       this.geoPointName = country.geoPointName || '';
        this.oldRentNetGeoPointName = country.oldRentNetGeoPointName || '';
       this.countryISDCode = country.countryISDCode || '';
       this.countryCurrencyID = country.countryCurrencyID || '';
       this.countryISOCode = country.countryISOCode || '';
       this.countryFlagIcon = country.countryFlagIcon || '';
       this.apiIntegrationCode = country.apiIntegrationCode || '';
       this.bannerImage = country.bannerImage || '';
       this.bannerImageAltTag = country.bannerImageAltTag || '';
       this.icon = country.icon || '';
       this.iconAltTag = country.iconAltTag || '';
       this.activationStatus = country.activationStatus || '';
       this.googlePlacesID = country.googlePlacesID  || '';
       
    }
  }
  
}

