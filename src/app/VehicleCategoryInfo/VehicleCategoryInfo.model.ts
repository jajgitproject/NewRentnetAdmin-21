// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleCategoryInfo {
   VehicleCategoryInfoID: number;
   VehicleCategoryInfo: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(VehicleCategoryInfo) {
    {
       this.VehicleCategoryInfoID = VehicleCategoryInfo.VehicleCategoryInfoID || -1;
       this.VehicleCategoryInfo = VehicleCategoryInfo.VehicleCategoryInfo || '';
       this.activationStatus = VehicleCategoryInfo.activationStatus || '';
       this.updatedBy=VehicleCategoryInfo.updatedBy || 10;
       this.updateDateTime = VehicleCategoryInfo.updateDateTime;
    }
  }
  
}

