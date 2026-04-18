// @ts-nocheck
import { formatDate } from '@angular/common';
export class DesignationDropDown {
 
   designationID: number;
   designation: string;

  constructor(designationDropDown) {
    {
       this.designationID = designationDropDown.designationID || -1;
       this.designation = designationDropDown.designation || '';
    }
  }
  
}

