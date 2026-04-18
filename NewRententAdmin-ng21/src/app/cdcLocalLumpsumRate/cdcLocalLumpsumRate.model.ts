// @ts-nocheck
import { formatDate } from '@angular/common';
export class CDCLocalLumpsumRate {
  cdcLocalLumpsumRateID: number;
  customerContractID: number;
  customerContractCarCategoryID:number;
  customerContractCityTiersID:number;
  packageID:number;
  billFromTo:string;
  minimumHours:number;
  minimumKM:number;
  minDays:number;
  billingOption:string;
  baseRate:number;
  baseRateForSupplier:number;
  extraKMRate:number;
  extraKMRateForSupplier:number;
  extraHRRate:number;
  extraHRRateForSupplier:number;
  driverAllowance:number;
  driverAllowanceForSupplier:number;
  kMsPerExtraHR:number;
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
  customerContractCarCategory:string;
  customerContractCityTier:string;
  package:string;
  vehicleCategory:string;
  cityTier:string;
userID:number;
nightChargesBasedOn:string;
 constructor(cdcLocalLumpsumRate) {
   {
      this.cdcLocalLumpsumRateID = cdcLocalLumpsumRate.cdcLocalLumpsumRateID || -1;
      this.customerContractID = cdcLocalLumpsumRate.customerContractID || '';
      this.customerContractCarCategoryID = cdcLocalLumpsumRate.customerContractCarCategoryID || '';
      this.customerContractCityTiersID = cdcLocalLumpsumRate.customerContractCityTiersID || '';
      this.packageID = cdcLocalLumpsumRate.packageID || '';
      this.billFromTo = cdcLocalLumpsumRate.billFromTo || '';
      this.minimumHours = cdcLocalLumpsumRate.minimumHours || '';
      this.nightChargesBasedOn = cdcLocalLumpsumRate.nightChargesBasedOn || '';
      this.minimumKM = cdcLocalLumpsumRate.minimumKM || '';
      this.minDays = cdcLocalLumpsumRate.minDays || '';
      this.billingOption = cdcLocalLumpsumRate.billingOption || '';
      this.baseRate = cdcLocalLumpsumRate.baseRate || '';
      this.baseRateForSupplier = cdcLocalLumpsumRate.baseRateForSupplier || '';
      this.extraKMRate = cdcLocalLumpsumRate.extraKMRate || '';
      this.extraKMRateForSupplier = cdcLocalLumpsumRate.extraKMRateForSupplier || '';
      this.extraHRRate = cdcLocalLumpsumRate.extraHRRate || '';
      this.extraHRRateForSupplier = cdcLocalLumpsumRate.extraHRRateForSupplier || '';
      this.driverAllowance = cdcLocalLumpsumRate.driverAllowance || '';
      this.driverAllowanceForSupplier = cdcLocalLumpsumRate.driverAllowanceForSupplier || '';
      this.kMsPerExtraHR = cdcLocalLumpsumRate.kMsPerExtraHR || '';
      this.nightChargeable = cdcLocalLumpsumRate.nightChargeable || ''; 
      this.nightCharge = cdcLocalLumpsumRate.nightCharge || '';
      this.nightChargeForSupplier = cdcLocalLumpsumRate.nightChargeForSupplier || '';
      this.nightChargesStartTimeString = cdcLocalLumpsumRate.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = cdcLocalLumpsumRate.nightChargesEndTimeString || ''; 
      this.graceMinutesForNightCharge = cdcLocalLumpsumRate.graceMinutesForNightCharge || 0;
      this.graceMinutesNightChargeAmount = cdcLocalLumpsumRate.graceMinutesNightChargeAmount || 0;    
      this.fkmP2P = cdcLocalLumpsumRate.fkmP2P || 0;
      this.fixedP2PAmount = cdcLocalLumpsumRate.fixedP2PAmount || 0;
      this.additionalKM = cdcLocalLumpsumRate.additionalKM || 0;
      this.additionalMinutes = cdcLocalLumpsumRate.additionalMinutes || 0;
      this.graceMinutes = cdcLocalLumpsumRate.graceMinutes || '';
      this.graceKM = cdcLocalLumpsumRate.graceKM || '';
      this.tollChargeable = cdcLocalLumpsumRate.tollChargeable || '';
      this.parkingChargeable = cdcLocalLumpsumRate.parkingChargeable || '';
      this.interStateChargeable = cdcLocalLumpsumRate.interStateChargeable || '';
      this.activationStatus = cdcLocalLumpsumRate.activationStatus || '';     
    
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

