// @ts-nocheck
function pickDriverField(raw: any, camel: string, pascal: string): unknown {
  const value = raw?.[camel] ?? raw?.[pascal];
  return value === undefined || value === null ? null : value;
}

function pickDriverString(raw: any, camel: string, pascal: string): string | null {
  const value = pickDriverField(raw, camel, pascal);
  return value === '' ? null : value;
}

function pickDriverNumber(raw: any, camel: string, pascal: string): number | null {
  const value = pickDriverField(raw, camel, pascal);
  if (value === '' || value === null) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

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
    const raw = closingDutySlipByDriverModel ?? {};
    this.dutySlipByDriverID = pickDriverNumber(raw, 'dutySlipByDriverID', 'DutySlipByDriverID') ?? 0;
    this.dutySlipID = pickDriverNumber(raw, 'dutySlipID', 'DutySlipID') ?? 0;
    this.locationOutLocationOrHubID =
      pickDriverNumber(raw, 'locationOutLocationOrHubID', 'LocationOutLocationOrHubID') ?? 0;
    this.locationOutDateByDriver = pickDriverField(raw, 'locationOutDateByDriver', 'LocationOutDateByDriver');
    this.locationOutDateByDriverString =
      pickDriverString(raw, 'locationOutDateByDriverString', 'LocationOutDateByDriverString') ?? '';
    this.locationOutTimeByDriver = pickDriverField(raw, 'locationOutTimeByDriver', 'LocationOutTimeByDriver');
    this.locationOutTimeByDriverString =
      pickDriverString(raw, 'locationOutTimeByDriverString', 'LocationOutTimeByDriverString') ?? '';
    this.locationOutKMByDriver = pickDriverNumber(raw, 'locationOutKMByDriver', 'LocationOutKMByDriver');
    this.locationOutLatLongByDriver =
      pickDriverString(raw, 'locationOutLatLongByDriver', 'LocationOutLatLongByDriver') ?? '';
    this.locationOutAddressStringByDriver =
      pickDriverString(raw, 'locationOutAddressStringByDriver', 'LocationOutAddressStringByDriver') ?? '';
    this.organizationalEntityName =
      pickDriverString(raw, 'organizationalEntityName', 'OrganizationalEntityName') ?? '';

    this.reportingToGuestDateByDriver =
      pickDriverField(raw, 'reportingToGuestDateByDriver', 'ReportingToGuestDateByDriver');
    this.reportingToGuestDateByDriverString =
      pickDriverString(raw, 'reportingToGuestDateByDriverString', 'ReportingToGuestDateByDriverString') ?? '';
    this.reportingToGuestTimeByDriver =
      pickDriverField(raw, 'reportingToGuestTimeByDriver', 'ReportingToGuestTimeByDriver');
    this.reportingToGuestTimeByDriverString =
      pickDriverString(raw, 'reportingToGuestTimeByDriverString', 'ReportingToGuestTimeByDriverString') ?? '';
    this.reportingToGuestKMByDriver =
      pickDriverNumber(raw, 'reportingToGuestKMByDriver', 'ReportingToGuestKMByDriver');
    this.reportingToGuestLatLongByDriver =
      pickDriverString(raw, 'reportingToGuestLatLongByDriver', 'ReportingToGuestLatLongByDriver') ?? '';
    this.reportingToGuestAddressStringByDriver =
      pickDriverString(raw, 'reportingToGuestAddressStringByDriver', 'ReportingToGuestAddressStringByDriver') ?? '';

    this.pickUpDateByDriver = pickDriverField(raw, 'pickUpDateByDriver', 'PickUpDateByDriver');
    this.pickUpDateByDriverString =
      pickDriverString(raw, 'pickUpDateByDriverString', 'PickUpDateByDriverString') ?? '';
    this.pickUpTimeByDriver = pickDriverField(raw, 'pickUpTimeByDriver', 'PickUpTimeByDriver');
    this.pickUpTimeByDriverString =
      pickDriverString(raw, 'pickUpTimeByDriverString', 'PickUpTimeByDriverString') ?? '';
    this.pickUpKMByDriver = pickDriverNumber(raw, 'pickUpKMByDriver', 'PickUpKMByDriver');
    this.pickUpLatLongByDriver =
      pickDriverString(raw, 'pickUpLatLongByDriver', 'PickUpLatLongByDriver') ?? '';
    this.pickUpAddressStringByDriver =
      pickDriverString(raw, 'pickUpAddressStringByDriver', 'PickUpAddressStringByDriver') ?? '';

    this.dropOffDateByDriver = pickDriverField(raw, 'dropOffDateByDriver', 'DropOffDateByDriver');
    this.dropOffDateByDriverString =
      pickDriverString(raw, 'dropOffDateByDriverString', 'DropOffDateByDriverString') ?? '';
    this.dropOffTimeByDriver = pickDriverField(raw, 'dropOffTimeByDriver', 'DropOffTimeByDriver');
    this.dropOffTimeByDriverString =
      pickDriverString(raw, 'dropOffTimeByDriverString', 'DropOffTimeByDriverString') ?? '';
    this.dropOffKMByDriver = pickDriverNumber(raw, 'dropOffKMByDriver', 'DropOffKMByDriver');
    this.dropOffLatLongByDriver =
      pickDriverString(raw, 'dropOffLatLongByDriver', 'DropOffLatLongByDriver') ?? '';
    this.dropOffAddressStringByDriver =
      pickDriverString(raw, 'dropOffAddressStringByDriver', 'DropOffAddressStringByDriver') ?? '';

    this.locationInDateByDriver = pickDriverField(raw, 'locationInDateByDriver', 'LocationInDateByDriver');
    this.locationInDateByDriverString =
      pickDriverString(raw, 'locationInDateByDriverString', 'LocationInDateByDriverString') ?? '';
    this.locationInTimeByDriver = pickDriverField(raw, 'locationInTimeByDriver', 'LocationInTimeByDriver');
    this.locationInTimeByDriverString =
      pickDriverString(raw, 'locationInTimeByDriverString', 'LocationInTimeByDriverString') ?? '';
    this.locationInKMByDriver = pickDriverNumber(raw, 'locationInKMByDriver', 'LocationInKMByDriver');
    this.locationInLatLongByDriver =
      pickDriverString(raw, 'locationInLatLongByDriver', 'LocationInLatLongByDriver') ?? '';
    this.locationInAddressStringByDriver =
      pickDriverString(raw, 'locationInAddressStringByDriver', 'LocationInAddressStringByDriver') ?? '';
  }
}
