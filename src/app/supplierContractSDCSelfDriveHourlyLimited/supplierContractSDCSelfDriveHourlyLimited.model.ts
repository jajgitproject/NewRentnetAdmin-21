// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractSDCSelfDriveHourlyLimited {
  supplierContractSDCSelfDriveHourlyLimitedID: number;
  userID:number;
  supplierContractID: number;
  vehicleCategoryID:number;
  cityTierID:number;
  packageID:number;
  deliveryChargeable:boolean;
  deliveryCharges:number;
  pickupChargeable:boolean;
  pickupCharges:number;
  minimumHours:number;
  minimumKMs:number;
  graceKMs:number;
  baseRate:number;
  extraKMRate:number;
  extraHRRate:number;
  securityDepositAmount:number;
  nightChargesStartTime:Date;
  nightChargesStartTimeString:string;
  nightChargesEndTime:Date;
  nightChargesEndTimeString:string;
  graceMinutesForNightCharge:number;
  graceMinutesNightCharge:number;
  deliveryChargesAtNight:number;
  pickupChargesAtNight:number;
  billFromTo:string;
  activationStatus:boolean;
vehicleCategory:string;
cityTier:string;
package:string;

 constructor(supplierContractSDCSelfDriveHourlyLimited) {
   {
      this.supplierContractSDCSelfDriveHourlyLimitedID = supplierContractSDCSelfDriveHourlyLimited.supplierContractSDCSelfDriveHourlyLimitedID || -1;
      this.supplierContractID = supplierContractSDCSelfDriveHourlyLimited.supplierContractID || '';
      this.vehicleCategoryID = supplierContractSDCSelfDriveHourlyLimited.vehicleCategoryID || '';
      this.cityTierID = supplierContractSDCSelfDriveHourlyLimited.cityTierID || '';
      this.packageID = supplierContractSDCSelfDriveHourlyLimited.packageID || '';
      this.deliveryChargeable = supplierContractSDCSelfDriveHourlyLimited.deliveryChargeable || '';
      this.deliveryCharges = supplierContractSDCSelfDriveHourlyLimited.deliveryCharges || '';
      this.pickupChargeable = supplierContractSDCSelfDriveHourlyLimited.pickupChargeable || '';
      this.pickupCharges = supplierContractSDCSelfDriveHourlyLimited.pickupCharges || '';    
      this.minimumHours = supplierContractSDCSelfDriveHourlyLimited.minimumHours || '';
      this.minimumKMs = supplierContractSDCSelfDriveHourlyLimited.minimumKMs || '';
      this.graceKMs = supplierContractSDCSelfDriveHourlyLimited.graceKMs || '';
      this.baseRate = supplierContractSDCSelfDriveHourlyLimited.baseRate || '';     
      this.extraKMRate = supplierContractSDCSelfDriveHourlyLimited.extraKMRate || '';
      this.extraHRRate = supplierContractSDCSelfDriveHourlyLimited.extraHRRate || '';
      this.securityDepositAmount = supplierContractSDCSelfDriveHourlyLimited.securityDepositAmount || '';
      this.nightChargesStartTimeString = supplierContractSDCSelfDriveHourlyLimited.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = supplierContractSDCSelfDriveHourlyLimited.nightChargesEndTimeString || '';
      this.graceMinutesForNightCharge = supplierContractSDCSelfDriveHourlyLimited.graceMinutesForNightCharge || '';
      this.graceMinutesNightCharge = supplierContractSDCSelfDriveHourlyLimited.graceMinutesNightCharge || '';
      this.deliveryChargesAtNight = supplierContractSDCSelfDriveHourlyLimited.deliveryChargesAtNight || '';
      this.pickupChargesAtNight = supplierContractSDCSelfDriveHourlyLimited.pickupChargesAtNight || '';
      this.billFromTo = supplierContractSDCSelfDriveHourlyLimited.billFromTo || '';
      this.activationStatus = supplierContractSDCSelfDriveHourlyLimited.activationStatus || '';     

      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

