// @ts-nocheck
import { formatDate } from '@angular/common';
export class CurrentDesginationDropDown {
   currentDesginationID: number;
   currentDesgination: string;

  constructor(currentDesginationDropDown) {
    {
       this.currentDesginationID = currentDesginationDropDown.currentDesginationID || -1;
       this.currentDesgination = currentDesginationDropDown.currentDesgination || '';
    }
  }
  
}

