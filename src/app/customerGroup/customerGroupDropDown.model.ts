// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerGroupDropDown {
   customerGroupID: number;
   customerGroup: string;

  constructor(CustomeGrouprDropDown) {
    {
       this.customerGroupID = CustomeGrouprDropDown.customerGroupID || -1;
       this.customerGroup = CustomeGrouprDropDown.customerGroup || '';
    }
  }
  
}

