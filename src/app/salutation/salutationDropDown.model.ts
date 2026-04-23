// @ts-nocheck
import { formatDate } from '@angular/common';
export class SalutationDropDown {
   salutationID: number;
   salutation: string;

  constructor(salutationDropDown) {
    {
       this.salutationID = salutationDropDown.salutationID || -1;
       this.salutation = salutationDropDown.salutation || '';
    }
  }
  
}

