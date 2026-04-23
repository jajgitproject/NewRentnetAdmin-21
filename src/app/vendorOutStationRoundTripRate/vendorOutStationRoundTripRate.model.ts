// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorOutStationRoundTripRate {
  vendorOutStationRoundTripRateID: number;
 vendorContractID: number;
  customerContractCarCategoryID:number;
  customerContractCityTiersID:number;
   vendorContractCarCategoryID:number;
  vendorContractCityTiersID:number;
  vendorContractCarCategory:string;
  vendorContractCityTier:string;
  packageID:number;
  billFromTo:string;
  minimumKmsPerDay:number;
  ratePerDay:number;
  ratePerDayForSupplier:number;
  extraKmsRate:number;
  extraKmsRateForSupplier:number;
  nextDayCharging:string;
  graceMinutesForNextDayCharges:number;
  driverAllowance:number;
  driverAllowanceForSupplier:number;
  nightChargeable:boolean;
  nightCharge:number;
  nightChargeForSupplier:number;
  nightChargesStartTime:Date;
  nightChargesStartTimeString:string;
  nightChargesEndTime:Date;
  nightChargesEndTimeString:string; 
  graceMinutesForNightCharge:number;
  graceMinutesNightChargeAmount:number;
  additionalKM:number;
  additionalMinutes:number;
  tollChargeable:boolean;
  parkingChargeable:boolean;
  interStateChargeable:boolean;  
  activationStatus:boolean;
  customerContractCarCategory:string;
  customerContractCityTier:string;
  package:string;
  vehicleCategory:string;
  cityTier:string;
 
  userID:number;
  
nightChargesBasedOn:string;



 constructor(vendorOutStationRoundTripRate) {
   {
      this.vendorOutStationRoundTripRateID = vendorOutStationRoundTripRate.vendorOutStationRoundTripRateID || -1;
      this.vendorContractID = vendorOutStationRoundTripRate.vendorContractID || '';
      this.customerContractCarCategoryID = vendorOutStationRoundTripRate.customerContractCarCategoryID || '';
      this.customerContractCityTiersID = vendorOutStationRoundTripRate.customerContractCityTiersID || '';
       this.customerContractCarCategoryID = vendorOutStationRoundTripRate.customerContractCarCategoryID || '';
      this.vendorContractCarCategory = vendorOutStationRoundTripRate.vendorContractCarCategory || '';
          this.vendorContractCityTier = vendorOutStationRoundTripRate.vendorContractCityTier || '';
      this.vendorContractCityTiersID = vendorOutStationRoundTripRate.vendorContractCityTiersID || '';
      this.packageID = vendorOutStationRoundTripRate.packageID || '';
      this.billFromTo = vendorOutStationRoundTripRate.billFromTo || '';
      this.minimumKmsPerDay = vendorOutStationRoundTripRate.minimumKmsPerDay || '';
      this.ratePerDay = vendorOutStationRoundTripRate.ratePerDay || '';
       this.nightChargesBasedOn = vendorOutStationRoundTripRate.nightChargesBasedOn || '';
      this.ratePerDayForSupplier = vendorOutStationRoundTripRate.ratePerDayForSupplier || '';
      this.extraKmsRate = vendorOutStationRoundTripRate.extraKmsRate || '';
      this.extraKmsRateForSupplier = vendorOutStationRoundTripRate.extraKmsRateForSupplier || '';
      this.nextDayCharging = vendorOutStationRoundTripRate.nextDayCharging || '';
      this.graceMinutesForNextDayCharges = vendorOutStationRoundTripRate.graceMinutesForNextDayCharges || '';

      this.driverAllowance = vendorOutStationRoundTripRate.driverAllowance || '';
      this.driverAllowanceForSupplier = vendorOutStationRoundTripRate.driverAllowanceForSupplier || '';
      this.nightChargeable = vendorOutStationRoundTripRate.nightChargeable || ''; 
      this.nightCharge = vendorOutStationRoundTripRate.nightCharge || '';
      this.nightChargeForSupplier = vendorOutStationRoundTripRate.nightChargeForSupplier || '';
      this.nightChargesStartTimeString = vendorOutStationRoundTripRate.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = vendorOutStationRoundTripRate.nightChargesEndTimeString || ''; 
      this.graceMinutesForNightCharge = vendorOutStationRoundTripRate.graceMinutesForNightCharge || 0;
      this.graceMinutesNightChargeAmount = vendorOutStationRoundTripRate.graceMinutesNightChargeAmount || 0;    
      this.additionalKM = vendorOutStationRoundTripRate.additionalKM || 0;
      this.additionalMinutes = vendorOutStationRoundTripRate.additionalMinutes || 0;
      this.tollChargeable = vendorOutStationRoundTripRate.tollChargeable || '';
      this.parkingChargeable = vendorOutStationRoundTripRate.parkingChargeable || '';
      this.interStateChargeable = vendorOutStationRoundTripRate.interStateChargeable || '';
      this.activationStatus = vendorOutStationRoundTripRate.activationStatus || '';     
    
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

