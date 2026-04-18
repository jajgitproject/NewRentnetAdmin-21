// @ts-nocheck
import { formatDate } from '@angular/common';
export class ParentMenuDropDown {
   pageID: number;
   page: string;

  constructor(parentMenuDropDown) {
    {
       this.pageID = parentMenuDropDown.pageID || -1;
       this.page = parentMenuDropDown.page || '';
    }
  }
  
}

