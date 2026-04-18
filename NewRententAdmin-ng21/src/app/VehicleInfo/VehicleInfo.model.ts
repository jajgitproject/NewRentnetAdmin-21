// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleInfo {
   VehicleInfoID: number;
   VehicleInfo: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(VehicleInfo) {
    {
       this.VehicleInfoID = VehicleInfo.VehicleInfoID || -1;
       this.VehicleInfo = VehicleInfo.VehicleInfo || '';
       this.activationStatus = VehicleInfo.activationStatus || '';
       this.updatedBy=VehicleInfo.updatedBy || 10;
       this.updateDateTime = VehicleInfo.updateDateTime;
    }
  }
  
}

