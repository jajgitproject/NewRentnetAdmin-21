// @ts-nocheck
import { formatDate } from '@angular/common';
export class CDCOutStationRoundTripRate {
  cdcOutStationRoundTripRateID: number;
  customerContractID: number;
  customerContractCarCategoryID:number;
  customerContractCityTiersID:number;
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




 constructor(cdcOutStationRoundTripRate) {
   {
      this.cdcOutStationRoundTripRateID = cdcOutStationRoundTripRate.cdcOutStationRoundTripRateID || -1;
      this.customerContractID = cdcOutStationRoundTripRate.customerContractID || '';
      this.customerContractCarCategoryID = cdcOutStationRoundTripRate.customerContractCarCategoryID || '';
      this.customerContractCityTiersID = cdcOutStationRoundTripRate.customerContractCityTiersID || '';
      this.packageID = cdcOutStationRoundTripRate.packageID || '';
      this.billFromTo = cdcOutStationRoundTripRate.billFromTo || '';
      this.minimumKmsPerDay = cdcOutStationRoundTripRate.minimumKmsPerDay || '';
      this.ratePerDay = cdcOutStationRoundTripRate.ratePerDay || '';
       this.nightChargesBasedOn = cdcOutStationRoundTripRate.nightChargesBasedOn || '';
      this.ratePerDayForSupplier = cdcOutStationRoundTripRate.ratePerDayForSupplier || '';
      this.extraKmsRate = cdcOutStationRoundTripRate.extraKmsRate || '';
      this.extraKmsRateForSupplier = cdcOutStationRoundTripRate.extraKmsRateForSupplier || '';
      this.nextDayCharging = cdcOutStationRoundTripRate.nextDayCharging || '';
      this.graceMinutesForNextDayCharges = cdcOutStationRoundTripRate.graceMinutesForNextDayCharges || '';

      this.driverAllowance = cdcOutStationRoundTripRate.driverAllowance || '';
      this.driverAllowanceForSupplier = cdcOutStationRoundTripRate.driverAllowanceForSupplier || '';
      this.nightChargeable = cdcOutStationRoundTripRate.nightChargeable || ''; 
      this.nightCharge = cdcOutStationRoundTripRate.nightCharge || '';
      this.nightChargeForSupplier = cdcOutStationRoundTripRate.nightChargeForSupplier || '';
      this.nightChargesStartTimeString = cdcOutStationRoundTripRate.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = cdcOutStationRoundTripRate.nightChargesEndTimeString || ''; 
      this.graceMinutesForNightCharge = cdcOutStationRoundTripRate.graceMinutesForNightCharge || 0;
      this.graceMinutesNightChargeAmount = cdcOutStationRoundTripRate.graceMinutesNightChargeAmount || 0;    
      this.additionalKM = cdcOutStationRoundTripRate.additionalKM || 0;
      this.additionalMinutes = cdcOutStationRoundTripRate.additionalMinutes || 0;
      this.tollChargeable = cdcOutStationRoundTripRate.tollChargeable || '';
      this.parkingChargeable = cdcOutStationRoundTripRate.parkingChargeable || '';
      this.interStateChargeable = cdcOutStationRoundTripRate.interStateChargeable || '';
      this.activationStatus = cdcOutStationRoundTripRate.activationStatus || '';     
    
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

