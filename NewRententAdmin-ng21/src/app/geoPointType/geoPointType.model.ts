// @ts-nocheck
import { formatDate } from '@angular/common';
export class GeoPointType {
   geoPointTypeID: number;
   geoPointType: string;
   parent:string;
   geoPointTypeHierarchyID: number;
   activationStatus:boolean;
   userID:number;
  constructor(geoPointType) {
    {
       this.geoPointTypeID = geoPointType.geoPointTypeID || -1;
       this.geoPointType = geoPointType.geoPointType || '';
       this.geoPointTypeHierarchyID = geoPointType.geoPointTypeHierarchyID || '';
       this.activationStatus = geoPointType.activationStatus || '';
       
    }
  }
  
}

