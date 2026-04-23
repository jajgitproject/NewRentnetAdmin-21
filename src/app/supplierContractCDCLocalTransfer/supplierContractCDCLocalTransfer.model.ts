// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCDCLocalTransfer {
  supplierContractCDCLocalTransferID: number;
  userID:number;
  supplierContractID: number;
  vehicleCategoryID:number;
  cityTierID:number;
  packageID:number;
  billFromTo:string;
  minimumHours:number;
  minimumKMs:number;
  baseRate:number;
  vehicleCategory:string;
  cityTier:string;
  package:string;
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
  packageGraceMinutes:number;
  packageGraceKMs:number;
  tollChargeable:boolean;
  parkingChargeable:boolean;
  interStateTaxChargeable:boolean; 
  nightChargeable:boolean;
  activationStatus:boolean;
  ifExtraDrivenMoveToLocalPackages:boolean;

 constructor(supplierContractCDCLocalTransfer) {
   {
      this.supplierContractCDCLocalTransferID = supplierContractCDCLocalTransfer.supplierContractCDCLocalTransferID || -1;
      this.supplierContractID = supplierContractCDCLocalTransfer.supplierContractID || '';
      this.vehicleCategoryID = supplierContractCDCLocalTransfer.vehicleCategoryID || '';
      this.cityTierID = supplierContractCDCLocalTransfer.cityTierID || '';
      this.packageID = supplierContractCDCLocalTransfer.packageID || '';
      this.billFromTo = supplierContractCDCLocalTransfer.billFromTo || '';
      this.minimumHours = supplierContractCDCLocalTransfer.minimumHours || '';
      this.minimumKMs = supplierContractCDCLocalTransfer.minimumKMs || '';
      this.baseRate = supplierContractCDCLocalTransfer.baseRate || '';
      this.billingOption = supplierContractCDCLocalTransfer.billingOption || '';
      this.extraKMRate = supplierContractCDCLocalTransfer.extraKMRate || '';
      this.extraHRRate = supplierContractCDCLocalTransfer.extraHRRate || '';
      this.kMsPerExtraHR = supplierContractCDCLocalTransfer.kMsPerExtraHR || '';
      this.driverAllowance = supplierContractCDCLocalTransfer.driverAllowance || '';
      this.nightChargesStartTimeString = supplierContractCDCLocalTransfer.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = supplierContractCDCLocalTransfer.nightChargesEndTimeString || '';
      this.nightCharge = supplierContractCDCLocalTransfer.nightCharge || '';
      this.graceMinutesForNightCharge = supplierContractCDCLocalTransfer.graceMinutesForNightCharge || '';
      this.graceMinutesNightCharge = supplierContractCDCLocalTransfer.graceMinutesNightCharge || '';
      this.fkmP2P = supplierContractCDCLocalTransfer.fkmP2P || '';
      this.fixedP2PAmount = supplierContractCDCLocalTransfer.fixedP2PAmount || '';
      this.packageGraceMinutes = supplierContractCDCLocalTransfer.packageGraceMinutes || '';
      this.packageGraceKMs = supplierContractCDCLocalTransfer.packageGraceKMs || '';
      this.tollChargeable = supplierContractCDCLocalTransfer.tollChargeable || '';
      this.parkingChargeable = supplierContractCDCLocalTransfer.parkingChargeable || '';
      this.interStateTaxChargeable = supplierContractCDCLocalTransfer.interStateTaxChargeable || '';
      this.activationStatus = supplierContractCDCLocalTransfer.activationStatus || '';     
      this.nightChargeable = supplierContractCDCLocalTransfer.nightChargeable || '';     
      this.ifExtraDrivenMoveToLocalPackages = supplierContractCDCLocalTransfer.ifExtraDrivenMoveToLocalPackages || '';
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

