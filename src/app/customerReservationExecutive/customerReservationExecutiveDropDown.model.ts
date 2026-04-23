// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerReservationExecutiveDropDown {
   customerReservationExecutiveID: number;
   supplierContractID: string;

  constructor(customerReservationExecutiveDropDown) {
    {
       this.customerReservationExecutiveID = customerReservationExecutiveDropDown.customerReservationExecutiveID || -1;
       this.supplierContractID = customerReservationExecutiveDropDown.supplierContractID || '';
    }
  }
  
}

