// @ts-nocheck
import { formatDate } from '@angular/common';
export class StopOnMapInfo {
   StopOnMapInfoID: number;
   StopOnMapInfo: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(StopOnMapInfo) {
    {
       this.StopOnMapInfoID = StopOnMapInfo.StopOnMapInfoID || -1;
       this.StopOnMapInfo = StopOnMapInfo.StopOnMapInfo || '';
       this.activationStatus = StopOnMapInfo.activationStatus || '';
       this.updatedBy=StopOnMapInfo.updatedBy || 10;
       this.updateDateTime = StopOnMapInfo.updateDateTime;
    }
  }
  
}

