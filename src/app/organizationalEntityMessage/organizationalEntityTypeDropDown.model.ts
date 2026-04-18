// @ts-nocheck
import { formatDate } from '@angular/common';
export class OrganizationalEntityTypeDropDown {
 
    organizationalEntityID: number;
    organizationalEntityType: string;

  constructor(organizationalEntityTypeDropDown) {
    {
       this.organizationalEntityID = organizationalEntityTypeDropDown.organizationalEntityID || -1;
       this.organizationalEntityType = organizationalEntityTypeDropDown.organizationalEntityType || '';
    }
  }
  
}

