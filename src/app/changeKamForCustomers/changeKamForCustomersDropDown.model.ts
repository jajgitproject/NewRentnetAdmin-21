// @ts-nocheck
import { formatDate } from '@angular/common';
export class ChangeKamForCustomersDropDown {
   changeKamForCustomersID: number;
   supplierContractID: string;

  constructor(changeKamForCustomersDropDown) {
    {
       this.changeKamForCustomersID = changeKamForCustomersDropDown.changeKamForCustomersID || -1;
       this.supplierContractID = changeKamForCustomersDropDown.supplierContractID || '';
    }
  }
  
}

