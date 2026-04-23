// @ts-nocheck
import { formatDate } from '@angular/common';
export class SDLimitedRateDropDown {
 
   sdlimitedRateID: number;
   sdlimitedRate: string;

  constructor(sdlimitedRateDropDown) {
    {
       this.sdlimitedRateID = sdlimitedRateDropDown.sdlimitedRateID || -1;
       this.sdlimitedRate = sdlimitedRateDropDown.sdlimitedRate || '';
    }
  }
  
}

