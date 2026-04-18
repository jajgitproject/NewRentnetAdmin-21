// @ts-nocheck
import { formatDate } from '@angular/common';
export class Salutation {
   salutationID: number;
   salutation: string;
   activationStatus: boolean;
  

  constructor(salutation) {
    {
       this.salutationID = salutation.salutationID || -1;
       this.salutation = salutation.salutation || '';
       this.activationStatus = salutation.activationStatus || '';
       
    }
  }
  
}

