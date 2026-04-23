// @ts-nocheck
import { formatDate } from '@angular/common';
export class ChangeSaleForCustomersDropDown {
   changeSaleForCustomersID: number;
   supplierContractID: string;

  constructor(changeSaleForCustomersDropDown) {
    {
       this.changeSaleForCustomersID = changeSaleForCustomersDropDown.changeSaleForCustomersID || -1;
       this.supplierContractID = changeSaleForCustomersDropDown.supplierContractID || '';
    }
  }
  
}

