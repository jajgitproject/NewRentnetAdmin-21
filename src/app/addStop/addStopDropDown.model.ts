// @ts-nocheck
import { formatDate } from '@angular/common';
export class AddStopDropDown {
   addStopID: number;
   addStop: string;

  constructor(addStopDropDown) {
    {
       this.addStopID = addStopDropDown.addStopID || -1;
       this.addStop = addStopDropDown.addStop || '';
    }
  }
  
}

