// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractSDCSelfDriveLimited {
  supplierContractSDCSelfDriveLimitedID: number;
  userID:number;
  supplierContractID:number;
   nightChargeStartTime:Date;
   nightChargeStartTimeString:string;
   nightChargeEndTime:Date;
  nightChargeEndTimeString:string;
    vehicleCategoryID:number;
    cityTierID:number;
    packageID:number;
    billFromTo:string;
    graceKMs:number;
    vehicleCategory:string;
  cityTierName:string;
  package:string;
    extraKMRate:number;
    freeKMPerday:number;
    nextDayCriteria:Date;
    nextDayCriteriaString:string;
    deliveryChargeable:boolean;
    deliveryCharges:number;
    pickupChargeable:boolean;
    pickupCharges:number;
    minimumDays:number;
    baseRate:number;
    extraHRRate:number;
    extraPerdayRate:number;
    securityDepositAmount:number;
    graceMinutesForNightCharge:number;
    graceMinutesNightCharge:number;
    deliveryChargesAtNight:number;
    billingOption:string;
    pickupChargesAtNight:number;
    activationStatus:boolean;
    
  constructor(supplierContractSDCSelfDriveLimited) {
    {
       this.supplierContractSDCSelfDriveLimitedID = supplierContractSDCSelfDriveLimited.supplierContractSDCSelfDriveLimitedID || -1;
       this.supplierContractID = supplierContractSDCSelfDriveLimited.supplierContractID || '';
       this.nightChargeStartTimeString = supplierContractSDCSelfDriveLimited. nightChargeStartTimeString || '';
       this.nightChargeEndTimeString = supplierContractSDCSelfDriveLimited. nightChargeEndTimeString || '';
       this.vehicleCategoryID = supplierContractSDCSelfDriveLimited. vehicleCategoryID || '';
       this.cityTierID = supplierContractSDCSelfDriveLimited. vehicleCategoryID || '';
       this.packageID = supplierContractSDCSelfDriveLimited. packageID || '';
       this.billFromTo = supplierContractSDCSelfDriveLimited. billFromTo || '';
       this.packageID = supplierContractSDCSelfDriveLimited. packageID || '';
       this.graceKMs = supplierContractSDCSelfDriveLimited. graceKMs || '';
       this.freeKMPerday = supplierContractSDCSelfDriveLimited. freeKMPerday || '';
       this.extraKMRate = supplierContractSDCSelfDriveLimited. extraKMRate || '';
       this.nextDayCriteria = supplierContractSDCSelfDriveLimited.nextDayCriteria || '';
       this.deliveryChargeable = supplierContractSDCSelfDriveLimited.deliveryChargeable || '';
       this.deliveryCharges = supplierContractSDCSelfDriveLimited.deliveryCharges || '';
       this.baseRate = supplierContractSDCSelfDriveLimited.baseRate ||'';
       this.pickupChargeable = supplierContractSDCSelfDriveLimited. pickupChargeable || '';
       this.pickupCharges = supplierContractSDCSelfDriveLimited. billingOption || '';
       this.minimumDays = supplierContractSDCSelfDriveLimited. minimumDays || '';
       this.extraHRRate = supplierContractSDCSelfDriveLimited. extraHRRate || '';
       this.extraPerdayRate = supplierContractSDCSelfDriveLimited. extraPerdayRate || '';
       this.graceMinutesForNightCharge = supplierContractSDCSelfDriveLimited. graceMinutesForNightCharge ||'';
       this.graceMinutesNightCharge = supplierContractSDCSelfDriveLimited. graceMinutesNightCharge ||'';
       this.securityDepositAmount = supplierContractSDCSelfDriveLimited. securityDepositAmount || '';
       this.deliveryChargesAtNight = supplierContractSDCSelfDriveLimited. deliveryChargesAtNight || '';
       this.pickupChargesAtNight = supplierContractSDCSelfDriveLimited. pickupChargesAtNight || '';
       this.activationStatus =  supplierContractSDCSelfDriveLimited.activationStatus || '';
       this.nightChargeEndTime=new Date();
       this.nightChargeStartTime=new Date();
       
    }
  }
  
}

