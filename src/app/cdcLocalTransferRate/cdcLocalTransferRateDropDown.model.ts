// @ts-nocheck
import { formatDate } from '@angular/common';
export class CDCLocalTransferRateDropDown {
 
   cdcLocalTransferRateID: number;
   cdcLocalTransferRate: string;

  constructor(cdcLocalTransferRateDropDown) {
    {
       this.cdcLocalTransferRateID = cdcLocalTransferRateDropDown.cdcLocalTransferRateID || -1;
       this.cdcLocalTransferRate = cdcLocalTransferRateDropDown.cdcLocalTransferRate || '';
    }
  }
  
}

