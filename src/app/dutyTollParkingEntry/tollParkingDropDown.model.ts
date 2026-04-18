// @ts-nocheck
import { formatDate } from '@angular/common';
export class TollParkingTypeDropDown {
   tollParkingTypeID: number;
   tollParkingType: string;

  constructor(tollParkingTypeDropDown) {
    {
       this.tollParkingTypeID = tollParkingTypeDropDown.tollParkingTypeID || -1;
       this.tollParkingType = tollParkingTypeDropDown.tollParkingType || '';
    }
  }
  
}

