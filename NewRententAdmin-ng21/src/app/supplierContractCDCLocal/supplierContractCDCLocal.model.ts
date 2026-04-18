// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCDCLocal {
  supplierContractCDCLocalID: number;
  userID:number;
  supplierContractID: number;
  vehicleCategoryID:number;
  cityTierID:number;
  packageID:number;
  package:string;
  billFromTo:string;
  minimumHours:number;
  minimumKMs:number;
  baseRate:number;
  billingOption:string;
  extraKMRate:number;
  extraHRRate:number;
  kMsPerExtraHR:number;
  driverAllowance:number;
  nightChargesStartTime:Date;
  nightChargesStartTimeString:string;
  nightChargesEndTime:Date;
  nightChargesEndTimeString:string;
  nightCharge:number;
  graceMinutesForNightCharge:number;
  graceMinutesNightCharge:number;
  fkmP2P:number;
  fixedP2PAmount:number;
  additionalKM:number;
  additionalHR:number;
  packageJumpCriteria:string;
  nextPackageSelectionCriteria:string;
  packageGraceMinutes:number;
  packageGraceKMs:number;
  tollChargeable:boolean;
  parkingChargeable:boolean;
  interStateTaxChargeable:boolean; 
  nightChargeable:boolean;
  activationStatus:boolean;
  vehicleCategory:string;
  cityTier:string;

 constructor(supplierContractCDCLocal) {
   {
      this.supplierContractCDCLocalID = supplierContractCDCLocal.supplierContractCDCLocalID || -1;
      this.supplierContractID = supplierContractCDCLocal.supplierContractID || '';
      this.vehicleCategoryID = supplierContractCDCLocal.vehicleCategoryID || '';
      this.cityTierID = supplierContractCDCLocal.cityTierID || '';
      this.packageID = supplierContractCDCLocal.packageID || '';
      this.package = supplierContractCDCLocal.package || '';
      this.billFromTo = supplierContractCDCLocal.billFromTo || '';
      this.minimumHours = supplierContractCDCLocal.minimumHours || '';
      this.minimumKMs = supplierContractCDCLocal.minimumKMs || '';
      this.baseRate = supplierContractCDCLocal.baseRate || '';
      this.billingOption = supplierContractCDCLocal.billingOption || '';
      this.extraKMRate = supplierContractCDCLocal.extraKMRate || '';
      this.extraHRRate = supplierContractCDCLocal.extraHRRate || '';
      this.kMsPerExtraHR = supplierContractCDCLocal.kMsPerExtraHR || '';
      this.driverAllowance = supplierContractCDCLocal.driverAllowance || '';
      this.nightChargesStartTimeString = supplierContractCDCLocal.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = supplierContractCDCLocal.nightChargesEndTimeString || '';
      this.nightCharge = supplierContractCDCLocal.nightCharge || '';
      this.graceMinutesForNightCharge = supplierContractCDCLocal.graceMinutesForNightCharge || '';
      this.graceMinutesNightCharge = supplierContractCDCLocal.graceMinutesNightCharge || '';
      this.fkmP2P = supplierContractCDCLocal.fkmP2P || '';
      this.fixedP2PAmount = supplierContractCDCLocal.fixedP2PAmount || '';
      this.additionalKM = supplierContractCDCLocal.additionalKM || '';
      this.additionalHR = supplierContractCDCLocal.additionalHR || '';
      this.packageJumpCriteria = supplierContractCDCLocal.packageJumpCriteria || '';
      this.nextPackageSelectionCriteria = supplierContractCDCLocal.nextPackageSelectionCriteria || '';
      this.packageGraceMinutes = supplierContractCDCLocal.packageGraceMinutes || '';
      this.packageGraceKMs = supplierContractCDCLocal.packageGraceKMs || '';
      this.tollChargeable = supplierContractCDCLocal.tollChargeable || '';
      this.parkingChargeable = supplierContractCDCLocal.parkingChargeable || '';
      this.interStateTaxChargeable = supplierContractCDCLocal.interStateTaxChargeable || '';
      this.activationStatus = supplierContractCDCLocal.activationStatus || '';     
      this.nightChargeable = supplierContractCDCLocal.nightChargeable || '';     
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

