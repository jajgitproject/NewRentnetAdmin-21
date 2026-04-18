// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractSDCSelfDriveHourlyUnlimited {
  supplierContractSDCSelfDriveHourlyUnlimitedID: number;
  userID:number;
  supplierContractID: number;
  vehicleCategoryID:number;
  cityTierID:number;
  packageID:number;
  nextDayCriteria:Date;
  nextDayCriteriaString:string;
  deliveryChargeable:boolean;
  deliveryCharges:number;
  pickupChargeable:boolean;
  pickupCharges:number;
  minimumHRs:number;
  baseRate:number;
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

 constructor(supplierContractSDCSelfDriveHourlyUnlimited) {
   {
      this.supplierContractSDCSelfDriveHourlyUnlimitedID = supplierContractSDCSelfDriveHourlyUnlimited.supplierContractSDCSelfDriveHourlyUnlimitedID || -1;
      this.supplierContractID = supplierContractSDCSelfDriveHourlyUnlimited.supplierContractID || '';
      this.vehicleCategoryID = supplierContractSDCSelfDriveHourlyUnlimited.vehicleCategoryID || '';
      this.cityTierID = supplierContractSDCSelfDriveHourlyUnlimited.cityTierID || '';
      this.packageID = supplierContractSDCSelfDriveHourlyUnlimited.packageID || '';
      this.nextDayCriteriaString = supplierContractSDCSelfDriveHourlyUnlimited.nextDayCriteriaString || '';
      this.deliveryChargeable = supplierContractSDCSelfDriveHourlyUnlimited.deliveryChargeable || '';
      this.deliveryCharges = supplierContractSDCSelfDriveHourlyUnlimited.deliveryCharges || '';
      this.pickupChargeable = supplierContractSDCSelfDriveHourlyUnlimited.pickupChargeable || '';
      this.pickupCharges = supplierContractSDCSelfDriveHourlyUnlimited.pickupCharges || '';    
      this.minimumHRs = supplierContractSDCSelfDriveHourlyUnlimited.minimumHRs || '';
      this.baseRate = supplierContractSDCSelfDriveHourlyUnlimited.baseRate || '';     
      this.extraHRRate = supplierContractSDCSelfDriveHourlyUnlimited.extraHRRate || '';
      this.securityDepositAmount = supplierContractSDCSelfDriveHourlyUnlimited.securityDepositAmount || '';
      this.nightChargesStartTimeString = supplierContractSDCSelfDriveHourlyUnlimited.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = supplierContractSDCSelfDriveHourlyUnlimited.nightChargesEndTimeString || '';
      this.graceMinutesForNightCharge = supplierContractSDCSelfDriveHourlyUnlimited.graceMinutesForNightCharge || '';
      this.graceMinutesNightCharge = supplierContractSDCSelfDriveHourlyUnlimited.graceMinutesNightCharge || '';
      this.deliveryChargesAtNight = supplierContractSDCSelfDriveHourlyUnlimited.deliveryChargesAtNight || '';
      this.pickupChargesAtNight = supplierContractSDCSelfDriveHourlyUnlimited.pickupChargesAtNight || '';
      this.billFromTo = supplierContractSDCSelfDriveHourlyUnlimited.billFromTo || '';
      this.activationStatus = supplierContractSDCSelfDriveHourlyUnlimited.activationStatus || '';     

      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

