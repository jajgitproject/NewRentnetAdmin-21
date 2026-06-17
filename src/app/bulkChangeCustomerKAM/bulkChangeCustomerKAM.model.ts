// @ts-nocheck
export class BulkChangeCustomerKAM {
  customerKeyAccountManagerID: number;
  customerID: number;
  customerName: string;
  employeeID: number;
  employeeName: string;
  cityID: number;
  city: string;
  serviceDescription: string;
  attachmentStatus: string;
  fromDate: Date;
  endDate: Date;
  activationStatus: boolean;
  isDefaultKeyAccountManager: boolean;
  checked?: boolean;

  constructor(item) {
    this.customerKeyAccountManagerID = item?.customerKeyAccountManagerID || -1;
    this.customerID = item?.customerID || 0;
    this.customerName = item?.customerName || '';
    this.employeeID = item?.employeeID || 0;
    this.employeeName = item?.employeeName || '';
    this.cityID = item?.cityID || 0;
    this.city = item?.city || '';
    this.serviceDescription = item?.serviceDescription || '';
    this.attachmentStatus = item?.attachmentStatus || '';
    this.activationStatus = item?.activationStatus ?? true;
    this.isDefaultKeyAccountManager = item?.isDefaultKeyAccountManager ?? false;
  }
}

export class BulkChangeCustomerKAMRequest {
  newEmployeeID: number;
  userID: number;
  customerKeyAccountManagerIDs: number[];
}
