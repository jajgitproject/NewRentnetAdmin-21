// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutySlipLTRStatementModel {
  dutySlipLTRStatementID:number;
  dutySlipID:number;
  reservationID:number;
  guestName:string;
  dutyStartCityID: number;
  dutyStartCity: string;
  dutyStartAddress: string;
  dutyStartDate:Date;
  dutyStartDateString:string;
  dutyStartTime:Date;
  dutyStartTimeString:string;
  dutyStartKM:number;
  dutyEndCityID:number;
  dutyEndCity:string;
  dutyEndAddress:string;
  dutyEndDate:Date;
  dutyEndTime:Date;
  dutyEndDateString:string;
  dutyEndTimeString:string;
  dutyEndKM:number;
  totalKm:number;
  totalHours:number;
  packageKM:number;
  packageHours:number;
  packageBaseRate:number;
  extraKM:number;
  extraKMRate:number;
  extraKMAmount:number;
  extraHour:number;
  extraHourRate:number;
  extraHourAmount:number;
  totalToll:number;
  tollImages:string;
  totalParking:number;
  parkingImages:string;
  totalInterStateTax:number;
  interStateTaxImages:string;
  driverAllowanceRate:number;
  driverAllowanceAmount:number;
  nightChargeRate:number;
  nightChargeAmount:number;
  totalAmount:number;
  activationStatus: boolean;
  holiday:boolean;
  customerName:string;
  numberOfNights:number;
  numberOfDays:number;
  nightChargeable:boolean;
  fkmP2P:number;
  fixedP2PAmount:number;
  additionalKM:number;
  additionalMinutes:number;
  nightChargeStartTime:Date;
  nightChargeEndTime:Date;
  graceMinutesForNightCharge:number;
  graceMinutesNightChargeAmount:number;
  isHoliday:boolean;
  serialNumber:number;
  dayDifferences:number;


  pickupCity:string;
  pickupCityID:number;
  pickupAddress:string;
  pickupDate:Date;
  pickupTime:Date;
  dropOffSpotID:number;
  dropOffSpot:string;
  dropOffCity:string;
  dropOffCityID:number;
  dropOffAddress:string;
  dropOffDate:Date;
  dropOffTime:Date;
  driverAllowance:number;
  nightCharge:number;
  extraHRRate:number;
  dailyKM:number;
  dailyHours:number;
  totalDaysBaseRate:number;
  
  
  constructor(dutySlipLTRStatementModel) {
    {
      this.dutySlipLTRStatementID = dutySlipLTRStatementModel.dutySlipLTRStatementID || '';
      this.dutySlipID = dutySlipLTRStatementModel.dutySlipID || '';
      this.reservationID = dutySlipLTRStatementModel.reservationID || '';
      this.guestName = dutySlipLTRStatementModel.guestName || '';
      this.dutyStartCityID = dutySlipLTRStatementModel.dutyStartCityID || '';
      this.dutyStartCity=dutySlipLTRStatementModel.dutyStartCity || '';
      this.dutyStartAddress = dutySlipLTRStatementModel.dutyStartAddress || '';
      this.dutyStartDate = dutySlipLTRStatementModel.dutyStartDate || '';
      this.dutyStartTime = dutySlipLTRStatementModel.dutyStartTime || '';
      this.dutyStartKM = dutySlipLTRStatementModel.dutyStartKM || '';  
      this.dutyEndCityID = dutySlipLTRStatementModel.dutyEndCityID || '';
      this.dutyEndCity = dutySlipLTRStatementModel.dutyEndCity || '';
      this.dutyEndAddress = dutySlipLTRStatementModel.dutyEndAddress || '';
      this.dutyEndDate = dutySlipLTRStatementModel.dutyEndDate || '';
      this.dutyEndTime = dutySlipLTRStatementModel.dutyEndTime || '';
      this.dutyEndKM = dutySlipLTRStatementModel.dutyEndKM || '';
      this.totalKm = dutySlipLTRStatementModel.totalKm || '';
      this.totalHours = dutySlipLTRStatementModel.totalHours || '';
      this.packageKM = dutySlipLTRStatementModel.packageKM || '';
      this.packageHours = dutySlipLTRStatementModel.packageHours || '';
      this.packageBaseRate = dutySlipLTRStatementModel.packageBaseRate || '';
      this.extraKM = dutySlipLTRStatementModel.extraKM || '';
      this.extraKMRate = dutySlipLTRStatementModel.extraKMRate || '';
      this.extraKMAmount = dutySlipLTRStatementModel.extraKMAmount || '';
      this.extraHour = dutySlipLTRStatementModel.extraHour || '';
      this.extraHourRate = dutySlipLTRStatementModel.extraHourRate || '';
      this.extraHourAmount = dutySlipLTRStatementModel.extraHourAmount || '';
      this.totalToll = dutySlipLTRStatementModel.totalToll || '';
      this.tollImages = dutySlipLTRStatementModel.tollImages || '';
      this.totalParking = dutySlipLTRStatementModel.totalParking || '';
      this.parkingImages = dutySlipLTRStatementModel.parkingImages || '';
      this.totalInterStateTax = dutySlipLTRStatementModel.totalInterStateTax || '';
      this.interStateTaxImages = dutySlipLTRStatementModel.interStateTaxImages || '';
      this.driverAllowanceAmount = dutySlipLTRStatementModel.driverAllowanceAmount || '';
      this.nightChargeAmount = dutySlipLTRStatementModel.nightChargeAmount || '';
      this.totalAmount = dutySlipLTRStatementModel.totalAmount || '';
      this.activationStatus = dutySlipLTRStatementModel.activationStatus || '';
      this.numberOfNights = dutySlipLTRStatementModel.numberOfNights || '';
      this.numberOfDays = dutySlipLTRStatementModel.numberOfDays || '';
      this.additionalKM = dutySlipLTRStatementModel.additionalKM || '';
      this.additionalMinutes = dutySlipLTRStatementModel.additionalMinutes || '';

      this.dutyStartDate = new Date();
      this.dutyStartTime = new Date();
      this.dutyEndDate = new Date();
      this.dutyEndTime = new Date();
    }
  }
  
}

export class LTRDetailsModel 
{
  reservationID:number;
  customerName:string;
  pickupCity:string;
  pickupCityID:number;
  pickupAddress:string;
  pickupDate:Date;
  pickupTime:Date;
  dropOffSpotID:number;
  dropOffSpot:string;
  dropOffCity:string;
  dropOffCityID:number;
  dropOffAddress:string;
  dropOffDate:Date;
  dropOffTime:Date;  
}
