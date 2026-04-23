// @ts-nocheck
export class ClosingDutySlipByGPSModel {
  dutySlipByGPSID: number;
  dutySlipID: number;
  locationOutLocationOrHubID: number;
  organizationalEntityName: string;

  locationOutDateByGPS: Date;
  locationOutTimeByGPS: Date;
  locationOutAddressStringByGPS: string;
  locationOutLatLongByGPS: string;
  locationOutKMByGPS: number;

  reportingToGuestDateByGPS: Date;
  reportingToGuestTimeByGPS: Date;
  reportingToGuestAddressStringByGPS: string;
  reportingToGuestLatLongByGPS: string;
  reportingToGuestKMByGPS: number;

  pickUpDateByGPS: Date;
  pickUpTimeByGPS: Date;
  pickUpAddressStringByGPS: string;
  pickUpLatLongByGPS: string;
  pickUpKMByGPS: number;

  dropOffDateByGPS: Date;
  dropOffTimeByGPS: Date;
  dropOffAddressStringByGPS: string;
  dropOffLatLongByGPS: string;
  dropOffKMByGPS: number;

  locationInDateByGPS: Date;
  locationInTimeByGPS: Date;
  locationInAddressStringByGPS: string;
  locationInLatLongByGPS: string;
  locationInKMByGPS: number;
  customerSignatureImage: string;

  constructor(closingDutySlipByGPSModel) {
    this.dutySlipByGPSID = closingDutySlipByGPSModel.dutySlipByGPSID || '';
    this.dutySlipID = closingDutySlipByGPSModel.dutySlipID || '';
    this.locationOutLocationOrHubID = closingDutySlipByGPSModel.locationOutLocationOrHubID || '';
    this.organizationalEntityName = closingDutySlipByGPSModel.organizationalEntityName || '';

    this.locationOutDateByGPS = closingDutySlipByGPSModel.locationOutDateByGPS  || '';
    this.locationOutTimeByGPS = closingDutySlipByGPSModel.locationOutTimeByGPS  || '';
    this.locationOutAddressStringByGPS = closingDutySlipByGPSModel.locationOutAddressStringByGPS || '';
    this.locationOutLatLongByGPS = closingDutySlipByGPSModel.locationOutLatLongByGPS || '';
    this.locationOutKMByGPS = closingDutySlipByGPSModel.locationOutKMByGPS || '';

    this.reportingToGuestDateByGPS = closingDutySlipByGPSModel.reportingToGuestDateByGPS  || '';
    this.reportingToGuestTimeByGPS = closingDutySlipByGPSModel.reportingToGuestTimeByGPS  || '';
    this.reportingToGuestAddressStringByGPS = closingDutySlipByGPSModel.reportingToGuestAddressStringByGPS || '';
    this.reportingToGuestLatLongByGPS = closingDutySlipByGPSModel.reportingToGuestLatLongByGPS || '';
    this.reportingToGuestKMByGPS = closingDutySlipByGPSModel.reportingToGuestKMByGPS || '';

    this.pickUpDateByGPS = closingDutySlipByGPSModel.pickUpDateByGPS  || '';
    this.pickUpTimeByGPS = closingDutySlipByGPSModel.pickUpTimeByGPS  || '';
    this.pickUpAddressStringByGPS = closingDutySlipByGPSModel.pickUpAddressStringByGPS || '';
    this.pickUpLatLongByGPS = closingDutySlipByGPSModel.pickUpLatLongByGPS || '';
    this.pickUpKMByGPS = closingDutySlipByGPSModel.pickUpKMByGPS || '';

    this.dropOffDateByGPS = closingDutySlipByGPSModel.dropOffDateByGPS  || '';
    this.dropOffTimeByGPS = closingDutySlipByGPSModel.dropOffTimeByGPS  || '';
    this.dropOffAddressStringByGPS = closingDutySlipByGPSModel.dropOffAddressStringByGPS || '';
    this.dropOffLatLongByGPS = closingDutySlipByGPSModel.dropOffLatLongByGPS || '';
    this.dropOffKMByGPS = closingDutySlipByGPSModel.dropOffKMByGPS || '';

    this.locationInDateByGPS = closingDutySlipByGPSModel.locationInDateByGPS  || '';
    this.locationInTimeByGPS = closingDutySlipByGPSModel.locationInTimeByGPS  || '';
    this.locationInAddressStringByGPS = closingDutySlipByGPSModel.locationInAddressStringByGPS || '';
    this.locationInLatLongByGPS = closingDutySlipByGPSModel.locationInLatLongByGPS || '';
    this.locationInKMByGPS = closingDutySlipByGPSModel.locationInKMByGPS || '';
    this.customerSignatureImage = closingDutySlipByGPSModel.customerSignatureImage || '';
  }
}

