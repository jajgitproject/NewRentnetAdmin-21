// @ts-nocheck
export class BulkChangeCustomerBillingExecutive {
  customerBillingExecutiveID: number;
  customerID: number;
  customerName: string;
  employeeID: number;
  employeeName: string;
  fromDate: Date;
  toDate: Date;
  activationStatus: boolean;
  checked?: boolean;

  constructor(item) {
    this.customerBillingExecutiveID = item?.customerBillingExecutiveID || -1;
    this.customerID = item?.customerID || 0;
    this.customerName = item?.customerName || '';
    this.employeeID = item?.employeeID || 0;
    this.employeeName = item?.employeeName || '';
    this.activationStatus = item?.activationStatus ?? true;
  }
}

export class BulkChangeCustomerBillingExecutiveRequest {
  newEmployeeID: number;
  userID: number;
  customerBillingExecutiveIDs: number[];
}
