// @ts-nocheck
import { formatDate } from '@angular/common';
export class RoleDropDown {
   roleID: number;
   role: string;
   roleFor: string;
   Page: string;

  constructor(roleDropDown) {
    {
       this.roleID = roleDropDown.roleID || -1;
       this.role = roleDropDown.role || '';
       this.roleFor = roleDropDown.roleFor || '';
       this.Page=roleDropDown.Page || '';
    }
  }
  
}

