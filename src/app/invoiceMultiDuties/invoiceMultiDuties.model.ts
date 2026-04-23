// @ts-nocheck
import { formatDate } from '@angular/common';
export class InvoiceMultiDuties {
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
  constructor(printDutySlip) {
    {
      this.dutySlipID = printDutySlip.dutySlipID || -1;
      this.reservationID = printDutySlip.reservationID || -1;
      this.reservationCarDriverID = printDutySlip.reservationCarDriverID || -1;
      this.passengerName = printDutySlip.passengerName || '';
      this.passengerMobile = printDutySlip.passengerMobile || '';
      this.vehicle = printDutySlip.vehicle || '';
      this.vehicleRegistrationNumber =
        printDutySlip.vehicleRegistrationNumber || '';
      this.driverName = printDutySlip.driverName || '';
      this.driverMobile = printDutySlip.driverMobile || '';
      this.stopDate = printDutySlip.stopDate || '';
      this.stopTime = printDutySlip.stopTime || '';
      this.stopAddress = printDutySlip.stopAddress || '';
      this.stopCityID = printDutySlip.stopCityID;
      this.city = printDutySlip.city || '';
      this.state = printDutySlip.state || '';
      this.country = printDutySlip.country || '';
      this.stopAddressGeoLocation = printDutySlip.stopAddressGeoLocation || '';
      this.stopLongitude = printDutySlip.stopLongitude || '';
      this.stopLatitude = printDutySlip.stopLatitude || '';
      this.garageOutBy = printDutySlip.garageOutBy || -1;
      this.garageOutByName = printDutySlip.garageOutBy || '';
      this.garageOutMeterReading = printDutySlip.garageOutMeterReading || '';
      this.garageOutGPSAddressString =
        printDutySlip.garageOutGPSAddressString || '';
      this.garageOutGPSLocation = printDutySlip.garageOutGPSLocation || '';
      this.dutyStatus = printDutySlip.dutyStatus || '';
      this.tripSuccessStatus = printDutySlip.tripSuccessStatus || '';
      this.actionType = printDutySlip.actionType || '';
      this.garageOutDateTime = new Date();
      this.dispute_BreakdownDateTime = printDutySlip.dispute_BreakdownDateTime;
      this.dispute_BreakdownBy = printDutySlip.dispute_BreakdownBy || '';
      this.dispute_BreakdownByName =
        printDutySlip.dispute_BreakdownByName || '';
      this.dispute_BreakdownMeterReading =
        printDutySlip.dispute_BreakdownMeterReading || '';
      this.dispute_BreakdownGPSAddressString =
        printDutySlip.dispute_BreakdownGPSAddressString || '';
      this.dispute_BreakdownGPSLocation =
        printDutySlip.dispute_BreakdownGPSLocation || '';
      this.dispute_BreakdownCalculatedKMByMeterReading =
        printDutySlip.dispute_BreakdownCalculatedKMByMeterReading || '';
      this.dispute_BreakdownCalculatedKMByGPS =
        printDutySlip.dispute_BreakdownCalculatedKMByGPS || '';
      this.dispute_BreakdownDetails =
        printDutySlip.dispute_BreakdownDetails || '';
      this.dispute_BreakdownResolution =
        printDutySlip.dispute_BreakdownResolution || '';

      this.reachedDateTime = printDutySlip.reachedDateTime;
      this.reachedBy = printDutySlip.reachedBy || '';
      this.reachedGPSAddressString =
        printDutySlip.reachedGPSAddressString || '';
      this.reachedGPSLocation = printDutySlip.reachedGPSLocation || '';
      this.tripStartDateTime = printDutySlip.tripStartDateTime;
      this.tripStartBy = printDutySlip.tripStartBy || '';
      this.tripStartMeterReading = printDutySlip.tripStartMeterReading || '';
      this.tripStartGPSAddressString =
        printDutySlip.tripStartGPSAddressString || '';
      this.tripStartGPSLocation = printDutySlip.tripStartGPSLocation || '';
      this.tripStartCalculatedKMByMeterReading =
        printDutySlip.tripStartCalculatedKMByMeterReading || '';
      this.tripStartCalculatedKMByGPS =
        printDutySlip.tripStartCalculatedKMByGPS || '';
      this.tripEndDateTime = printDutySlip.tripEndDateTime;
      this.tripEndBy = printDutySlip.tripEndBy || '';
      this.tripEndMeterReading = printDutySlip.tripEndMeterReading || '';
      this.tripEndGPSAddressString =
        printDutySlip.tripEndGPSAddressString || '';
      this.tripEndGPSLocation = printDutySlip.tripEndGPSLocation || '';
      this.tripEndCalculatedKMByMeterReading =
        printDutySlip.tripEndCalculatedKMByMeterReading || '';
      this.tripEndCalculatedKMByGPS =
        printDutySlip.tripEndCalculatedKMByGPS || '';
      this.garageInDateTime = printDutySlip.garageInDateTime;
      this.garageInBy = printDutySlip.garageInBy || '';
      this.garageInMeterReading = printDutySlip.garageInMeterReading || '';
      this.garageInGPSAddressString =
        printDutySlip.garageInGPSAddressString || '';
      this.garageInGPSLocation = printDutySlip.garageInGPSLocation || '';
      this.garageInCalculatedKMByMeterReading =
        printDutySlip.garageInCalculatedKMByMeterReading || '';
      this.garageInCalculatedKMByGPS =
        printDutySlip.garageInCalculatedKMByGPS || '';
       
        this.pickupCity = printDutySlip.pickupCity || '';
    }
  }
}

