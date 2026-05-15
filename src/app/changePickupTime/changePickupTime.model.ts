// @ts-nocheck
import { formatDate } from '@angular/common';
export class ChangePickupTimeModel {
  reservationID: number;
  reservationStopAddressDetails: string;
  reservationStopAddress: string;
  reservationStopLatitude: number;
  reservationStopLongitude: number;
  reservationStopAddressLatLong: string;
  pickupAddress: string;
  pickupAddressDetails: string;
  pickupAddressLatLong: string;
  userID: number;
  constructor(changePickupTimeModel) {
    {
      this.reservationStopAddressDetails = changePickupTimeModel.reservationStopAddressDetails || '';
      this.reservationStopAddress = changePickupTimeModel.reservationStopAddress || '';
      this.reservationStopLatitude = changePickupTimeModel.reservationStopLatitude || 0;
      this.reservationStopLongitude = changePickupTimeModel.reservationStopLongitude || 0;
      this.reservationStopAddressLatLong = changePickupTimeModel.reservationStopAddressLatLong || '';
      this.pickupAddress = changePickupTimeModel.pickupAddress || '';
      this.pickupAddressDetails = changePickupTimeModel.pickupAddressDetails || '';
      this.pickupAddressLatLong = changePickupTimeModel.pickupAddressLatLong || '';
      this.reservationID = changePickupTimeModel.reservationID || 0;
    }
  }
}

