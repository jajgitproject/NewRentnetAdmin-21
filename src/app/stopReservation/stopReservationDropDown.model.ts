// @ts-nocheck
import { formatDate } from '@angular/common';
export class StopReservationDropDown {
   stopReservationID: number;
   supplierContractID: string;

  constructor(stopReservationDropDown) {
    {
       this.stopReservationID = stopReservationDropDown.stopReservationID || -1;
       this.supplierContractID = stopReservationDropDown.supplierContractID || '';
    }
  }
  
}

