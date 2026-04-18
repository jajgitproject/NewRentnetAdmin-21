// @ts-nocheck
import { formatDate } from '@angular/common';
export class Qualification {
   qualificationID: number;
   qualification: string;
   activationStatus:boolean;
  constructor(qualification) {
    {
       this.qualificationID = qualification.qualificationID || -1;
       this.qualification = qualification.qualification || '';
       this.activationStatus = qualification.activationStatus || '';
    }
  }
  
}

