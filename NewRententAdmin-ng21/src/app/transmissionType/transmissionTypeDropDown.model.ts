// @ts-nocheck
import { formatDate } from '@angular/common';
export class TransmissionTypeDropDown {
   transmissionTypeID: number;
   transmissionType: string;

  constructor(transmissionTypeDropDown) {
    {
       this.transmissionTypeID = transmissionTypeDropDown.transmissionTypeID || -1;
       this.transmissionType = transmissionTypeDropDown.transmissionType || '';
    }
  }
  
}

