// @ts-nocheck
import { formatDate } from '@angular/common';
export class ServiceTypeDropDown {
   serviceTypeID: number;
   serviceType: string;

  constructor(serviceTypeDropDown) {
    {
       this.serviceTypeID = serviceTypeDropDown.serviceTypeID || -1;
       this.serviceType = serviceTypeDropDown.serviceType || '';
    }
  }
  
}

