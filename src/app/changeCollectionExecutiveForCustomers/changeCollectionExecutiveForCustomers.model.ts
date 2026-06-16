// @ts-nocheck
export class ChangeCollectionExecutiveForCustomers {
  customerCollectionExecutiveID: number;
  oldCollectionExecutiveID: number;
  newCollectionExecutiveID: number;
  newCollectionExecutiveActivationFromDate: Date;
  newCollectionExecutiveActivationToDate: Date;
  newCollectionExecutiveActivationToDateString: string;
  newCollectionExecutiveActivationFromDateString: string;
  newCollectionExecutiveActivationStatus: Boolean;
  oldCustomerCollectionExecutiveEmployee: string;
  newCustomerCollectionExecutiveEmployee: string;
  employeeID: number;
  userID: number;

  constructor(changeCollectionExecutiveForCustomers) {
    this.customerCollectionExecutiveID = changeCollectionExecutiveForCustomers.customerCollectionExecutiveID || -1;
    this.oldCollectionExecutiveID = changeCollectionExecutiveForCustomers.oldCollectionExecutiveID ?? 0;
    this.newCollectionExecutiveID = changeCollectionExecutiveForCustomers.newCollectionExecutiveID ?? 0;
    this.newCollectionExecutiveActivationFromDateString = changeCollectionExecutiveForCustomers.newCollectionExecutiveActivationFromDateString || '';
    this.newCollectionExecutiveActivationToDateString = changeCollectionExecutiveForCustomers.newCollectionExecutiveActivationToDateString || '';
    this.newCollectionExecutiveActivationStatus = changeCollectionExecutiveForCustomers.newCollectionExecutiveActivationStatus || '';
    this.newCollectionExecutiveActivationFromDate = new Date();
  }
}
