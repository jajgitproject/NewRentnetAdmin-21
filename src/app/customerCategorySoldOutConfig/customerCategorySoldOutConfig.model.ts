// @ts-nocheck
export class CustomerCategorySoldOutConfigModel {
  customerCategorySoldOutConfigID: number;
  customerCategoryID: number;
  customerCategory: string;
  cityID: number;
  city: string;
  packageTypeID: number;
  packageType: string;
  vehicleID: number;
  vehicle: string;
  fromDateTime: Date | string;
  toDateTime: Date | string;
  fromDateTimeString: string;
  toDateTimeString: string;
  fromDate: Date;
  toDate: Date;
  fromTime: string;
  toTime: string;
  activationStatus: boolean;
  userID: number;

  constructor(data?: any) {
    data = data || {};
    this.customerCategorySoldOutConfigID = data.customerCategorySoldOutConfigID || -1;
    this.customerCategoryID = data.customerCategoryID || 0;
    this.customerCategory = data.customerCategory || '';
    this.cityID = data.cityID || 0;
    this.city = data.city || '';
    this.packageTypeID = data.packageTypeID || 0;
    this.packageType = data.packageType || '';
    this.vehicleID = data.vehicleID || 0;
    this.vehicle = data.vehicle || '';
    this.fromDateTime = data.fromDateTime || null;
    this.toDateTime = data.toDateTime || null;
    this.fromDateTimeString = data.fromDateTimeString || '';
    this.toDateTimeString = data.toDateTimeString || '';
    this.fromDate = data.fromDate || new Date();
    this.toDate = data.toDate || new Date();
    this.fromTime = data.fromTime || '00:00';
    this.toTime = data.toTime || '23:59';
    this.activationStatus = data.activationStatus !== undefined ? data.activationStatus : true;
    this.userID = data.userID || 0;
  }
}

export class CustomerCategorySoldOutCheckResult {
  isSoldOut: boolean;
  message: string;
}
