// @ts-nocheck
import { formatDate } from '@angular/common';
export class CityTier {
   cityTierID: number;
   cityTierName: string;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   userID:number;
  constructor(cityTier) {
    {
       this.cityTierID = cityTier.cityTierID || -1;
       this.cityTierName = cityTier.cityTierName || '';
       this.activationStatus = cityTier.activationStatus || '';
       this.updatedBy=cityTier.updatedBy || 10;
       this.updateDateTime = cityTier.updateDateTime;
    }
  }
  
}

