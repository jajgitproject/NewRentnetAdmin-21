// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyQualityDropDown {
  dutyQualityCheckID: number;
   allotmentID: number;

  constructor(dutyQualityDropDown) {
    {
       this.dutyQualityCheckID = dutyQualityDropDown.dutyQualityCheckID || -1;
       this.allotmentID = dutyQualityDropDown.allotmentID || '';
    }
  }
  
}

