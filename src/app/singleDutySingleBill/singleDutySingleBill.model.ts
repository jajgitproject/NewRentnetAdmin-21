// @ts-nocheck
import { formatDate } from '@angular/common';
export class SingleDutySingleBill {
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

  constructor(singleDutySingleBill) {
    {
      this.dutySlipID = singleDutySingleBill.dutySlipID || -1;
      this.reservationID = singleDutySingleBill.reservationID || -1;
      this.reservationCarDriverID = singleDutySingleBill.reservationCarDriverID || -1;
      this.passengerName = singleDutySingleBill.passengerName || '';
      this.passengerMobile = singleDutySingleBill.passengerMobile || '';
      this.vehicle = singleDutySingleBill.vehicle || '';
      this.vehicleRegistrationNumber =
        singleDutySingleBill.vehicleRegistrationNumber || '';
      this.driverName = singleDutySingleBill.driverName || '';
      this.driverMobile = singleDutySingleBill.driverMobile || '';
      this.stopDate = singleDutySingleBill.stopDate || '';
      this.stopTime = singleDutySingleBill.stopTime || '';
      this.stopAddress = singleDutySingleBill.stopAddress || '';
      this.stopCityID = singleDutySingleBill.stopCityID;
      this.city = singleDutySingleBill.city || '';
      this.state = singleDutySingleBill.state || '';
      this.country = singleDutySingleBill.country || '';
      this.stopAddressGeoLocation = singleDutySingleBill.stopAddressGeoLocation || '';
      this.stopLongitude = singleDutySingleBill.stopLongitude || '';
      this.stopLatitude = singleDutySingleBill.stopLatitude || '';
      this.garageOutBy = singleDutySingleBill.garageOutBy || -1;
      this.garageOutByName = singleDutySingleBill.garageOutBy || '';
      this.garageOutMeterReading = singleDutySingleBill.garageOutMeterReading || '';
      this.garageOutGPSAddressString =
        singleDutySingleBill.garageOutGPSAddressString || '';
      this.garageOutGPSLocation = singleDutySingleBill.garageOutGPSLocation || '';
      this.dutyStatus = singleDutySingleBill.dutyStatus || '';
      this.tripSuccessStatus = singleDutySingleBill.tripSuccessStatus || '';
      this.actionType = singleDutySingleBill.actionType || '';
      this.garageOutDateTime = new Date();
      this.dispute_BreakdownDateTime = singleDutySingleBill.dispute_BreakdownDateTime;
      this.dispute_BreakdownBy = singleDutySingleBill.dispute_BreakdownBy || '';
      this.dispute_BreakdownByName =
        singleDutySingleBill.dispute_BreakdownByName || '';
      this.dispute_BreakdownMeterReading =
        singleDutySingleBill.dispute_BreakdownMeterReading || '';
      this.dispute_BreakdownGPSAddressString =
        singleDutySingleBill.dispute_BreakdownGPSAddressString || '';
      this.dispute_BreakdownGPSLocation =
        singleDutySingleBill.dispute_BreakdownGPSLocation || '';
      this.dispute_BreakdownCalculatedKMByMeterReading =
        singleDutySingleBill.dispute_BreakdownCalculatedKMByMeterReading || '';
      this.dispute_BreakdownCalculatedKMByGPS =
        singleDutySingleBill.dispute_BreakdownCalculatedKMByGPS || '';
      this.dispute_BreakdownDetails =
        singleDutySingleBill.dispute_BreakdownDetails || '';
      this.dispute_BreakdownResolution =
        singleDutySingleBill.dispute_BreakdownResolution || '';

      this.reachedDateTime = singleDutySingleBill.reachedDateTime;
      this.reachedBy = singleDutySingleBill.reachedBy || '';
      this.reachedGPSAddressString =
        singleDutySingleBill.reachedGPSAddressString || '';
      this.reachedGPSLocation = singleDutySingleBill.reachedGPSLocation || '';
      this.tripStartDateTime = singleDutySingleBill.tripStartDateTime;
      this.tripStartBy = singleDutySingleBill.tripStartBy || '';
      this.tripStartMeterReading = singleDutySingleBill.tripStartMeterReading || '';
      this.tripStartGPSAddressString =
        singleDutySingleBill.tripStartGPSAddressString || '';
      this.tripStartGPSLocation = singleDutySingleBill.tripStartGPSLocation || '';
      this.tripStartCalculatedKMByMeterReading =
        singleDutySingleBill.tripStartCalculatedKMByMeterReading || '';
      this.tripStartCalculatedKMByGPS =
        singleDutySingleBill.tripStartCalculatedKMByGPS || '';
      this.tripEndDateTime = singleDutySingleBill.tripEndDateTime;
      this.tripEndBy = singleDutySingleBill.tripEndBy || '';
      this.tripEndMeterReading = singleDutySingleBill.tripEndMeterReading || '';
      this.tripEndGPSAddressString =
        singleDutySingleBill.tripEndGPSAddressString || '';
      this.tripEndGPSLocation = singleDutySingleBill.tripEndGPSLocation || '';
      this.tripEndCalculatedKMByMeterReading =
        singleDutySingleBill.tripEndCalculatedKMByMeterReading || '';
      this.tripEndCalculatedKMByGPS =
        singleDutySingleBill.tripEndCalculatedKMByGPS || '';
      this.garageInDateTime = singleDutySingleBill.garageInDateTime;
      this.garageInBy = singleDutySingleBill.garageInBy || '';
      this.garageInMeterReading = singleDutySingleBill.garageInMeterReading || '';
      this.garageInGPSAddressString =
        singleDutySingleBill.garageInGPSAddressString || '';
      this.garageInGPSLocation = singleDutySingleBill.garageInGPSLocation || '';
      this.garageInCalculatedKMByMeterReading =
        singleDutySingleBill.garageInCalculatedKMByMeterReading || '';
      this.garageInCalculatedKMByGPS =
        singleDutySingleBill.garageInCalculatedKMByGPS || '';
    }
  }
}

