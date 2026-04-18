// @ts-nocheck
import { formatDate } from '@angular/common';
export class Amenitie {
   amenitieID: number;
   amenitie: string;
   userID:number;
   activationStatus: boolean;

  constructor(amenitie) {
    {
       this.amenitieID = amenitie.amenitieID || -1;
       this.amenitie = amenitie.amenitie || '';
       this.activationStatus = amenitie.activationStatus || '';
    }
  }
  
}

