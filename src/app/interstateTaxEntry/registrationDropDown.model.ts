// @ts-nocheck
import { formatDate } from '@angular/common';
export class RegistrationDropDown {
  inventoryID: number;
  registrationNumber: string;

  constructor(registrationDropDown) {
    {
       this.inventoryID = registrationDropDown.inventoryID || '';
       this.registrationNumber = registrationDropDown.registrationNumber || '';
    }
  }
  
}

