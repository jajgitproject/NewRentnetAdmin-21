// @ts-nocheck
import { formatDate } from '@angular/common';
export class ExistingBids {
   ExistingBidsID: number;
   ExistingBids: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(ExistingBids) {
    {
       this.ExistingBidsID = ExistingBids.ExistingBidsID || -1;
       this.ExistingBids = ExistingBids.ExistingBids || '';
       this.activationStatus = ExistingBids.activationStatus || '';
       this.updatedBy=ExistingBids.updatedBy || 10;
       this.updateDateTime = ExistingBids.updateDateTime;
    }
  }
  
}

