// @ts-nocheck
export class ClosingDutySlipModel {
  dutySlipID: number;
  allotmentID: number;
  reservationID: number;
  driverInventoryAssociationID: number;
  inventoryID: number;
  driverID: number;
  gpsID: number;
  appID: number;
  manualDutySlipNumber: string;
  dispatchMethod: string;
  actualCarMovedFrom: string;

  locationOutEntryMethod: string;
  locationOutEntryExecutiveID: number;
  locationOutLocationOrHubID: number;
  locationOutDate: Date;
  locationOutTime: Date;
  locationOutKM: number;
  locationOutLatLong: string;
  locationOutAddressString: string;

  reportingToGuestEntryMethod: string;
  reportingToGuestEntryExecutiveID: number;
  reportingToGuestDate: Date;
  reportingToGuestTime: Date;
  reportingToGuestKM: number;
  reportingToGuestLatLong: string;
  reportingToGuestAddressString: string;

  pickupEntryMethod: string;
  pickupEntryExecutiveID: number;
  pickUpDate: Date;
  pickUpTime: Date;
  pickUpKM: number;
  pickUpLatLong: string;
  pickUpAddressString: string;

  dropOffEntryMethod: string;
  dropOffEntryExecutiveID: number;
  dropOffDate: Date;
  dropOffTime: Date;
  dropOffKM: number;
  dropOffLatLong: string;
  dropOffAddressString: string;

  locationInEntryMethod: string;
  locationInEntryExecutiveID: number;
  locationInLocationOrHubID: number;
  locationInDate: Date;
  locationInTime: Date;
  locationInKM: number;
  locationInLatLong: string;
  locationInAddressString: string;

  nextDayInstruction: string;
  nextDayInstructionDate: Date;
  nextDayInstructionTime: Date;
  dutyCompletionType: string;
  closureStatus: string;
  closureMethod: string;
  closureEntryExecutiveID: number;
  isClosureVerified: boolean;
  closureVerifiedByID: number;
  driverRemark: string;
  customerSignatureImage: string;
  dutySlipImage: string;
  dutySlipMap: string;
  // goodForBilling: boolean;
  // verifyDuty: boolean;
  // dsClosing: string;
  // runningDetails: string;
  // vendorRemark: string;
  tripStatus: string;
  registrationNumber: string;
  driverName: string;
  activationStatus: boolean;

  constructor(closingDutySlipModel) {
    this.dutySlipID = closingDutySlipModel.dutySlipID || '';
    this.allotmentID = closingDutySlipModel.allotmentID || '';
    this.reservationID = closingDutySlipModel.reservationID || '';
    this.driverInventoryAssociationID = closingDutySlipModel.driverInventoryAssociationID || '';
    this.inventoryID = closingDutySlipModel.inventoryID || '';
    this.driverID = closingDutySlipModel.driverID || '';
    this.gpsID = closingDutySlipModel.gpsID || '';
    this.appID = closingDutySlipModel.appID || '';
    this.manualDutySlipNumber = closingDutySlipModel.manualDutySlipNumber || '';
    this.dispatchMethod = closingDutySlipModel.dispatchMethod || '';
    this.actualCarMovedFrom = closingDutySlipModel.actualCarMovedFrom || '';

    this.locationOutEntryMethod = closingDutySlipModel.locationOutEntryMethod || '';
    this.locationOutEntryExecutiveID = closingDutySlipModel.locationOutEntryExecutiveID || '';
    this.locationOutLocationOrHubID = closingDutySlipModel.locationOutLocationOrHubID || '';
    this.locationOutDate = closingDutySlipModel.locationOutDate  || '';
    this.locationOutTime = closingDutySlipModel.locationOutTime  || '';
    this.locationOutKM = closingDutySlipModel.locationOutKM || '';
    this.locationOutLatLong = closingDutySlipModel.locationOutLatLong || '';
    this.locationOutAddressString = closingDutySlipModel.locationOutAddressString || '';

    this.reportingToGuestEntryMethod = closingDutySlipModel.reportingToGuestEntryMethod || '';
    this.reportingToGuestEntryExecutiveID = closingDutySlipModel.reportingToGuestEntryExecutiveID || '';
    this.reportingToGuestDate = closingDutySlipModel.reportingToGuestDate || '';
    this.reportingToGuestTime = closingDutySlipModel.reportingToGuestTime  || '';
    this.reportingToGuestKM = closingDutySlipModel.reportingToGuestKM || '';
    this.reportingToGuestLatLong = closingDutySlipModel.reportingToGuestLatLong || '';
    this.reportingToGuestAddressString = closingDutySlipModel.reportingToGuestAddressString || '';

    this.pickupEntryMethod = closingDutySlipModel.pickupEntryMethod || '';
    this.pickupEntryExecutiveID = closingDutySlipModel.pickupEntryExecutiveID || '';
    this.pickUpDate = closingDutySlipModel.pickUpDate  || '';
    this.pickUpTime = closingDutySlipModel.pickUpTime  || '';
    this.pickUpKM = closingDutySlipModel.pickUpKM || '';
    this.pickUpLatLong = closingDutySlipModel.pickUpLatLong || '';
    this.pickUpAddressString = closingDutySlipModel.pickUpAddressString || '';

    this.dropOffEntryMethod = closingDutySlipModel.dropOffEntryMethod || '';
    this.dropOffEntryExecutiveID = closingDutySlipModel.dropOffEntryExecutiveID || '';
    this.dropOffDate = closingDutySlipModel.dropOffDate  || '';
    this.dropOffTime = closingDutySlipModel.dropOffTime  || '';
    this.dropOffKM = closingDutySlipModel.dropOffKM || '';
    this.dropOffLatLong = closingDutySlipModel.dropOffLatLong || '';
    this.dropOffAddressString = closingDutySlipModel.dropOffAddressString || '';

    this.locationInEntryMethod = closingDutySlipModel.locationInEntryMethod || '';
    this.locationInEntryExecutiveID = closingDutySlipModel.locationInEntryExecutiveID || '';
    this.locationInLocationOrHubID = closingDutySlipModel.locationInLocationOrHubID || '';
    this.locationInDate = closingDutySlipModel.locationInDate  || '';
    this.locationInTime = closingDutySlipModel.locationInTime  || '';
    this.locationInKM = closingDutySlipModel.locationInKM || '';
    this.locationInLatLong = closingDutySlipModel.locationInLatLong || '';
    this.locationInAddressString = closingDutySlipModel.locationInAddressString || '';

    this.nextDayInstruction = closingDutySlipModel.nextDayInstruction || '';
    this.nextDayInstructionDate = closingDutySlipModel.nextDayInstructionDate  || '';
    this.nextDayInstructionTime = closingDutySlipModel.nextDayInstructionTime || '';
    this.dutyCompletionType = closingDutySlipModel.dutyCompletionType || '';
    this.closureStatus = closingDutySlipModel.closureStatus || '';
    this.closureMethod = closingDutySlipModel.closureMethod || '';
    this.closureEntryExecutiveID = closingDutySlipModel.closureEntryExecutiveID || '';
    this.isClosureVerified = closingDutySlipModel.isClosureVerified || '';
    this.closureVerifiedByID = closingDutySlipModel.closureVerifiedByID || '';
    this.driverRemark = closingDutySlipModel.driverRemark || '';
    this.customerSignatureImage = closingDutySlipModel.customerSignatureImage || '';
    this.dutySlipImage = closingDutySlipModel.dutySlipImage || '';
    this.dutySlipMap = closingDutySlipModel.dutySlipMap || '';
    // this.goodForBilling = closingDutySlipModel.goodForBilling || '';
    // this.verifyDuty = closingDutySlipModel.verifyDuty || '';
    // this.dsClosing = closingDutySlipModel.dsClosing || '';
    // this.runningDetails = closingDutySlipModel.runningDetails || '';
    // this.vendorRemark = closingDutySlipModel.vendorRemark || '';
    this.tripStatus = closingDutySlipModel.tripStatus || '';
    this.registrationNumber = closingDutySlipModel.registrationNumber || '';
    this.driverName = closingDutySlipModel.driverName || '';
    this.activationStatus = closingDutySlipModel.activationStatus  || '';
  }
}

