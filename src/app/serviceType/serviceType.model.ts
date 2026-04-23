// @ts-nocheck
import { formatDate } from '@angular/common';
export class ServiceType {
   serviceTypeID: number;
   userID:number;
   serviceType: string;
 
   activationStatus: boolean;
  

  constructor(serviceType) {
    {
       this.serviceTypeID = serviceType.serviceTypeID || -1;
      
       this.activationStatus = serviceType.activationStatus || '';
       this.serviceType=serviceType.serviceType || '';
     
    }
  }
  
}

