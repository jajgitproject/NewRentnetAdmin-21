// @ts-nocheck
import { formatDate } from '@angular/common';
export class OrganizationalEntityDropDown {
 
   organizationalEntityID: number;
   organizationalEntityName: string;

  constructor(organizationalEntityDropDown) {
    {
       this.organizationalEntityID = organizationalEntityDropDown.organizationalEntityID || -1;
       this.organizationalEntityName = organizationalEntityDropDown.organizationalEntityName || '';
    }
  }
  
}

