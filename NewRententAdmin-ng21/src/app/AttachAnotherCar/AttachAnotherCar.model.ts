// @ts-nocheck
import { formatDate } from '@angular/common';
export class AttachAnotherCar {
   AttachAnotherCarID: number;
   AttachAnotherCar: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(AttachAnotherCar) {
    {
       this.AttachAnotherCarID = AttachAnotherCar.AttachAnotherCarID || -1;
       this.AttachAnotherCar = AttachAnotherCar.AttachAnotherCar || '';
       this.activationStatus = AttachAnotherCar.activationStatus || '';
       this.updatedBy=AttachAnotherCar.updatedBy || 10;
       this.updateDateTime = AttachAnotherCar.updateDateTime;
    }
  }
  
}

