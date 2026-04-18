// @ts-nocheck
import { formatDate } from '@angular/common';
export class DisputeTypeDropDown {
   disputetypeID: number;
   disputetype: string;

  constructor(disputetypeDropDown) {
    {
       this.disputetypeID = disputetypeDropDown.disputetypeID || -1;
       this.disputetype = disputetypeDropDown.disputetype || '';
    }
  }
  
}

