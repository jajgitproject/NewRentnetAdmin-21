// @ts-nocheck
export class ChangeBillingExecutiveForCustomers {
  customerBillingExecutiveID: number;
  oldBillingExecutiveID: number;
  newBillingExecutiveID: number;
  newBillingExecutiveActivationFromDate: Date;
  newBillingExecutiveActivationToDate: Date;
  newBillingExecutiveActivationToDateString: string;
  newBillingExecutiveActivationFromDateString: string;
  newBillingExecutiveActivationStatus: Boolean;
  oldCustomerBillingExecutiveEmployee: string;
  newCustomerBillingExecutiveEmployee: string;
  employeeID: number;
  userID: number;

  constructor(changeBillingExecutiveForCustomers) {
    this.customerBillingExecutiveID = changeBillingExecutiveForCustomers.customerBillingExecutiveID || -1;
    this.oldBillingExecutiveID = changeBillingExecutiveForCustomers.oldBillingExecutiveID ?? 0;
    this.newBillingExecutiveID = changeBillingExecutiveForCustomers.newBillingExecutiveID ?? 0;
    this.newBillingExecutiveActivationFromDateString = changeBillingExecutiveForCustomers.newBillingExecutiveActivationFromDateString || '';
    this.newBillingExecutiveActivationToDateString = changeBillingExecutiveForCustomers.newBillingExecutiveActivationToDateString || '';
    this.newBillingExecutiveActivationStatus = changeBillingExecutiveForCustomers.newBillingExecutiveActivationStatus || '';
    this.newBillingExecutiveActivationFromDate = new Date();
  }
}
