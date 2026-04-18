// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationReservationDropDown {
 
   customerConfigurationReservationID: number;
   customerConfigurationReservation: string;

  constructor(customerConfigurationReservationDropDown) {
    {
       this.customerConfigurationReservationID = customerConfigurationReservationDropDown.customerConfigurationReservationID || -1;
       this.customerConfigurationReservation = customerConfigurationReservationDropDown.customerConfigurationReservation || '';
    }
  }
  
}

