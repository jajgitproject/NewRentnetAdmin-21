// @ts-nocheck
import { formatDate } from '@angular/common';
export class RoleDropDown {
   roleID: number;
   role: string;
   roleFor: string;

  constructor(roleDropDown) {
    {
       this.roleID = roleDropDown.roleID || -1;
       this.role = roleDropDown.role || '';
       this.roleFor = roleDropDown.roleFor || '';
    }
  }
  
}

