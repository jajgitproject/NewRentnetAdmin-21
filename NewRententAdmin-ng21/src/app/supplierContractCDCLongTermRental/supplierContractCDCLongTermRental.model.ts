// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCDCLongTermRental {
  supplierContractCDCLongTermRentalID: number;
  userID:number;
  supplierContractID: number;
  vehicleCategoryID:number;
  cityTierID:number;
  packageID:number;
  billFromTo:string;
  billingCriteria:string;
  extraKMRate:number;
  extraHRRate:number;
  dailyKMs:number;
  dailyHours:number;
  dailyGraceMinutes:number;
  dailyGraceKms:number;
  dailyBaseRate:number;
  totalDays:number;
  totalDaysHours:number;
  totalDaysKMs:number;
  totalDaysGraceMinutes:number;
  totalDaysGraceKms:number;
  totalDaysBaseRate:number;
  tollChargeable:boolean;
  parkingChargeable:boolean;
  interStateTaxChargeable:boolean;
  fkmP2P:number;
  vehicleCategory:string;
  fixedP2PAmount:number;
  cityTier:string;
  package:string;
  nightChargeable:boolean;
  nightChargesStartTime:Date;
  nightChargesStartTimeString:string;
  nightChargesEndTime:Date;
  nightChargesEndTimeString:string;
  nightCharge:number;
  graceMinutesForNightCharge:number;
  graceMinutesNightCharge:number;
  driverAllowance:number;
  activationStatus:boolean;

 constructor(supplierContractCDCLongTermRental) {
   {
      this.supplierContractCDCLongTermRentalID = supplierContractCDCLongTermRental.supplierContractCDCLongTermRentalID || -1;
      this.supplierContractID = supplierContractCDCLongTermRental.supplierContractID || '';
      this.vehicleCategoryID = supplierContractCDCLongTermRental.vehicleCategoryID || '';
      this.cityTierID = supplierContractCDCLongTermRental.cityTierID || '';
      this.packageID = supplierContractCDCLongTermRental.packageID || '';
      this.billFromTo = supplierContractCDCLongTermRental.billFromTo || '';
      this.dailyKMs = supplierContractCDCLongTermRental.dailyKMs || '';
      this.dailyGraceMinutes = supplierContractCDCLongTermRental.dailyGraceMinutes || '';
      this.dailyGraceKms = supplierContractCDCLongTermRental.dailyGraceKms || '';
      this.dailyBaseRate = supplierContractCDCLongTermRental.dailyBaseRate || '';
      this.totalDays = supplierContractCDCLongTermRental.totalDays || '';
      this.tollChargeable = supplierContractCDCLongTermRental.tollChargeable || '';
      this.parkingChargeable = supplierContractCDCLongTermRental.parkingChargeable || '';
      this.interStateTaxChargeable = supplierContractCDCLongTermRental.interStateTaxChargeable || '';
      this.totalDaysHours = supplierContractCDCLongTermRental.totalDaysHours || '';
      this.totalDaysGraceKms = supplierContractCDCLongTermRental.totalDaysGraceKms || '';
      this.totalDaysBaseRate = supplierContractCDCLongTermRental.totalDaysBaseRate || '';
      this.fkmP2P = supplierContractCDCLongTermRental.fkmP2P || '';
      this.fixedP2PAmount = supplierContractCDCLongTermRental.fixedP2PAmount || '';
      this.driverAllowance = supplierContractCDCLongTermRental.driverAllowance || '';
      this.activationStatus = supplierContractCDCLongTermRental.activationStatus || '';

      this.extraKMRate = supplierContractCDCLongTermRental.extraKMRate || '';
      this.extraHRRate = supplierContractCDCLongTermRental.extraHRRate || '';
      this.nightChargeable = supplierContractCDCLongTermRental.nightChargeable || '';
      this.nightChargesStartTimeString = supplierContractCDCLongTermRental.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = supplierContractCDCLongTermRental.nightChargesEndTimeString || '';
      this.nightCharge = supplierContractCDCLongTermRental.nightCharge || '';
      this.graceMinutesForNightCharge = supplierContractCDCLongTermRental.graceMinutesForNightCharge || '';
      this.graceMinutesNightCharge = supplierContractCDCLongTermRental.graceMinutesNightCharge || '';
      this.totalDaysKMs = supplierContractCDCLongTermRental.totalDaysKMs || '';
      this.totalDaysGraceMinutes = supplierContractCDCLongTermRental.totalDaysGraceMinutes || '';
      this.dailyHours=supplierContractCDCLongTermRental.dailyHours || '';
      this.billingCriteria=supplierContractCDCLongTermRental.billingCriteria || '';

      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

