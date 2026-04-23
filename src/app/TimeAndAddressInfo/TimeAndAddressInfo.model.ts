// @ts-nocheck
import { formatDate } from '@angular/common';
export class TimeAndAddressInfo {
   TimeAndAddressInfoID: number;
   TimeAndAddressInfo: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(TimeAndAddressInfo) {
    {
       this.TimeAndAddressInfoID = TimeAndAddressInfo.TimeAndAddressInfoID || -1;
       this.TimeAndAddressInfo = TimeAndAddressInfo.TimeAndAddressInfo || '';
       this.activationStatus = TimeAndAddressInfo.activationStatus || '';
       this.updatedBy=TimeAndAddressInfo.updatedBy || 10;
       this.updateDateTime = TimeAndAddressInfo.updateDateTime;
    }
  }
  
}

