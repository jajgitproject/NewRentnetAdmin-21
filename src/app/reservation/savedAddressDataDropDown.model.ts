// @ts-nocheck
import { formatDate } from '@angular/common';
export class SavedAddressDataDropDown {
   customerPersonID: number;
   customerPersonName: string;
   primaryMobile: string;
   customerName:string;
   customerGroup:string;

  constructor(savedAddressDataDropDown) {
    {
       this.customerPersonID = savedAddressDataDropDown.customerPersonID || -1;
       this.customerPersonName = savedAddressDataDropDown.customerPersonName || '';
       this.primaryMobile = savedAddressDataDropDown.primaryMobile || '';
       this.customerName = savedAddressDataDropDown.customerName || '';
       this.customerGroup = savedAddressDataDropDown.customerGroup || '';
    }
  }
  
}

