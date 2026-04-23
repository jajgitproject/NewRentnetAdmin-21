// @ts-nocheck
import { formatDate } from '@angular/common';

export class CarMovingStatusByAppModel {
  carMovingStatusID: number;
  dutySlipID:number;
  reservationID:number;
  difference: number;
  status:string;
  locationBeforeTwoMinutes:string;
  currentLocation:string;
  currentDateTime:Date;  
}

