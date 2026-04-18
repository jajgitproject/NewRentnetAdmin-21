// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyDetails {
   dutyDetailsID: number;
   dutyDetails: string;
   activationStatus: string;
   passenger:string;
   updatedBy:number;
   updateDateTime: Date;
   dutyType:string;
   package:string;
   car:string;
   city:string;
   pickupAddress:string;
   droffAddress:string;

  constructor(dutyDetails) {
    {
       this.dutyDetailsID = dutyDetails.dutyDetailsID || -1;
       this.dutyDetails = dutyDetails.dutyDetails || '';
       this.activationStatus = dutyDetails.activationStatus || '';
       this.updatedBy=dutyDetails.updatedBy || 10;
       this.updateDateTime = dutyDetails.updateDateTime;
    }
  }
  
}

