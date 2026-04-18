// @ts-nocheck
export class ClosingDutySlipByDriverModel {
  dutySlipByDriverID: number;
  dutySlipID: number;
  locationOutLocationOrHubID: number;
  locationOutDateByDriver: Date;
  locationOutDateByDriverString: string;
  locationOutTimeByDriver: Date;
  locationOutTimeByDriverString: string;
  locationOutKMByDriver: number;
  locationOutLatLongByDriver: string;
  locationOutAddressStringByDriver: string;
  organizationalEntityName: string;

  reportingToGuestDateByDriver: Date;
  reportingToGuestDateByDriverString: string;
  reportingToGuestTimeByDriver: Date;
  reportingToGuestTimeByDriverString: string;
  reportingToGuestKMByDriver: number;
  reportingToGuestLatLongByDriver: string;
  reportingToGuestAddressStringByDriver: string;

  pickUpDateByDriver: Date;
  pickUpDateByDriverString: string;
  pickUpTimeByDriver: Date;
  pickUpTimeByDriverString: string;
  pickUpKMByDriver: number;
  pickUpLatLongByDriver: string;
  pickUpAddressStringByDriver: string;

  dropOffDateByDriver: Date;
  dropOffDateByDriverString: string;
  dropOffTimeByDriver: Date;
  dropOffTimeByDriverString: string;
  dropOffKMByDriver: number;
  dropOffLatLongByDriver: string;
  dropOffAddressStringByDriver: string;

  locationInDateByDriver: Date;
  locationInDateByDriverString: string;
  locationInTimeByDriver: Date;
  locationInTimeByDriverString: string;
  locationInKMByDriver: number;
  locationInLatLongByDriver: string;
  locationInAddressStringByDriver: string;

  constructor(closingDutySlipByDriverModel) {
    this.dutySlipByDriverID = closingDutySlipByDriverModel.dutySlipByDriverID || '';
    this.dutySlipID = closingDutySlipByDriverModel.dutySlipID || '';
    this.locationOutLocationOrHubID = closingDutySlipByDriverModel.locationOutLocationOrHubID || '';
    this.locationOutDateByDriver = closingDutySlipByDriverModel.locationOutDateByDriver  || '';
    this.locationOutDateByDriverString = closingDutySlipByDriverModel.locationOutDateByDriverString || '';
    this.locationOutTimeByDriver = closingDutySlipByDriverModel.locationOutTimeByDriver  || '';
    this.locationOutTimeByDriverString = closingDutySlipByDriverModel.locationOutTimeByDriverString || '';
    this.locationOutKMByDriver = closingDutySlipByDriverModel.locationOutKMByDriver || '';
    this.locationOutLatLongByDriver = closingDutySlipByDriverModel.locationOutLatLongByDriver || '';
    this.locationOutAddressStringByDriver = closingDutySlipByDriverModel.locationOutAddressStringByDriver || '';
    this.organizationalEntityName = closingDutySlipByDriverModel.organizationalEntityName || '';

    this.reportingToGuestDateByDriver = closingDutySlipByDriverModel.reportingToGuestDateByDriver || '';
    this.reportingToGuestDateByDriverString = closingDutySlipByDriverModel.reportingToGuestDateByDriverString || '';
    this.reportingToGuestTimeByDriver = closingDutySlipByDriverModel.reportingToGuestTimeByDriver  || '';
    this.reportingToGuestTimeByDriverString = closingDutySlipByDriverModel.reportingToGuestTimeByDriverString || '';
    this.reportingToGuestKMByDriver = closingDutySlipByDriverModel.reportingToGuestKMByDriver || '';
    this.reportingToGuestLatLongByDriver = closingDutySlipByDriverModel.reportingToGuestLatLongByDriver || '';
    this.reportingToGuestAddressStringByDriver = closingDutySlipByDriverModel.reportingToGuestAddressStringByDriver || '';

    this.pickUpDateByDriver = closingDutySlipByDriverModel.pickUpDateByDriver || '';
    this.pickUpDateByDriverString = closingDutySlipByDriverModel.pickUpDateByDriverString || '';
    this.pickUpTimeByDriver = closingDutySlipByDriverModel.pickUpTimeByDriver  || '';
    this.pickUpTimeByDriverString = closingDutySlipByDriverModel.pickUpTimeByDriverString || '';
    this.pickUpKMByDriver = closingDutySlipByDriverModel.pickUpKMByDriver || '';
    this.pickUpLatLongByDriver = closingDutySlipByDriverModel.pickUpLatLongByDriver || '';
    this.pickUpAddressStringByDriver = closingDutySlipByDriverModel.pickUpAddressStringByDriver || '';

    this.dropOffDateByDriver = closingDutySlipByDriverModel.dropOffDateByDriver  || '';
    this.dropOffDateByDriverString = closingDutySlipByDriverModel.dropOffDateByDriverString || '';
    this.dropOffTimeByDriver = closingDutySlipByDriverModel.dropOffTimeByDriver  || '';
    this.dropOffTimeByDriverString = closingDutySlipByDriverModel.dropOffTimeByDriverString || '';
    this.dropOffKMByDriver = closingDutySlipByDriverModel.dropOffKMByDriver || '';
    this.dropOffLatLongByDriver = closingDutySlipByDriverModel.dropOffLatLongByDriver || '';
    this.dropOffAddressStringByDriver = closingDutySlipByDriverModel.dropOffAddressStringByDriver || '';

    this.locationInDateByDriver = closingDutySlipByDriverModel.locationInDateByDriver  || '';
    this.locationInDateByDriverString = closingDutySlipByDriverModel.locationInDateByDriverString || '';
    this.locationInTimeByDriver = closingDutySlipByDriverModel.locationInTimeByDriver  || '';
    this.locationInTimeByDriverString = closingDutySlipByDriverModel.locationInTimeByDriverString || '';
    this.locationInKMByDriver = closingDutySlipByDriverModel.locationInKMByDriver || '';
    this.locationInLatLongByDriver = closingDutySlipByDriverModel.locationInLatLongByDriver || '';
    this.locationInAddressStringByDriver = closingDutySlipByDriverModel.locationInAddressStringByDriver || '';
  }
}

