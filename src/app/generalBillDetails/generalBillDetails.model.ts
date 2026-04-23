// @ts-nocheck
import { formatDate } from '@angular/common';
export class GeneralBillDetails {
  dutySlipID: number;
  reservationID: number;
  reservationCarDriverID: number;
  passengerName: string;
  passengerMobile: string;
  vehicle: string;
  package: string;
  carBooked:string;
  vehicleRegistrationNumber: string;
  driverName: string;
  driverMobile: string;
  stopDate: Date;
  stopTime: Date;
  stopAddress: string;
  stopCityID: number;
  city: string;
  state: string;
  country: string;
  stopAddressGeoLocation: string;
  stopLongitude: string;
  stopLatitude: string;
  garageOutDateTime: Date;
  garageOutBy: number;
  garageOutByName: string;
  garageOutMeterReading: number;
  garageOutGPSAddressString: string;
  garageOutGPSLocation: string;
  dutyStatus: string;
  tripSuccessStatus: string;
  actionType: string;
  dispute_BreakdownDateTime: Date;
  dispute_BreakdownBy: number;
  dispute_BreakdownByName: string;
  dispute_BreakdownMeterReading: number;
  dispute_BreakdownGPSAddressString: string;
  dispute_BreakdownGPSLocation: string;
  dispute_BreakdownCalculatedKMByMeterReading: number;
  dispute_BreakdownCalculatedKMByGPS: number;
  dispute_BreakdownDetails: string;
  dispute_BreakdownResolution: string;

  reachedDateTime: Date;
  reachedBy: number;
  reachedMeterReading:string;
  reachedGPSAddressString: string;
  reachedGPSLocation: string;
  tripStartDateTime: Date;
  tripStartBy: number;
  tripStartMeterReading: number;
  tripStartGPSAddressString: string;
  tripStartGPSLocation: string;
  tripStartCalculatedKMByMeterReading: number;
  tripStartCalculatedKMByGPS: number;
  tripEndDateTime: Date;
  tripEndBy: number;
  tripEndMeterReading: number;
  tripEndGPSAddressString: string;
  tripEndGPSLocation: string;
  tripEndCalculatedKMByMeterReading: number;
  tripEndCalculatedKMByGPS: number;
  garageInDateTime: Date;
  garageInBy: number;
  garageInMeterReading: number;
  garageInGPSAddressString: string;
  garageInGPSLocation: string;
  garageInCalculatedKMByMeterReading: number;
  garageInCalculatedKMByGPS: number;
  pickupCity:string;
  constructor(generalBillDetails) {
    {
      
    }
  }
}

