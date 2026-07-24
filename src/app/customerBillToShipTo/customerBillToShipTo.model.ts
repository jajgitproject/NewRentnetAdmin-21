// @ts-nocheck
export class CustomerBillToShipTo {
  customerConfigurationBillToShipToID: number;
  customerID: number;
  userID: number;
  address1: string;
  address2: string;
  stateID: number;
  stateName: string;
  cityID: number;
  cityName: string;
  pincode: string;
  gstno: string;
  gSTNO: string;
  startDate: Date | string;
  endDate: Date | string;
  activationStatus: boolean;

  constructor(data?: any) {
    data = data || {};
    this.customerConfigurationBillToShipToID = data.customerConfigurationBillToShipToID || -1;
    this.customerID = data.customerID || 0;
    this.userID = data.userID || 0;
    this.address1 = data.address1 || '';
    this.address2 = data.address2 || '';
    this.stateID = data.stateID || 0;
    this.stateName = data.stateName || '';
    this.cityID = data.cityID || 0;
    this.cityName = data.cityName || '';
    this.pincode = data.pincode || '';
    this.gstno = data.gstno || data.gSTNO || '';
    this.gSTNO = this.gstno;
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.activationStatus =
      data.activationStatus === undefined || data.activationStatus === null
        ? true
        : data.activationStatus;
  }
}
