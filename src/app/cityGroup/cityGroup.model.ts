// @ts-nocheck
import { formatDate } from '@angular/common';
export class CityGroup {
   cityGroupID: number;
   cityGroup: string;
 
   activationStatus: boolean;
   userID:number;

  constructor(cityGroup) {
    {
       this.cityGroupID = cityGroup.cityGroupID || -1;
      
       this.activationStatus = cityGroup.activationStatus || '';
       this.cityGroup=cityGroup.cityGroup || '';
     
    }
  }
  
}

