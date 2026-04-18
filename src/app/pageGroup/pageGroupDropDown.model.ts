// @ts-nocheck
import { formatDate } from '@angular/common';
export class PageGroupDropDown {
   pageGroupID: number;
   pageGroup: string;

  constructor(pageGroupDropDown) {
    {
       this.pageGroupID = pageGroupDropDown.pageGroupID || '';
       this.pageGroup = pageGroupDropDown.pageGroup || '';
    }
  }
  
}

