// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractCDCLocalRate {
  cdcLocalRateID: number;
  customerContractID: number;
  customerContractCarCategoryID:number;
  customerContractCityTiersID:number;
  packageID:number;
  billFromTo:string;
  minimumHours:number;
  minimumKM:number;
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
  packageJumpCriteria:string;
  nextPackageSelectionCriteria:string;
  graceMinutes:number;
  graceKM:number;
  tollChargeable:boolean;
  parkingChargeable:boolean;
  interStateTaxChargeable:boolean;  
  activationStatus:boolean;
  customerContractCityTier:string;
  customerContractCarCategory:string;
  package:string;
  vehicleCategory:string;
  cityTier:string;
  userID:number;
  nightChargesBasedOn:string;
 constructor(customerContractCDCLocalRate) {
   {
      this.cdcLocalRateID = customerContractCDCLocalRate.cdcLocalRateID || -1;
      this.customerContractID = customerContractCDCLocalRate.customerContractID || '';
      this.customerContractCarCategoryID = customerContractCDCLocalRate.customerContractCarCategoryID || '';
      this.customerContractCityTiersID = customerContractCDCLocalRate.customerContractCityTiersID || '';
      this.packageID = customerContractCDCLocalRate.packageID || '';
      this.billFromTo = customerContractCDCLocalRate.billFromTo || '';
      this.minimumHours = customerContractCDCLocalRate.minimumHours || '';
      this.minimumKM = customerContractCDCLocalRate.minimumKM || '';
      this.nightChargesBasedOn = customerContractCDCLocalRate.nightChargesBasedOn || '';
      this.billingOption = customerContractCDCLocalRate.billingOption || '';
      this.baseRate = customerContractCDCLocalRate.baseRate || '';
      this.baseRateForSupplier = customerContractCDCLocalRate.baseRateForSupplier || '';
      this.extraKMRate = customerContractCDCLocalRate.extraKMRate || '';
      this.extraKMRateForSupplier = customerContractCDCLocalRate.extraKMRateForSupplier || '';
      this.extraHRRate = customerContractCDCLocalRate.extraHRRate || '';
      this.extraHRRateForSupplier = customerContractCDCLocalRate.extraHRRateForSupplier || '';
      this.driverAllowance = customerContractCDCLocalRate.driverAllowance || '';
      this.driverAllowanceForSupplier = customerContractCDCLocalRate.driverAllowanceForSupplier || '';
      this.kMsPerExtraHR = customerContractCDCLocalRate.kMsPerExtraHR || '';
      this.nightChargeable = customerContractCDCLocalRate.nightChargeable || ''; 
      this.nightCharge = customerContractCDCLocalRate.nightCharge || '';
      this.nightChargeForSupplier = customerContractCDCLocalRate.nightChargeForSupplier || '';
      this.nightChargesStartTimeString = customerContractCDCLocalRate.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = customerContractCDCLocalRate.nightChargesEndTimeString || ''; 
      this.graceMinutesForNightCharge = customerContractCDCLocalRate.graceMinutesForNightCharge || '';
      this.graceMinutesNightChargeAmount = customerContractCDCLocalRate.graceMinutesNightChargeAmount || '';    
      this.fkmP2P = customerContractCDCLocalRate.fkmP2P || '';
      this.fixedP2PAmount = customerContractCDCLocalRate.fixedP2PAmount || '';
      this.additionalKM = customerContractCDCLocalRate.additionalKM || '';
      this.additionalMinutes = customerContractCDCLocalRate.additionalMinutes || '';
      this.packageJumpCriteria = customerContractCDCLocalRate.packageJumpCriteria || '';
      this.nextPackageSelectionCriteria = customerContractCDCLocalRate.nextPackageSelectionCriteria || '';
      this.graceMinutes = customerContractCDCLocalRate.graceMinutes || '';
      this.graceKM = customerContractCDCLocalRate.graceKM || '';
      this.tollChargeable = customerContractCDCLocalRate.tollChargeable || '';
      this.parkingChargeable = customerContractCDCLocalRate.parkingChargeable || '';
      this.interStateTaxChargeable = customerContractCDCLocalRate.interStateTaxChargeable || '';
      this.activationStatus = customerContractCDCLocalRate.activationStatus || '';     
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}
