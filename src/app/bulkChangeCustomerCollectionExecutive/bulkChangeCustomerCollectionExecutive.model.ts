// @ts-nocheck
export class BulkChangeCustomerCollectionExecutive {
  customerCollectionExecutiveID: number;
  customerID: number;
  customerName: string;
  employeeID: number;
  employeeName: string;
  fromDate: Date;
  toDate: Date;
  activationStatus: boolean;
  checked?: boolean;

  constructor(item) {
    this.customerCollectionExecutiveID = item?.customerCollectionExecutiveID || -1;
    this.customerID = item?.customerID || 0;
    this.customerName = item?.customerName || '';
    this.employeeID = item?.employeeID || 0;
    this.employeeName = item?.employeeName || '';
    this.activationStatus = item?.activationStatus ?? true;
  }
}

export class BulkChangeCustomerCollectionExecutiveRequest {
  newEmployeeID: number;
  userID: number;
  customerCollectionExecutiveIDs: number[];
}
