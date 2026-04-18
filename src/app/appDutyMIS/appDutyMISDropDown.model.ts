// @ts-nocheck
import { formatDate } from '@angular/common';
export class AppDutyMISDropDown {
  interstateTaxEntryID: number;
  interstateTaxEntry: string;

  constructor(interstateTaxEntryDropDown) {
    {
       this.interstateTaxEntryID = interstateTaxEntryDropDown.interstateTaxEntryID || -1;
       this.interstateTaxEntry = interstateTaxEntryDropDown.interstateTaxEntry || '';
    }
  }
  
}

