// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerAllowedCarsInCDPDropDown {
 
  customerAllowedCarsInCDPID: number;
  customerAllowedCarsInCDP: string;

  constructor(customerAllowedCarsInCDP) {
    {
       this.customerAllowedCarsInCDPID = customerAllowedCarsInCDP.customerAllowedCarsInCDPID || -1;
       this.customerAllowedCarsInCDP = customerAllowedCarsInCDP.customerAllowedCarsInCDP || '';
    }
  }
  
}

