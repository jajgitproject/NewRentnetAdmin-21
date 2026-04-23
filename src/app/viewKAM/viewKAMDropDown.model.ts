// @ts-nocheck
import { formatDate } from '@angular/common';
export class ViewKAMDropDown {
 
   viewKAMID: number;
   viewKAMName: string;

  constructor(viewKAMDropDown) {
    {
       this.viewKAMID = viewKAMDropDown.viewKAMID || -1;
       this.viewKAMName = viewKAMDropDown.viewKAMName || '';
    }
  }
  
}

