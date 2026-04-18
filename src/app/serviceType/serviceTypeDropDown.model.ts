// @ts-nocheck
import { formatDate } from '@angular/common';
export class ServiceTypeDropDown {
 
   serviceTypeID: number;
   name: string;

  constructor(serviceTypeDropDown) {
    {
       this.serviceTypeID = serviceTypeDropDown.serviceTypeID || -1;
       this.name = serviceTypeDropDown.name || '';
    }
  }
  
}

