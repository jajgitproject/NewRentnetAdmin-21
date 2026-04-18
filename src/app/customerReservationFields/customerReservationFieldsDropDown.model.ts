// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerReservationFieldsDropDown {
   customerReservationFieldsID: number;
   supplierContractID: string;

  constructor(customerReservationFieldsDropDown) {
    {
       this.customerReservationFieldsID = customerReservationFieldsDropDown.customerReservationFieldsID || -1;
       this.supplierContractID = customerReservationFieldsDropDown.supplierContractID || '';
    }
  }
  
}

