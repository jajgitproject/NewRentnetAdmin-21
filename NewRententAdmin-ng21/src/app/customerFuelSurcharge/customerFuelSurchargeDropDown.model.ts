// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerFuelSurchargeDropDown {
 
   customerFuelSurchargeID: number;
   customerFuelSurcharge: string;

  constructor(customerFuelSurchargeDropDown) {
    {
       this.customerFuelSurchargeID = customerFuelSurchargeDropDown.customerFuelSurchargeID || -1;
       this.customerFuelSurcharge = customerFuelSurchargeDropDown.customerFuelSurcharge || '';
    }
  }
  
}

