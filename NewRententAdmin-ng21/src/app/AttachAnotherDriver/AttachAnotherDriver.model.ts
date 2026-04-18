// @ts-nocheck
import { formatDate } from '@angular/common';
export class AttachAnotherDriver {
   AttachAnotherDriverID: number;
   AttachAnotherDriver: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(AttachAnotherDriver) {
    {
       this.AttachAnotherDriverID = AttachAnotherDriver.AttachAnotherDriverID || -1;
       this.AttachAnotherDriver = AttachAnotherDriver.AttachAnotherDriver || '';
       this.activationStatus = AttachAnotherDriver.activationStatus || '';
       this.updatedBy=AttachAnotherDriver.updatedBy || 10;
       this.updateDateTime = AttachAnotherDriver.updateDateTime;
    }
  }
  
}

