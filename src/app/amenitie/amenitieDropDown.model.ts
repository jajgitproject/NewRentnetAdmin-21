// @ts-nocheck
import { formatDate } from '@angular/common';
export class AmenitieDropDown {
   amenitieID: number;
   amenitie: string;

  constructor(amenitieDropDown) {
    {
       this.amenitieID = amenitieDropDown.amenitieID || -1;
       this.amenitie = amenitieDropDown.amenitie || '';
    }
  }
  
}

