// @ts-nocheck
import { formatDate } from '@angular/common';
export class DisputeTypeDropDown {
    disputeTypeID: number;
    disputeType: string;

  constructor(disputeTypeDropDown) {
    {
        this.disputeTypeID = disputeTypeDropDown.disputeTypeID || -1;
        this.disputeType = disputeTypeDropDown.disputeType || '';
    }
  }
  
}

