// @ts-nocheck
import { formatDate } from '@angular/common';
export class CDCLongTermRentalRate {
  cdcLongTermRentalRateID: number;
  customerContractID: number;
  customerContractCarCategoryID:number;
  customerContractCityTiersID:number;
  packageID:number;
  billFromTo:string;

  billingCriteria:string;
  dailyHours:number;
  dailyKM:number;
  monthlyHours:number;
  monthlyKMs:string;
  totalDays:number;
  graceMinutes:number;
  graceKM:number;
  totalDaysBaseRate:number;
  totalDaysBaseRateForSupplier:number;
  dailyBaseRateForSupplier:number;
  dailyBaseRate:number;
  customerContractCarCategory:string;
  customerContractCityTier:string;
  package:string;

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
 
  tollChargeable:boolean;
  parkingChargeable:boolean;
  interStateChargeable:boolean;  
  activationStatus:boolean;
  vehicleCategory:string;
  cityTier:string;
 userID:number;
 nightChargesBasedOn:string;

 constructor(cdcLongTermRentalRate) {
   {
      this.cdcLongTermRentalRateID = cdcLongTermRentalRate.cdcLongTermRentalRateID || -1;
      this.customerContractID = cdcLongTermRentalRate.customerContractID || '';
      this.customerContractCarCategoryID = cdcLongTermRentalRate.customerContractCarCategoryID || '';
      this.customerContractCityTiersID = cdcLongTermRentalRate.customerContractCityTiersID || '';
      this.packageID = cdcLongTermRentalRate.packageID || '';
      this.billFromTo = cdcLongTermRentalRate.billFromTo || '';
       this.nightChargesBasedOn = cdcLongTermRentalRate.nightChargesBasedOn || '';
      this.billingCriteria = cdcLongTermRentalRate.billingCriteria || '';
      this.dailyHours = cdcLongTermRentalRate.dailyHours || '';
      this.dailyKM = cdcLongTermRentalRate.dailyKM || '';
      this.monthlyHours = cdcLongTermRentalRate.monthlyHours || '';
      this.monthlyKMs = cdcLongTermRentalRate.monthlyKMs || '';
      this.totalDays = cdcLongTermRentalRate.totalDays || '';
      this.graceMinutes = cdcLongTermRentalRate.graceMinutes || '';
      this.graceKM = cdcLongTermRentalRate.graceKM || '';
      this.totalDaysBaseRate = cdcLongTermRentalRate.totalDaysBaseRate || '';
      this.totalDaysBaseRateForSupplier = cdcLongTermRentalRate.totalDaysBaseRateForSupplier || '';
      this.dailyBaseRate = cdcLongTermRentalRate.dailyBaseRate || '';
      this.dailyBaseRateForSupplier = cdcLongTermRentalRate.dailyBaseRateForSupplier || '';

      this.extraKMRate = cdcLongTermRentalRate.extraKMRate || '';
      this.extraKMRateForSupplier = cdcLongTermRentalRate.extraKMRateForSupplier || '';
      this.extraHRRate = cdcLongTermRentalRate.extraHRRate || '';
      this.extraHRRateForSupplier = cdcLongTermRentalRate.extraHRRateForSupplier || '';
      this.driverAllowance = cdcLongTermRentalRate.driverAllowance || '';
      this.driverAllowanceForSupplier = cdcLongTermRentalRate.driverAllowanceForSupplier || '';
      this.kMsPerExtraHR = cdcLongTermRentalRate.kMsPerExtraHR || '';
      this.nightChargeable = cdcLongTermRentalRate.nightChargeable || ''; 
      this.nightCharge = cdcLongTermRentalRate.nightCharge || '';
      this.nightChargeForSupplier = cdcLongTermRentalRate.nightChargeForSupplier || 0;
      this.nightChargesStartTimeString = cdcLongTermRentalRate.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = cdcLongTermRentalRate.nightChargesEndTimeString || ''; 
      this.graceMinutesForNightCharge = cdcLongTermRentalRate.graceMinutesForNightCharge || 0;
      this.graceMinutesNightChargeAmount = cdcLongTermRentalRate.graceMinutesNightChargeAmount || 0;    
      this.fkmP2P = cdcLongTermRentalRate.fkmP2P || 0;
      this.fixedP2PAmount = cdcLongTermRentalRate.fixedP2PAmount || 0;
      this.additionalKM = cdcLongTermRentalRate.additionalKM || 0;
      this.additionalMinutes = cdcLongTermRentalRate.additionalMinutes || 0;

      this.tollChargeable = cdcLongTermRentalRate.tollChargeable || '';
      this.parkingChargeable = cdcLongTermRentalRate.parkingChargeable || '';
      this.interStateChargeable = cdcLongTermRentalRate.interStateChargeable || '';
      this.activationStatus = cdcLongTermRentalRate.activationStatus || '';     
    
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

