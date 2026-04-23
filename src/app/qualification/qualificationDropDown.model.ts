// @ts-nocheck
import { formatDate } from '@angular/common';
export class QualificationDropDown {
 
   qualificationID: number;
   qualification: string;

  constructor(qualificationDropDown) {
    {
       this.qualificationID = qualificationDropDown.qualificationID || -1;
       this.qualification = qualificationDropDown.qualification || '';
    }
  }
  
}

