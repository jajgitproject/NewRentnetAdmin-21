// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutySlipAccentureModel {  
  dutySlipID:number;
  reservationID:number;
  manualDutySlipNumber:string;
  locationOutDate:string;
  locationOutTime:string;
  locationOutKM:number;
  reportingToGuestDate:string;
  reportingToGuestTime:string;
  reportingToGuestKM:number;
  pickUpDate:string;
  pickUpTime:string;
  pickUpKM:number;
  dropOffDate:string;
  dropOffTime:string;
  dropOffKM:number ;
  locationInDate:string;
  locationInTime:string;
  locationInKM:number;
  runningDetails:string;
  tripStartODOMeterImage:string;
  tripEndODOMeterImaget
  registrationNumber:string;
  driverName:string;
  mobile1:string;
  startTripOTP:number;
  endTripOTP:number;
  tripType:string;
  dutySlipType:string;
  printRunningDetailOnDutySlip:string;
  showRateOnDutySlip:string;
  showOTPOnDutySlip:string;
  tripTo:string;
  specialInstruction:string;
  customerName:string;
  customerType:string;
  keyAccountManagerName:string;
  keyAccountManagerMobile:string;
  bookerName:string;
  passengerName:string;
  passengerMobile:string;
  pickupCity:string;
  vehicleSent:string;
  vehicleBooked:string;
  package:string;
  packageType:string;
  transferedLocation:string;
  modeOfPayment:string;
  ecoCompany:string;
  packageDetails:PackageDetailModel[];
}

export class PackageDetailModel
{
  packageName:string;
  packageRate:number;
  extraHourRate:number;
  extraKmRate:number;
}

