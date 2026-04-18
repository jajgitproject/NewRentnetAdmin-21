// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractSDCSelfDriveUnLimited {
  supplierContractSDCSelfDriveUnLimitedID: number;
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
    graceHRs:number;
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
    vehicleCategory:string;
    cityTierName:string;
  package:string;
  cityTier:string;
  constructor(supplierContractSDCSelfDriveUnLimited) {
    {
       this.supplierContractSDCSelfDriveUnLimitedID = supplierContractSDCSelfDriveUnLimited.supplierContractSDCSelfDriveUnLimitedID || -1;
       this.supplierContractID = supplierContractSDCSelfDriveUnLimited.supplierContractID || '';
       this.nightChargeStartTimeString = supplierContractSDCSelfDriveUnLimited. nightChargeStartTimeString || '';
       this.nightChargeEndTimeString = supplierContractSDCSelfDriveUnLimited. nightChargeEndTimeString || '';
       this.vehicleCategoryID = supplierContractSDCSelfDriveUnLimited. vehicleCategoryID || '';
       this.cityTierID = supplierContractSDCSelfDriveUnLimited. vehicleCategoryID || '';
       this.packageID = supplierContractSDCSelfDriveUnLimited. packageID || '';
       this.billFromTo = supplierContractSDCSelfDriveUnLimited. billFromTo || '';
       this.packageID = supplierContractSDCSelfDriveUnLimited. packageID || '';
       this.graceHRs = supplierContractSDCSelfDriveUnLimited. graceHRs || '';
       this.nextDayCriteria = supplierContractSDCSelfDriveUnLimited.nextDayCriteria || '';
       this.deliveryChargeable = supplierContractSDCSelfDriveUnLimited.deliveryChargeable || '';
       this.deliveryCharges = supplierContractSDCSelfDriveUnLimited.deliveryCharges || '';
       this.baseRate = supplierContractSDCSelfDriveUnLimited.baseRate ||'';
       this.pickupChargeable = supplierContractSDCSelfDriveUnLimited. pickupChargeable || '';
       this.pickupCharges = supplierContractSDCSelfDriveUnLimited. billingOption || '';
       this.minimumDays = supplierContractSDCSelfDriveUnLimited. minimumDays || '';
       this.extraHRRate = supplierContractSDCSelfDriveUnLimited. extraHRRate || '';
       this.extraPerdayRate = supplierContractSDCSelfDriveUnLimited. extraPerdayRate || '';
       this.graceMinutesForNightCharge = supplierContractSDCSelfDriveUnLimited. graceMinutesForNightCharge ||'';
       this.graceMinutesNightCharge = supplierContractSDCSelfDriveUnLimited. graceMinutesNightCharge ||'';
       this.securityDepositAmount = supplierContractSDCSelfDriveUnLimited. securityDepositAmount || '';
       this.deliveryChargesAtNight = supplierContractSDCSelfDriveUnLimited. deliveryChargesAtNight || '';
       this.pickupChargesAtNight = supplierContractSDCSelfDriveUnLimited. pickupChargesAtNight || '';
       this.activationStatus =  supplierContractSDCSelfDriveUnLimited.activationStatus || '';
       this.nightChargeEndTime=new Date();
       this.nightChargeStartTime=new Date();
       
    }
  }
  
}

