// @ts-nocheck
import { formatDate } from '@angular/common';
export class State {
   geoPointID: number;
   userID:number;
   geoPointParentID: number;
   geoLocation: string;
   parent: string;
   geoSearchString:string;
   geoPointName:string;
   stateGSTCode:string;
   apiIntegrationCode:String;
   bannerImage:string;
   bannerImageAltTag:string;
   icon:string;
   iconAltTag:string;
   activationStatus: boolean;
   latitude:string;
   longitude:string;
   geoPoint_1:string;
   country:string;
  name: any;
  googlePlacesID:string;
   oldRentNetGeoPointName:string;
  constructor(state) {
    {
       this.geoPointID = state.geoPointID || -1;
       this.geoPointParentID = state.geoPointParentID || '';
       this.geoLocation = state.geoLocation || '';
       this.oldRentNetGeoPointName = state.oldRentNetGeoPointName || '';
       this.geoSearchString = state.geoSearchString || '';
       this.geoPointName = state.geoPointName  || '';
       this.stateGSTCode = state.stateGSTCode  || '';
       this.apiIntegrationCode = state.apiIntegrationCode  || '';
       this.bannerImage = state.bannerImage  || '';
       this.bannerImageAltTag = state.bannerImageAltTag  || '';
       this.activationStatus = state.activationStatus || '';
       this.icon = state.icon  || '';
       this.iconAltTag = state.iconAltTag  || '';
       this.geoPoint_1 = state.geoPoint_1  || '';
    
       this.latitude = state.latitude  || '';
       this.longitude = state.longitude  || '';
       this.googlePlacesID = state.googlePlacesID  || '';
    }
  }
  
}

