// @ts-nocheck
import { formatDate } from '@angular/common';
export class PageGroup {
   pageGroupID: number;
   pageGroup: string;
   userID:number;
   activationStatus: boolean;

  constructor(pageGroup) {
    {
       this.pageGroupID = pageGroup.pageGroupID || -1;
       this.pageGroup = pageGroup.pageGroup || '';
       this.activationStatus = pageGroup.activationStatus || '';
    }
  }
  
}

