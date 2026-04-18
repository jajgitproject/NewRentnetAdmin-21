// @ts-nocheck
import { formatDate } from '@angular/common';
export class CDCLocalOnDemandRate {
  cdcLocalOnDemandRateID: number;
  customerContractID: number;
  customerContractCarCategoryID:number;
  customerContractCityTiersID:number;
  packageID:number;
  billFromTo:string;
  gpsPerKMRate:string;
  gpsPerKMRateForSupplier:string;
  perMinuteRate:string;
  perMinuteRateForSupplier:string;
  freeMinutes:string;
  customerContractCarCategory:string;
  customerContractCityTier:string;
  package:string;
  baseRate:number;
  baseRateForSupplier:number;
  extraKMRate:number;
  extraKMRateForSupplier:number;
  extraHRRate:number;
  extraHRRateForSupplier:number;
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
  fkmP2P:number;
  fixedP2PAmount:number;
  additionalKM:number;
  additionalMinutes:number;
  graceMinutes:number;
  graceKM:number;
  tollChargeable:boolean;
  parkingChargeable:boolean;
  interStateChargeable:boolean;  
  activationStatus:boolean;
  vehicleCategory:string;
  cityTier:string;
  userID:number;
  nightChargesBasedOn:string;
 constructor(cdcLocalOnDemandRate) {
   {
      this.cdcLocalOnDemandRateID = cdcLocalOnDemandRate.cdcLocalOnDemandRateID || -1;
      this.customerContractID = cdcLocalOnDemandRate.customerContractID || '';
      this.customerContractCarCategoryID = cdcLocalOnDemandRate.customerContractCarCategoryID || '';
      this.customerContractCityTiersID = cdcLocalOnDemandRate.customerContractCityTiersID || '';
      this.packageID = cdcLocalOnDemandRate.packageID || '';
      this.billFromTo = cdcLocalOnDemandRate.billFromTo || '';
      this.nightChargesBasedOn = cdcLocalOnDemandRate.nightChargesBasedOn || '';
      this.gpsPerKMRate = cdcLocalOnDemandRate.gpsPerKMRate || '';
      this.gpsPerKMRateForSupplier = cdcLocalOnDemandRate.gpsPerKMRateForSupplier || '';
      this.perMinuteRate = cdcLocalOnDemandRate.perMinuteRate || '';
      this.perMinuteRateForSupplier = cdcLocalOnDemandRate.perMinuteRateForSupplier || '';
      this.freeMinutes = cdcLocalOnDemandRate.freeMinutes || '';
      this.baseRate = cdcLocalOnDemandRate.baseRate || '';
      this.baseRateForSupplier = cdcLocalOnDemandRate.baseRateForSupplier || '';
      this.extraKMRate = cdcLocalOnDemandRate.extraKMRate || '';
      this.extraKMRateForSupplier = cdcLocalOnDemandRate.extraKMRateForSupplier || '';
      this.extraHRRate = cdcLocalOnDemandRate.extraHRRate || '';
      this.extraHRRateForSupplier = cdcLocalOnDemandRate.extraHRRateForSupplier || '';
      this.driverAllowance = cdcLocalOnDemandRate.driverAllowance || '';
      this.driverAllowanceForSupplier = cdcLocalOnDemandRate.driverAllowanceForSupplier || '';
      this.nightChargeable = cdcLocalOnDemandRate.nightChargeable || ''; 
      this.nightCharge = cdcLocalOnDemandRate.nightCharge || '';
      this.nightChargeForSupplier = cdcLocalOnDemandRate.nightChargeForSupplier || '';
      this.nightChargesStartTimeString = cdcLocalOnDemandRate.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = cdcLocalOnDemandRate.nightChargesEndTimeString || ''; 
      this.graceMinutesForNightCharge = cdcLocalOnDemandRate.graceMinutesForNightCharge || 0;
      this.graceMinutesNightChargeAmount = cdcLocalOnDemandRate.graceMinutesNightChargeAmount || 0;    
      this.fkmP2P = cdcLocalOnDemandRate.fkmP2P || 0;
      this.fixedP2PAmount = cdcLocalOnDemandRate.fixedP2PAmount || 0;
      this.additionalKM = cdcLocalOnDemandRate.additionalKM || 0;
      this.additionalMinutes = cdcLocalOnDemandRate.additionalMinutes || 0;
      this.graceMinutes = cdcLocalOnDemandRate.graceMinutes || '';
      this.graceKM = cdcLocalOnDemandRate.graceKM || '';
      this.tollChargeable = cdcLocalOnDemandRate.tollChargeable || '';
      this.parkingChargeable = cdcLocalOnDemandRate.parkingChargeable || '';
      this.interStateChargeable = cdcLocalOnDemandRate.interStateChargeable || '';
      this.activationStatus = cdcLocalOnDemandRate.activationStatus || '';     
    
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

