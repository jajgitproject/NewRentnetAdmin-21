// @ts-nocheck
import { formatDate } from '@angular/common';
export class StopDetailsInfo {
   StopDetailsInfoID: number;
   StopDetailsInfo: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(StopDetailsInfo) {
    {
       this.StopDetailsInfoID = StopDetailsInfo.StopDetailsInfoID || -1;
       this.StopDetailsInfo = StopDetailsInfo.StopDetailsInfo || '';
       this.activationStatus = StopDetailsInfo.activationStatus || '';
       this.updatedBy=StopDetailsInfo.updatedBy || 10;
       this.updateDateTime = StopDetailsInfo.updateDateTime;
    }
  }
  
}

