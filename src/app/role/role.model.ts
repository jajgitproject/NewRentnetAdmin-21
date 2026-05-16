// @ts-nocheck
import { formatDate } from '@angular/common';
export class Role {
   roleID: number;
   role: string;
   roleFor: string;
   remark: string;
   canCreateReservation: boolean;
   activationStatus: boolean;
   isThisAKeyAccountManagerRole: boolean;
   canThisRoleCreateBackDateBooking: boolean;
 

  constructor(role) {
    {
       this.roleID = role.roleID || -1;
       this.role = role.role || '';
       this.roleFor = role.roleFor || '';
       this.remark = role.remark  || '';
       this.activationStatus = role.activationStatus || '';
       this.canCreateReservation = role.canCreateReservation || '';
       this.isThisAKeyAccountManagerRole = role.isThisAKeyAccountManagerRole || '';
       this.canThisRoleCreateBackDateBooking = role.canThisRoleCreateBackDateBooking || '';

    }
  }
  
}

