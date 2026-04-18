// @ts-nocheck
import { formatDate } from '@angular/common';
export class IssueCategoryDropDown {
   issueCategoryID: number;
   issueCategory: string;

  constructor(issueCategoryDropDown) {
    {
       this.issueCategoryID = issueCategoryDropDown.issueCategoryID || -1;
       this.issueCategory = issueCategoryDropDown.issueCategory || '';
    }
  }
  
}

