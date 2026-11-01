// @ts-nocheck
export class SendDataToMyfRow {
  dutySlipID: number;
  reservationID: number;
  pickupDate: string;
  myfStatus: string;
  myfFailure: string;
  gTrackStatus: string;
  hasMyfRequest: boolean;
  hasMyfResponse: boolean;
  hasGTrackRequest: boolean;
  hasGTrackResponse: boolean;
  canSelect: boolean;

  constructor(row: any) {
    this.dutySlipID = row?.dutySlipID || row?.DutySlipID || 0;
    this.reservationID = row?.reservationID || row?.ReservationID || 0;
    this.pickupDate = row?.pickupDate || row?.PickupDate || '';
    this.myfStatus = row?.myfStatus || row?.MyfStatus || 'Unprocessed';
    this.myfFailure = row?.myfFailure || row?.MyfFailure || '';
    this.gTrackStatus = row?.gTrackStatus || row?.GTrackStatus || 'Unprocessed';
    this.hasMyfRequest = !!(row?.hasMyfRequest || row?.HasMyfRequest);
    this.hasMyfResponse = !!(row?.hasMyfResponse || row?.HasMyfResponse);
    this.hasGTrackRequest = !!(row?.hasGTrackRequest || row?.HasGTrackRequest);
    this.hasGTrackResponse = !!(row?.hasGTrackResponse || row?.HasGTrackResponse);
    this.canSelect = row?.canSelect === true || row?.CanSelect === true || this.myfStatus !== 'Processing';
  }
}
