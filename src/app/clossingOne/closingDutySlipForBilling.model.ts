// @ts-nocheck
export class ClosingDutySlipForBillingModel {
  dutySlipForBillingID: number;
  dutySlipID: number;

  locationOutLocationOrHubID: number | null;
  locationOutDateForBilling: Date;
  locationOutTimeForBilling: Date;
  locationOutKMForBilling: number;
  locationOutLatLongForBilling: string;
  locationOutAddressStringForBilling: string;

  locationOutDateForBillingString: string;
  locationOutTimeForBillingString: string;

  reportingToGuestDateForBilling: Date;
  reportingToGuestTimeForBilling: Date;
  reportingToGuestKMForBilling: number;
  reportingToGuestLatLongForBilling: string;
  reportingToGuestAddressStringForBilling: string;

  reportingToGuestDateForBillingString: string;
  reportingToGuestTimeForBillingString: string;

  pickUpDateForBilling: Date;
  pickUpTimeForBilling: Date;
  pickUpKMForBilling: number;
  pickUpLatLongForBilling: string;
  pickUpAddressStringForBilling: string;

  pickUpDateForBillingString: string;
  pickUpTimeForBillingString: string;

  dropOffDateForBilling: Date;
  dropOffTimeForBilling: Date;
  dropOffKMForBilling: number;
  dropOffLatLongForBilling: string;
  dropOffAddressStringForBilling: string;

  dropOffDateForBillingString: string;
  dropOffTimeForBillingString: string;

  locationInDateForBilling: Date;
  locationInTimeForBilling: Date;
  locationInKMForBilling: number;
  locationInLatLongForBilling: string;
  locationInAddressStringForBilling: string;
  locationInLocationOrHubID: number;

  locationInDateForBillingString: string;
  locationInTimeForBillingString: string;

  userID : number;

  disputeKMs: number;
  disputeMinutes: number;
  disputeApprovedByID: number;
  additionalKMs: number;
  additionalMinutes: number;
  driverConveyanceKMsFrom: number;
  driverConveyanceKMsTo: number;
  dutyTypeID: number;
  packageID: number;
  disputeTypeID: number;
  dutySlipForBillingCreatedByID: number;

  disputeReason: string;
  discountApplicableOn: string;
  closureType: string;
  dutyType: string;
  package: string;
  disputeType: string;

  totalCustomerAdvance: number;
  discountPercentage: number;
  discountApplicableAmount: number;
  discountAmount: number;

  physicalDutySlipReceived: boolean;
  dutySlipForBillingCreatedOn: Date;

  goodForBilling: boolean;
  verifyDuty: boolean;
  dsClosing: string;
  runningDetails: string;
  vendorRemark: string;

  constructor(closingDutySlipForBillingModel) {
    this.dutySlipForBillingID = ClosingDutySlipForBillingModel.toIntOrZero(closingDutySlipForBillingModel.dutySlipForBillingID);
    this.dutySlipID = ClosingDutySlipForBillingModel.toIntOrZero(closingDutySlipForBillingModel.dutySlipID);

    this.locationOutLocationOrHubID = ClosingDutySlipForBillingModel.toIntOrNull(
      closingDutySlipForBillingModel.locationOutLocationOrHubID ?? closingDutySlipForBillingModel.LocationOutLocationOrHubID
    );
    this.locationOutDateForBilling = ClosingDutySlipForBillingModel.toNullableDate(
      closingDutySlipForBillingModel.locationOutDateForBilling
    );
    this.locationOutTimeForBilling = ClosingDutySlipForBillingModel.toNullableDate(
      closingDutySlipForBillingModel.locationOutTimeForBilling
    );
    this.locationOutKMForBilling = closingDutySlipForBillingModel.locationOutKMForBilling || '';
    this.locationOutLatLongForBilling = closingDutySlipForBillingModel.locationOutLatLongForBilling || '';
    this.locationOutAddressStringForBilling = closingDutySlipForBillingModel.locationOutAddressStringForBilling || '';

    this.reportingToGuestDateForBilling = ClosingDutySlipForBillingModel.toNullableDate(
      closingDutySlipForBillingModel.reportingToGuestDateForBilling
    );
    this.reportingToGuestTimeForBilling = ClosingDutySlipForBillingModel.toNullableDate(
      closingDutySlipForBillingModel.reportingToGuestTimeForBilling
    );
    this.reportingToGuestKMForBilling = closingDutySlipForBillingModel.reportingToGuestKMForBilling || '';
    this.reportingToGuestLatLongForBilling = closingDutySlipForBillingModel.reportingToGuestLatLongForBilling || '';
    this.reportingToGuestAddressStringForBilling = closingDutySlipForBillingModel.reportingToGuestAddressStringForBilling || '';

    this.pickUpDateForBilling = ClosingDutySlipForBillingModel.toNullableDate(
      closingDutySlipForBillingModel.pickUpDateForBilling
    );
    this.pickUpTimeForBilling = ClosingDutySlipForBillingModel.toNullableDate(
      closingDutySlipForBillingModel.pickUpTimeForBilling
    );
    this.pickUpKMForBilling = closingDutySlipForBillingModel.pickUpKMForBilling || '';
    this.pickUpLatLongForBilling = closingDutySlipForBillingModel.pickUpLatLongForBilling || '';
    this.pickUpAddressStringForBilling = closingDutySlipForBillingModel.pickUpAddressStringForBilling || '';

    this.dropOffDateForBilling = ClosingDutySlipForBillingModel.toNullableDate(
      closingDutySlipForBillingModel.dropOffDateForBilling
    );
    this.dropOffTimeForBilling = ClosingDutySlipForBillingModel.toNullableDate(
      closingDutySlipForBillingModel.dropOffTimeForBilling
    );
    this.dropOffKMForBilling = closingDutySlipForBillingModel.dropOffKMForBilling || '';
    this.dropOffLatLongForBilling = closingDutySlipForBillingModel.dropOffLatLongForBilling || '';
    this.dropOffAddressStringForBilling = closingDutySlipForBillingModel.dropOffAddressStringForBilling || '';

    this.locationInDateForBilling = ClosingDutySlipForBillingModel.toNullableDate(
      closingDutySlipForBillingModel.locationInDateForBilling
    );
    this.locationInTimeForBilling = ClosingDutySlipForBillingModel.toNullableDate(
      closingDutySlipForBillingModel.locationInTimeForBilling
    );
    this.locationInKMForBilling = closingDutySlipForBillingModel.locationInKMForBilling || '';
    this.locationInLatLongForBilling = closingDutySlipForBillingModel.locationInLatLongForBilling || '';
    this.locationInAddressStringForBilling = closingDutySlipForBillingModel.locationInAddressStringForBilling || '';
    this.locationInLocationOrHubID = ClosingDutySlipForBillingModel.toIntOrZero(
      closingDutySlipForBillingModel.locationInLocationOrHubID ?? closingDutySlipForBillingModel.LocationInLocationOrHubID
    );

    this.disputeKMs = closingDutySlipForBillingModel.disputeKMs || '';
    this.disputeMinutes = closingDutySlipForBillingModel.disputeMinutes || '';
    this.disputeApprovedByID = closingDutySlipForBillingModel.disputeApprovedByID || '';
    this.additionalKMs = closingDutySlipForBillingModel.additionalKMs || '';
    this.additionalMinutes = closingDutySlipForBillingModel.additionalMinutes || '';
    this.driverConveyanceKMsFrom = closingDutySlipForBillingModel.driverConveyanceKMsFrom || '';
    this.driverConveyanceKMsTo = closingDutySlipForBillingModel.driverConveyanceKMsTo || '';
    this.dutyTypeID = closingDutySlipForBillingModel.dutyTypeID || '';
    this.packageID = closingDutySlipForBillingModel.packageID || '';
    this.disputeTypeID = closingDutySlipForBillingModel.disputeTypeID || '';
    this.dutySlipForBillingCreatedByID = closingDutySlipForBillingModel.dutySlipForBillingCreatedByID || '';
    this.disputeReason = closingDutySlipForBillingModel.disputeReason || '';
    this.discountApplicableOn = closingDutySlipForBillingModel.discountApplicableOn || '';
    this.closureType = closingDutySlipForBillingModel.closureType || '';
    this.dutyType = closingDutySlipForBillingModel.dutyType || '';
    this.package = closingDutySlipForBillingModel.package || '';
    this.disputeType = closingDutySlipForBillingModel.disputeType || '';

    this.totalCustomerAdvance = closingDutySlipForBillingModel.totalCustomerAdvance || '';
    this.discountPercentage = closingDutySlipForBillingModel.discountPercentage || '';
    this.discountApplicableAmount = closingDutySlipForBillingModel.discountApplicableAmount || '';
    this.discountAmount = closingDutySlipForBillingModel.discountAmount || '';

    this.physicalDutySlipReceived = closingDutySlipForBillingModel.physicalDutySlipReceived || '';
    this.dutySlipForBillingCreatedOn = ClosingDutySlipForBillingModel.toNullableDate(
      closingDutySlipForBillingModel.dutySlipForBillingCreatedOn
    );

    this.goodForBilling = ClosingDutySlipForBillingModel.toBool(
      closingDutySlipForBillingModel.goodForBilling ?? closingDutySlipForBillingModel.GoodForBilling
    );
    this.verifyDuty = ClosingDutySlipForBillingModel.toBool(
      closingDutySlipForBillingModel.verifyDuty ?? closingDutySlipForBillingModel.VerifyDuty
    );
    this.dsClosing = (closingDutySlipForBillingModel.dsClosing ?? closingDutySlipForBillingModel.DSClosing) || '';
    this.runningDetails = closingDutySlipForBillingModel.runningDetails || '';
    this.vendorRemark = closingDutySlipForBillingModel.vendorRemark || '';
  }

  /** Coerce API bool / "True" / 1 into a real boolean (false stays false; do not use || ''). */
  static toBool(value: any): boolean {
    return value === true || value === 1 || value === '1'
      || value === 'true' || value === 'True' || value === 'TRUE';
  }

  /** Prefer null over '' so JSON binds to int? on the API. */
  static toIntOrNull(value: any): number | null {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  static toIntOrZero(value: any): number {
    return ClosingDutySlipForBillingModel.toIntOrNull(value) ?? 0;
  }

  /** Prefer null over '' so JSON binds to DateTime? on the API. */
  static toNullableDate(value: any): Date | null {
    if (value === '' || value === null || value === undefined) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}

