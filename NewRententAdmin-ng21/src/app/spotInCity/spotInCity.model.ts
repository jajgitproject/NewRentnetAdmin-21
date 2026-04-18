// @ts-nocheck
import { formatDate } from '@angular/common';
export class SpotInCity {
    geoPointID: number;
    userID:number;
    geoPointTypeID: number;
    geoPointParentID: number;
    geoLocation: string;
    geoSearchString: string;
    geoPointName : string;
    geoPointType : string;
    apiIntegrationCode : string;
    bannerImage : string;
    bannerImageAltTag : string;
    parent:string;
    spotType:string;
    type:string;
    icon : string;
    iconAltTag : string;
    latitude:string;
    longitude:string;
    activationStatus:boolean;
   
  constructor(spotInCity) {
    {
       this.geoPointID = spotInCity.geoPointID || -1;
       this.geoPointTypeID = spotInCity.geoPointTypeID || '';
       this.geoPointParentID = spotInCity.geoPointParentID || '';
       this.geoLocation = spotInCity.geoLocation || '';
       this.geoSearchString = spotInCity.geoSearchString || '';
       this.geoPointName = spotInCity.geoPointName || '';
       this.apiIntegrationCode = spotInCity.apiIntegrationCode || '';
       this.bannerImage = spotInCity.bannerImage || '';
       this.bannerImageAltTag = spotInCity.bannerImageAltTag || '';
       this.icon = spotInCity.icon || '';
       this.iconAltTag = spotInCity.iconAltTag || '';
       this.activationStatus = spotInCity.activationStatus || '';
       
    }
  }
  
}

