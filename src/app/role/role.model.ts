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
   canThisRoleViewDummyInvoice: boolean;
   canActAsContractTariffAuditor: boolean;
   canActAsContractTariffVerifier: boolean;
   canResetOdometer: boolean;
   canDeleteFuelEntry: boolean;
   canFindFuelEntry: boolean;

  constructor(role) {
    {
       this.roleID = role.roleID ?? role.id ?? -1;
       this.role = role.role || '';
       this.roleFor = role.roleFor || '';
       this.remark = role.remark  || '';
       // Booleans: default Yes (true) when null/undefined; preserve explicit false from API
       this.activationStatus = role.activationStatus ?? true;
       this.canCreateReservation = role.canCreateReservation ?? '';
       this.isThisAKeyAccountManagerRole = role.isThisAKeyAccountManagerRole ?? '';
       this.canThisRoleCreateBackDateBooking = role.canThisRoleCreateBackDateBooking ?? '';
       this.canThisRoleCreateBillOnClosingScreen = role.canThisRoleCreateBillOnClosingScreen ?? '';
       this.canThisRoleViewBillOnClosingScreen = role.canThisRoleViewBillOnClosingScreen ?? '';
       this.canThisRoleDoGoodForBillingOnClosingScreen = role.canThisRoleDoGoodForBillingOnClosingScreen ?? '';
       this.canThisRoleViewDummyInvoice = role.canThisRoleViewDummyInvoice ?? '';
       this.canActAsContractTariffAuditor = role.canActAsContractTariffAuditor ?? role.CanActAsContractTariffAuditor ?? '';
       this.canActAsContractTariffVerifier = role.canActAsContractTariffVerifier ?? role.CanActAsContractTariffVerifier ?? '';
       this.canResetOdometer = role.canResetOdometer ?? role.CanResetOdometer ?? '';
       this.canDeleteFuelEntry = role.canDeleteFuelEntry ?? role.CanDeleteFuelEntry ?? '';
       this.canFindFuelEntry = role.canFindFuelEntry ?? role.CanFindFuelEntry ?? '';

    }
  }
  
}

