// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutySlipDropDown {
   dutySlipID: number;
   reservationID: number;
   dutySlipNumber: string;
  registrationNumber: any;
  driverName: any;
  customerName: any;

  constructor(dutySlipDropDown) {
    {
       this.dutySlipID = dutySlipDropDown.dutySlipID || -1;
       this.reservationID = dutySlipDropDown.reservationID || '';
       this.dutySlipNumber = dutySlipDropDown.dutySlipNumber || '';
    }
  }
  
}

