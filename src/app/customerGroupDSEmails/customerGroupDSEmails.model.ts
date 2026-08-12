// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerGroupDSEmails {
  customerGroupDSEmailsID: number;
  customerGroupID: number;
  emailID: string;
  activationStatus: boolean;
  userID: number;
  constructor(customerGroupDSEmails) {
    {
      this.customerGroupDSEmailsID = customerGroupDSEmails.customerGroupDSEmailsID || -1;
      this.customerGroupID = customerGroupDSEmails.customerGroupID || '';
      this.emailID = customerGroupDSEmails.emailID || '';
      this.activationStatus = customerGroupDSEmails.activationStatus || '';
    }
  }
}
