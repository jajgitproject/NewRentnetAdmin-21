// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorLongTermRentalRateModel {
  vendorLongTermRentalRateID: number;
  vendorContractID: number;
  vendorContractCarCategoryID:number;
  vendorContractCityTiersID:number;
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
  vendorContractCarCategory:string;
  vendorContractCityTier:string;
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

 constructor(vendorLongTermRentalRateModel) {
   {
      this.vendorLongTermRentalRateID = vendorLongTermRentalRateModel.vendorLongTermRentalRateID || -1;
      this.vendorContractID = vendorLongTermRentalRateModel.vendorContractID || '';
      this.vendorContractCarCategoryID = vendorLongTermRentalRateModel.vendorContractCarCategoryID || '';
      this.vendorContractCityTiersID = vendorLongTermRentalRateModel.vendorContractCityTiersID || '';
      this.packageID = vendorLongTermRentalRateModel.packageID || '';
      this.billFromTo = vendorLongTermRentalRateModel.billFromTo || '';
       this.nightChargesBasedOn = vendorLongTermRentalRateModel.nightChargesBasedOn || '';
      this.billingCriteria = vendorLongTermRentalRateModel.billingCriteria || '';
      this.dailyHours = vendorLongTermRentalRateModel.dailyHours || '';
      this.dailyKM = vendorLongTermRentalRateModel.dailyKM || '';
      this.monthlyHours = vendorLongTermRentalRateModel.monthlyHours || '';
      this.monthlyKMs = vendorLongTermRentalRateModel.monthlyKMs || '';
      this.totalDays = vendorLongTermRentalRateModel.totalDays || '';
      this.graceMinutes = vendorLongTermRentalRateModel.graceMinutes || '';
      this.graceKM = vendorLongTermRentalRateModel.graceKM || '';
      this.totalDaysBaseRate = vendorLongTermRentalRateModel.totalDaysBaseRate || '';
      this.totalDaysBaseRateForSupplier = vendorLongTermRentalRateModel.totalDaysBaseRateForSupplier || '';
      this.dailyBaseRate = vendorLongTermRentalRateModel.dailyBaseRate || '';
      this.dailyBaseRateForSupplier = vendorLongTermRentalRateModel.dailyBaseRateForSupplier || '';

      this.extraKMRate = vendorLongTermRentalRateModel.extraKMRate || '';
      this.extraKMRateForSupplier = vendorLongTermRentalRateModel.extraKMRateForSupplier || '';
      this.extraHRRate = vendorLongTermRentalRateModel.extraHRRate || '';
      this.extraHRRateForSupplier = vendorLongTermRentalRateModel.extraHRRateForSupplier || '';
      this.driverAllowance = vendorLongTermRentalRateModel.driverAllowance || '';
      this.driverAllowanceForSupplier = vendorLongTermRentalRateModel.driverAllowanceForSupplier || '';
      this.kMsPerExtraHR = vendorLongTermRentalRateModel.kMsPerExtraHR || '';
      this.nightChargeable = vendorLongTermRentalRateModel.nightChargeable || ''; 
      this.nightCharge = vendorLongTermRentalRateModel.nightCharge || '';
      this.nightChargeForSupplier = vendorLongTermRentalRateModel.nightChargeForSupplier || 0;
      this.nightChargesStartTimeString = vendorLongTermRentalRateModel.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = vendorLongTermRentalRateModel.nightChargesEndTimeString || ''; 
      this.graceMinutesForNightCharge = vendorLongTermRentalRateModel.graceMinutesForNightCharge || 0;
      this.graceMinutesNightChargeAmount = vendorLongTermRentalRateModel.graceMinutesNightChargeAmount || 0;    
      this.fkmP2P = vendorLongTermRentalRateModel.fkmP2P || 0;
      this.fixedP2PAmount = vendorLongTermRentalRateModel.fixedP2PAmount || 0;
      this.additionalKM = vendorLongTermRentalRateModel.additionalKM || 0;
      this.additionalMinutes = vendorLongTermRentalRateModel.additionalMinutes || 0;

      this.tollChargeable = vendorLongTermRentalRateModel.tollChargeable || '';
      this.parkingChargeable = vendorLongTermRentalRateModel.parkingChargeable || '';
      this.interStateChargeable = vendorLongTermRentalRateModel.interStateChargeable || '';
      this.activationStatus = vendorLongTermRentalRateModel.activationStatus || '';     
    
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

