// @ts-nocheck
import { formatDate } from '@angular/common';
export class AdditionalService {
   additionalServiceID: number;
   additionalService: string;
   serviceTypeID: number;
   serviceType: string;
   uomid: number;
   uom: string;
   activationStatus: boolean;
   userID:number;
  

  constructor(additionalService) {
    {
       this.additionalServiceID = additionalService.additionalServiceID || -1;
       this.additionalService = additionalService.additionalService || '';
       this.serviceTypeID = additionalService.ServiceTypeID  || '';
       this.serviceType = additionalService.ServiceType  || '';
       this.uomid = additionalService.uomid  || '';
       this.uom = additionalService.uom || '';
       this.activationStatus = additionalService.activationStatus || '';
    }
  }
  
}

