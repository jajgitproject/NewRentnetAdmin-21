// @ts-nocheck
import { formatDate } from '@angular/common';
export class TollParkingType {
  tollParkingTypeID: number;
  userID:number;
   tollParkingType: string;
   activationStatus: boolean;

  constructor(tollParkingType) {
    {
       this.tollParkingTypeID = tollParkingType.tollParkingTypeID || -1;
       this.tollParkingType = tollParkingType.tollParkingType || '';
       this.activationStatus = tollParkingType.activationStatus || '';
    }
  }
  
}

