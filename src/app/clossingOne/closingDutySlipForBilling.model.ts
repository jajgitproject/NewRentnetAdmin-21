// @ts-nocheck
export class ClosingDutySlipForBillingModel {
  dutySlipForBillingID: number;
  dutySlipID: number;

  locationOutLocationOrHubID: number;
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
    this.dutySlipForBillingID = closingDutySlipForBillingModel.dutySlipForBillingID || '';
    this.dutySlipID = closingDutySlipForBillingModel.dutySlipID || '';

    this.locationOutLocationOrHubID = closingDutySlipForBillingModel.locationOutLocationOrHubID || '';
    this.locationOutDateForBilling = closingDutySlipForBillingModel.locationOutDateForBilling  || '';
    this.locationOutTimeForBilling = closingDutySlipForBillingModel.locationOutTimeForBilling  || '';
    this.locationOutKMForBilling = closingDutySlipForBillingModel.locationOutKMForBilling || '';
    this.locationOutLatLongForBilling = closingDutySlipForBillingModel.locationOutLatLongForBilling || '';
    this.locationOutAddressStringForBilling = closingDutySlipForBillingModel.locationOutAddressStringForBilling || '';

    this.reportingToGuestDateForBilling = closingDutySlipForBillingModel.reportingToGuestDateForBilling  || '';
    this.reportingToGuestTimeForBilling = closingDutySlipForBillingModel.reportingToGuestTimeForBilling  || '';
    this.reportingToGuestKMForBilling = closingDutySlipForBillingModel.reportingToGuestKMForBilling || '';
    this.reportingToGuestLatLongForBilling = closingDutySlipForBillingModel.reportingToGuestLatLongForBilling || '';
    this.reportingToGuestAddressStringForBilling = closingDutySlipForBillingModel.reportingToGuestAddressStringForBilling || '';

    this.pickUpDateForBilling = closingDutySlipForBillingModel.pickUpDateForBilling  || '';
    this.pickUpTimeForBilling = closingDutySlipForBillingModel.pickUpTimeForBilling  || '';
    this.pickUpKMForBilling = closingDutySlipForBillingModel.pickUpKMForBilling || '';
    this.pickUpLatLongForBilling = closingDutySlipForBillingModel.pickUpLatLongForBilling || '';
    this.pickUpAddressStringForBilling = closingDutySlipForBillingModel.pickUpAddressStringForBilling || '';

    this.dropOffDateForBilling = closingDutySlipForBillingModel.dropOffDateForBilling || '';
    this.dropOffTimeForBilling = closingDutySlipForBillingModel.dropOffTimeForBilling || '';
    this.dropOffKMForBilling = closingDutySlipForBillingModel.dropOffKMForBilling || '';
    this.dropOffLatLongForBilling = closingDutySlipForBillingModel.dropOffLatLongForBilling || '';
    this.dropOffAddressStringForBilling = closingDutySlipForBillingModel.dropOffAddressStringForBilling || '';

    this.locationInDateForBilling = closingDutySlipForBillingModel.locationInDateForBilling || '';
    this.locationInTimeForBilling = closingDutySlipForBillingModel.locationInTimeForBilling || '';
    this.locationInKMForBilling = closingDutySlipForBillingModel.locationInKMForBilling || '';
    this.locationInLatLongForBilling = closingDutySlipForBillingModel.locationInLatLongForBilling || '';
    this.locationInAddressStringForBilling = closingDutySlipForBillingModel.locationInAddressStringForBilling || '';
    this.locationInLocationOrHubID = closingDutySlipForBillingModel.locationInLocationOrHubID || '';

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
    this.dutySlipForBillingCreatedOn = closingDutySlipForBillingModel.dutySlipForBillingCreatedOn || '';

    this.goodForBilling = closingDutySlipForBillingModel.goodForBilling || '';
    this.verifyDuty = closingDutySlipForBillingModel.verifyDuty || '';
    this.dsClosing = closingDutySlipForBillingModel.dsClosing || '';
    this.runningDetails = closingDutySlipForBillingModel.runningDetails || '';
    this.vendorRemark = closingDutySlipForBillingModel.vendorRemark || '';
  }
}

