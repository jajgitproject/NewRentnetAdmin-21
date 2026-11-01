// @ts-nocheck
export class CustomerCityHigherExtraKMorHR {
  customerCityHigherExtraKMorHRID: number;
  customerID: number;
  cityID: number;
  cityName: string;
  chargeHigherExtraKMorHR: boolean;
  activationStatus: boolean;
  userID: number;

  constructor(record) {
    this.customerCityHigherExtraKMorHRID = Number(record.customerCityHigherExtraKMorHRID) || -1;
    this.customerID = Number(record.customerID) || 0;
    this.cityID = Number(record.cityID) || 0;
    this.cityName = record.cityName || '';
    this.chargeHigherExtraKMorHR =
      record.chargeHigherExtraKMorHR === true || record.chargeHigherExtraKMorHR === 'true';
    this.activationStatus =
      record.activationStatus === true ||
      record.activationStatus === 'true' ||
      (record.activationStatus !== false && record.activationStatus !== 'false' && record.activationStatus === '');
  }
}
