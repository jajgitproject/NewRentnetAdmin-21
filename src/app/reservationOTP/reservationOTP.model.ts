
import { formatDate } from '@angular/common';
export class ReservationOTP {

  reservationStopID: number;
  reservationID: number;

  reservationStopType: string;

  // City
  reservationStopCityID: number;
  reservationStopCity: string;

  // State
  reservationStopStateID: number;
  reservationStopState: string;

  // Country
  reservationStopCountryID: number;
  reservationStopCountry: string;

  // Spot
  reservationStopSpotTypeID: number;
  reservationStopSpotType: string;

  reservationStopSpotID: number;

  // Address
  reservationStopAddress: string;

  reservationStopAddressLatLong: string;

  reservationStopAddressDetails: string;

  // Date Time
  reservationStopDate: Date;

  reservationStopTime: Date;

  // Priority
  reservationStopPriority: number;

  // Status
  activationStatus: boolean;

  isTimeNotConfirmed: boolean;

  tripOTP: string;

  constructor(reservationOTP) {

    this.reservationStopID =
      reservationOTP.reservationStopID || 0;

    this.reservationID =
      reservationOTP.reservationID || 0;

    this.reservationStopType =
      reservationOTP.reservationStopType || '';

    // City
    this.reservationStopCityID =
      reservationOTP.reservationStopCityID || 0;

    this.reservationStopCity =
      reservationOTP.reservationStopCity || '';

    // State
    this.reservationStopStateID =
      reservationOTP.reservationStopStateID || 0;

    this.reservationStopState =
      reservationOTP.reservationStopState || '';

    // Country
    this.reservationStopCountryID =
      reservationOTP.reservationStopCountryID || 0;

    this.reservationStopCountry =
      reservationOTP.reservationStopCountry || '';

    // Spot
    this.reservationStopSpotTypeID =
      reservationOTP.reservationStopSpotTypeID || 0;

    this.reservationStopSpotType =
      reservationOTP.reservationStopSpotType || '';

    this.reservationStopSpotID =
      reservationOTP.reservationStopSpotID || 0;

    // Address
    this.reservationStopAddress =
      reservationOTP.reservationStopAddress || '';

    this.reservationStopAddressLatLong =
      reservationOTP.reservationStopAddressLatLong || '';

    this.reservationStopAddressDetails =
      reservationOTP.reservationStopAddressDetails || '';

    // Date Time
    this.reservationStopDate =
      reservationOTP.reservationStopDate || null;

    this.reservationStopTime =
      reservationOTP.reservationStopTime || null;

    // Priority
    this.reservationStopPriority =
      reservationOTP.reservationStopPriority || '';

    // Status
    this.activationStatus =
      reservationOTP.activationStatus || '';

    this.isTimeNotConfirmed =
      reservationOTP.isTimeNotConfirmed || '';

    this.tripOTP =
      reservationOTP.tripOTP || '';
  }
}

