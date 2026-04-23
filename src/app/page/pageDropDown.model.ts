// @ts-nocheck
import { formatDate } from '@angular/common';
export class PageDropDown {
   pageID: number;
   page: string;

  constructor(pageDropDown) {
    {
       this.pageID = pageDropDown.pageID || -1;
       this.page = pageDropDown.page || '';
    }
  }
  
}

