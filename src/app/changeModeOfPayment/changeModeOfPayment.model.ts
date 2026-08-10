// @ts-nocheck
export class ChangeModeOfPaymentDutyModel {
  reservationID: number;
  reservationGroupID: number;
  dutySlipID: number;
  customerTypeID: number;
  customerType: string;
  customerID: number;
  customerName: string;
  customerGroupID: number;
  customerGroup: string;
  packageTypeID: number;
  packageType: string;
  packageID: number;
  package: string;
  vehicleCategoryID: number;
  vehicleCategory: string;
  vehicleID: number;
  vehicle: string;
  pickupCityID: number;
  pickupCity: string;
  pickupDate: Date | null;
  pickupDateString: string;
  pickupTime: Date | null;
  pickupTimeString: string;
  primaryBookerID: number;
  primaryBooker: string;
  primaryPassengerID: number;
  primaryPassenger: string;
  pickupAddress: string;
  pickupAddressDetails: string;
  modeOfPaymentID: number;
  modeOfPayment: string;
  customerContractID: number;
  userID: number;
  checked: boolean;

  constructor(model) {
    {
      this.reservationID = model.reservationID || -1;
      this.dutySlipID = model.dutySlipID || '';
      this.customerID = model.customerID || '';
      this.customerName = model.customerName || '';
      this.customerGroupID = model.customerGroupID || '';
      this.customerGroup = model.customerGroup || '';
      this.packageTypeID = model.packageTypeID || '';
      this.packageType = model.packageType || '';
      this.packageID = model.packageID || '';
      this.package = model.package || '';
      this.pickupCityID = model.pickupCityID || '';
      this.pickupCity = model.pickupCity || '';
      this.vehicleCategoryID = model.vehicleCategoryID || '';
      this.vehicleCategory = model.vehicleCategory || '';
      this.vehicleID = model.vehicleID || '';
      this.vehicle = model.vehicle || '';
      this.primaryPassengerID = model.primaryPassengerID || '';
      this.primaryPassenger = model.primaryPassenger || '';
      this.primaryBookerID = model.primaryBookerID || '';
      this.primaryBooker = model.primaryBooker || '';
      this.pickupAddress = model.pickupAddress || '';
      this.modeOfPaymentID = model.modeOfPaymentID || '';
      this.modeOfPayment = model.modeOfPayment || '';
    }
  }
}

export class ChangeModeOfPaymentModel {
  reservationChangeLogID: number;
  reservationID: number[] = [];
  changeDate: Date;
  changeTime: Date;
  changeEmployeeID: number;
  changeEmployeeName: string;
  changeType: string;
  previousRecordID: number;
  previousRecordName: string;
  newRecordID: number;
  newRecordName: string;
  reason: string;
  userID: number;

  constructor(model) {
    {
      this.reservationChangeLogID = model.reservationChangeLogID || -1;
      this.reservationID = model.reservationID || [];
      this.changeEmployeeID = model.changeEmployeeID || '';
      this.changeEmployeeName = model.changeEmployeeName || '';
      this.changeType = model.changeType || '';
      this.previousRecordID = model.previousRecordID || '';
      this.previousRecordName = model.previousRecordName || '';
      this.newRecordID = model.newRecordID || '';
      this.newRecordName = model.newRecordName || '';
      this.reason = model.reason || '';
      this.changeDate = model.changeDate || null;
      this.changeTime = model.changeTime || null;
    }
  }
}
