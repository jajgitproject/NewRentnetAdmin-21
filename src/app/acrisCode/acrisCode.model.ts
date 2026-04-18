// @ts-nocheck
import { formatDate } from '@angular/common';
export class AcrisCode {
  acrisCodeDetailsID: number;
   acrisCode: string;
   acrisCodeType:string;
   acrisCodeValue:string;
   activationStatus: boolean;
   userID:number;
  

  constructor(acrisCode) {
    {
       this.acrisCodeDetailsID= acrisCode.acrisCodeDetailsID || -1;
       this.acrisCode = acrisCode.acrisCode || '';
       this.acrisCodeType = acrisCode.acrisCodeType || '';
       this.acrisCodeValue = acrisCode.acrisCodeValue|| '';
       this.activationStatus = acrisCode.activationStatus || '';
       
    }
  }
  
}

