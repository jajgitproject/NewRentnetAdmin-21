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
   canThisRoleCreateBillOnClosingScreen: boolean;
   canThisRoleViewBillOnClosingScreen: boolean;
   canThisRoleDoGoodForBillingOnClosingScreen: boolean;

  constructor(role) {
    {
       this.roleID = role.roleID ?? role.id ?? -1;
       this.role = role.role || '';
       this.roleFor = role.roleFor || '';
       this.remark = role.remark  || '';
       // Booleans: default Yes (true) when null/undefined; preserve explicit false from API
       this.activationStatus = role.activationStatus ?? true;
       this.canCreateReservation = role.canCreateReservation ?? true;
       this.isThisAKeyAccountManagerRole = role.isThisAKeyAccountManagerRole ?? true;
       this.canThisRoleCreateBackDateBooking = role.canThisRoleCreateBackDateBooking ?? true;
       this.canThisRoleCreateBillOnClosingScreen = role.canThisRoleCreateBillOnClosingScreen ?? true;
       this.canThisRoleViewBillOnClosingScreen = role.canThisRoleViewBillOnClosingScreen ?? true;
       this.canThisRoleDoGoodForBillingOnClosingScreen = role.canThisRoleDoGoodForBillingOnClosingScreen ?? true;

    }
  }
  
}

