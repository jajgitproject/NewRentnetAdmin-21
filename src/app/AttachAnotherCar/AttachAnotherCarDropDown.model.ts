// @ts-nocheck
import { formatDate } from '@angular/common';
export class AttachAnotherCarDropDown {
   AttachAnotherCarID: number;
   AttachAnotherCar: string;

  constructor(AttachAnotherCarDropDown) {
    {
       this.AttachAnotherCarID = AttachAnotherCarDropDown.AttachAnotherCarID || -1;
       this.AttachAnotherCar = AttachAnotherCarDropDown.AttachAnotherCar || '';
    }
  }
  
}

