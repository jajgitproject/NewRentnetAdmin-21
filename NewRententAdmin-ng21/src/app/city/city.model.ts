// @ts-nocheck
import { formatDate } from '@angular/common';
export class City {
  geoPointID: number;
  geoPointParentID :number;
  geoLocation : string;
  geoSearchString: string;
  geoPointName:string;
  cityGroupID : number;
  cityTierID : number;
  citySTDCode : string;
  bannerImage:string; 
  longitude:string;
  latitude:string;
  apiIntegrationCode : string;
  bannerImageAltTag :string;
  icon: string;
  iconAltTag:string;
  activationStatus: boolean;
  state:string;
  GeoPoint_1 :string;
  cityGroup:string;
  countryID:number;
  country:string;
  cityTierName:string;
  userID:number;
  googlePlacesID:string;
  oldRentNetGeoPointName:string;
  constructor(city) {
    {
       this.geoPointID = city.geoPointID || -1;
       this.geoPointParentID = city.geoPointParentID || '';
       this.geoLocation = city.geoLocation || '';
       this.geoPointName = city.geoPointName || '';
      this.oldRentNetGeoPointName = city.oldRentNetGeoPointName || '';
       this.longitude = city.longitude || '';
       this.latitude = city.latitude || '';
       this.geoSearchString = city.geoSearchString || '';

       this.cityGroupID = city.cityGroupID || '';
       this.cityTierID = city.cityTierID || '';
       this.citySTDCode = city.citySTDCode || '';
       this.cityGroup = city.cityGroup || '';
       this.state=city.state || '';
       this.GeoPoint_1 = city.GeoPoint_1 || '';
       this.apiIntegrationCode = city.apiIntegrationCode || '';
       this.bannerImage = city.bannerImage || '';
       this.bannerImageAltTag=city.bannerImageAltTag || '';
       this.icon = city.icon;
       this.iconAltTag =city.iconAltTag;
       this.activationStatus = city.activationStatus || '';
       this.googlePlacesID = city.googlePlacesID  || '';
    }
  }
  
}

