// @ts-nocheck
export class ClosingDutySlipByAppModel {
  dutySlipByAppID: number;
  dutySlipID: number;
  locationOutLocationOrHubID: number;
  organizationalEntityName: string;

  locationOutDateByApp: Date;
  locationOutTimeByApp: Date;
  locationOutKMByApp: number;
  locationOutAddressStringByApp: string;
  locationOutLatLongByApp: string;
  actualLocationOutDateByApp: Date;
  actualLocationOutTimeByApp: Date;
  actualLocationOutLatLongByApp: string;
  actualLocationOutAddressStringByApp: string;

  reportingToGuestDateByApp: Date;
  reportingToGuestTimeByApp: Date;
  reportingToGuestAddressStringByApp: string;
  reportingToGuestLatLongByApp: string;
  reportingToGuestKMByApp: number;

  pickUpDateByApp: Date;
  pickUpTimeByApp: Date;
  pickUpKMByApp: number;
  locationToPickupTripKm: number;
  pickUpAddressStringByApp: string;
  pickUpLatLongByApp: string;

  dropOffDateByApp: Date;
  dropOffTimeByApp: Date;
  dropOffKMByApp: number;
  pickupToDropOffTripKm: number;
  dropOffAddressStringByApp: string;
  dropOffLatLongByApp: string;

  locationInDateByApp: Date;
  locationInTimeByApp: Date;
  locationInKMByApp: number;
  dropOffToLocationInTripKm: number;
  locationInAddressStringByApp: string;
  locationInLatLongByApp: string;

  locationOutKMByAppActual: number;
  reportingToGuestKMByAppActual: number;
  pickupKMByAppActual: number;
  dropOffKMByAppActual: number;
  locationInKMByAppActual: number;

  constructor(closingDutySlipByAppModel) {
    this.dutySlipByAppID = closingDutySlipByAppModel.dutySlipByAppID || '';
    this.dutySlipID = closingDutySlipByAppModel.dutySlipID || '';
    this.locationOutLocationOrHubID = closingDutySlipByAppModel.locationOutLocationOrHubID || '';
    this.organizationalEntityName = closingDutySlipByAppModel.organizationalEntityName || '';

    this.locationOutDateByApp = closingDutySlipByAppModel.locationOutDateByApp  || '';
    this.locationOutTimeByApp = closingDutySlipByAppModel.locationOutTimeByApp  || '';
    this.locationOutKMByApp = closingDutySlipByAppModel.locationOutKMByApp || '';
    this.locationOutAddressStringByApp = closingDutySlipByAppModel.locationOutAddressStringByApp || '';
    this.locationOutLatLongByApp = closingDutySlipByAppModel.locationOutLatLongByApp || '';
    this.actualLocationOutDateByApp = closingDutySlipByAppModel.actualLocationOutDateByApp  || '';
    this.actualLocationOutTimeByApp = closingDutySlipByAppModel.actualLocationOutTimeByApp  || '';
    this.actualLocationOutLatLongByApp = closingDutySlipByAppModel.actualLocationOutLatLongByApp || '';
    this.actualLocationOutAddressStringByApp = closingDutySlipByAppModel.actualLocationOutAddressStringByApp || '';

    this.reportingToGuestDateByApp = closingDutySlipByAppModel.reportingToGuestDateByApp  || '';
    this.reportingToGuestTimeByApp = closingDutySlipByAppModel.reportingToGuestTimeByApp  || '';
    this.reportingToGuestAddressStringByApp = closingDutySlipByAppModel.reportingToGuestAddressStringByApp || '';
    this.reportingToGuestLatLongByApp = closingDutySlipByAppModel.reportingToGuestLatLongByApp || '';
    this.reportingToGuestKMByApp = closingDutySlipByAppModel.reportingToGuestKMByApp || '';

    this.pickUpDateByApp = closingDutySlipByAppModel.pickUpDateByApp  || '';
    this.pickUpTimeByApp = closingDutySlipByAppModel.pickUpTimeByApp  || '';
    this.pickUpKMByApp = closingDutySlipByAppModel.pickUpKMByApp || '';
    this.locationToPickupTripKm = closingDutySlipByAppModel.locationToPickupTripKm || '';
    this.pickUpAddressStringByApp = closingDutySlipByAppModel.pickUpAddressStringByApp || '';
    this.pickUpLatLongByApp = closingDutySlipByAppModel.pickUpLatLongByApp || '';

    this.dropOffDateByApp = closingDutySlipByAppModel.dropOffDateByApp  || '';
    this.dropOffTimeByApp = closingDutySlipByAppModel.dropOffTimeByApp  || '';
    this.dropOffKMByApp = closingDutySlipByAppModel.dropOffKMByApp || '';
    this.pickupToDropOffTripKm = closingDutySlipByAppModel.pickupToDropOffTripKm || '';
    this.dropOffAddressStringByApp = closingDutySlipByAppModel.dropOffAddressStringByApp || '';
    this.dropOffLatLongByApp = closingDutySlipByAppModel.dropOffLatLongByApp || '';

    this.locationInDateByApp = closingDutySlipByAppModel.locationInDateByApp  || '';
    this.locationInTimeByApp = closingDutySlipByAppModel.locationInTimeByApp  || '';
    this.locationInKMByApp = closingDutySlipByAppModel.locationInKMByApp || '';
    this.dropOffToLocationInTripKm = closingDutySlipByAppModel.dropOffToLocationInTripKm || '';
    this.locationInAddressStringByApp = closingDutySlipByAppModel.locationInAddressStringByApp || '';
    this.locationInLatLongByApp = closingDutySlipByAppModel.locationInLatLongByApp || '';

    this.locationOutKMByAppActual = closingDutySlipByAppModel.locationOutKMByAppActual || '';
    this.reportingToGuestKMByAppActual = closingDutySlipByAppModel.reportingToGuestKMByAppActual || '';
    this.pickupKMByAppActual = closingDutySlipByAppModel.pickupKMByAppActual || '';
    this.dropOffKMByAppActual = closingDutySlipByAppModel.dropOffKMByAppActual || '';
    this.locationInKMByAppActual = closingDutySlipByAppModel.locationInKMByAppActual || '';
  }
}

