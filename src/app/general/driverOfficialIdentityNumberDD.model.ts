// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverOfficialIdentityNumberDD {
   driverID: number;
   driverOfficialIdentityNumber: string;

  constructor(driverOfficialIdentityNumberDD) {
    {
       this.driverID = driverOfficialIdentityNumberDD.driverID || '';
       this.driverOfficialIdentityNumber = driverOfficialIdentityNumberDD.driverOfficialIdentityNumber || '';
    }
  }
  
}

