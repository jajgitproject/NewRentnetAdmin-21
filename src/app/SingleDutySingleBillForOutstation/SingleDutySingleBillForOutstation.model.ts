// @ts-nocheck
import { formatDate } from '@angular/common';
export class SingleDutySingleBillForOutstation {
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

  constructor(singleDutySingleBillForOutstation) {
    {
      this.dutySlipID = singleDutySingleBillForOutstation.dutySlipID || -1;
      this.reservationID = singleDutySingleBillForOutstation.reservationID || -1;
      this.reservationCarDriverID = singleDutySingleBillForOutstation.reservationCarDriverID || -1;
      this.passengerName = singleDutySingleBillForOutstation.passengerName || '';
      this.passengerMobile = singleDutySingleBillForOutstation.passengerMobile || '';
      this.vehicle = singleDutySingleBillForOutstation.vehicle || '';
      this.vehicleRegistrationNumber =
        singleDutySingleBillForOutstation.vehicleRegistrationNumber || '';
      this.driverName = singleDutySingleBillForOutstation.driverName || '';
      this.driverMobile = singleDutySingleBillForOutstation.driverMobile || '';
      this.stopDate = singleDutySingleBillForOutstation.stopDate || '';
      this.stopTime = singleDutySingleBillForOutstation.stopTime || '';
      this.stopAddress = singleDutySingleBillForOutstation.stopAddress || '';
      this.stopCityID = singleDutySingleBillForOutstation.stopCityID;
      this.city = singleDutySingleBillForOutstation.city || '';
      this.state = singleDutySingleBillForOutstation.state || '';
      this.country = singleDutySingleBillForOutstation.country || '';
      this.stopAddressGeoLocation = singleDutySingleBillForOutstation.stopAddressGeoLocation || '';
      this.stopLongitude = singleDutySingleBillForOutstation.stopLongitude || '';
      this.stopLatitude = singleDutySingleBillForOutstation.stopLatitude || '';
      this.garageOutBy = singleDutySingleBillForOutstation.garageOutBy || -1;
      this.garageOutByName = singleDutySingleBillForOutstation.garageOutBy || '';
      this.garageOutMeterReading = singleDutySingleBillForOutstation.garageOutMeterReading || '';
      this.garageOutGPSAddressString =
        singleDutySingleBillForOutstation.garageOutGPSAddressString || '';
      this.garageOutGPSLocation = singleDutySingleBillForOutstation.garageOutGPSLocation || '';
      this.dutyStatus = singleDutySingleBillForOutstation.dutyStatus || '';
      this.tripSuccessStatus = singleDutySingleBillForOutstation.tripSuccessStatus || '';
      this.actionType = singleDutySingleBillForOutstation.actionType || '';
      this.garageOutDateTime = new Date();
      this.dispute_BreakdownDateTime = singleDutySingleBillForOutstation.dispute_BreakdownDateTime;
      this.dispute_BreakdownBy = singleDutySingleBillForOutstation.dispute_BreakdownBy || '';
      this.dispute_BreakdownByName =
        singleDutySingleBillForOutstation.dispute_BreakdownByName || '';
      this.dispute_BreakdownMeterReading =
        singleDutySingleBillForOutstation.dispute_BreakdownMeterReading || '';
      this.dispute_BreakdownGPSAddressString =
        singleDutySingleBillForOutstation.dispute_BreakdownGPSAddressString || '';
      this.dispute_BreakdownGPSLocation =
        singleDutySingleBillForOutstation.dispute_BreakdownGPSLocation || '';
      this.dispute_BreakdownCalculatedKMByMeterReading =
        singleDutySingleBillForOutstation.dispute_BreakdownCalculatedKMByMeterReading || '';
      this.dispute_BreakdownCalculatedKMByGPS =
        singleDutySingleBillForOutstation.dispute_BreakdownCalculatedKMByGPS || '';
      this.dispute_BreakdownDetails =
        singleDutySingleBillForOutstation.dispute_BreakdownDetails || '';
      this.dispute_BreakdownResolution =
        singleDutySingleBillForOutstation.dispute_BreakdownResolution || '';

      this.reachedDateTime = singleDutySingleBillForOutstation.reachedDateTime;
      this.reachedBy = singleDutySingleBillForOutstation.reachedBy || '';
      this.reachedGPSAddressString =
        singleDutySingleBillForOutstation.reachedGPSAddressString || '';
      this.reachedGPSLocation = singleDutySingleBillForOutstation.reachedGPSLocation || '';
      this.tripStartDateTime = singleDutySingleBillForOutstation.tripStartDateTime;
      this.tripStartBy = singleDutySingleBillForOutstation.tripStartBy || '';
      this.tripStartMeterReading = singleDutySingleBillForOutstation.tripStartMeterReading || '';
      this.tripStartGPSAddressString =
        singleDutySingleBillForOutstation.tripStartGPSAddressString || '';
      this.tripStartGPSLocation = singleDutySingleBillForOutstation.tripStartGPSLocation || '';
      this.tripStartCalculatedKMByMeterReading =
        singleDutySingleBillForOutstation.tripStartCalculatedKMByMeterReading || '';
      this.tripStartCalculatedKMByGPS =
        singleDutySingleBillForOutstation.tripStartCalculatedKMByGPS || '';
      this.tripEndDateTime = singleDutySingleBillForOutstation.tripEndDateTime;
      this.tripEndBy = singleDutySingleBillForOutstation.tripEndBy || '';
      this.tripEndMeterReading = singleDutySingleBillForOutstation.tripEndMeterReading || '';
      this.tripEndGPSAddressString =
        singleDutySingleBillForOutstation.tripEndGPSAddressString || '';
      this.tripEndGPSLocation = singleDutySingleBillForOutstation.tripEndGPSLocation || '';
      this.tripEndCalculatedKMByMeterReading =
        singleDutySingleBillForOutstation.tripEndCalculatedKMByMeterReading || '';
      this.tripEndCalculatedKMByGPS =
        singleDutySingleBillForOutstation.tripEndCalculatedKMByGPS || '';
      this.garageInDateTime = singleDutySingleBillForOutstation.garageInDateTime;
      this.garageInBy = singleDutySingleBillForOutstation.garageInBy || '';
      this.garageInMeterReading = singleDutySingleBillForOutstation.garageInMeterReading || '';
      this.garageInGPSAddressString =
        singleDutySingleBillForOutstation.garageInGPSAddressString || '';
      this.garageInGPSLocation = singleDutySingleBillForOutstation.garageInGPSLocation || '';
      this.garageInCalculatedKMByMeterReading =
        singleDutySingleBillForOutstation.garageInCalculatedKMByMeterReading || '';
      this.garageInCalculatedKMByGPS =
        singleDutySingleBillForOutstation.garageInCalculatedKMByGPS || '';
    }
  }
}

