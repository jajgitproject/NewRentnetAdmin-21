// @ts-nocheck
import { formatDate } from '@angular/common';
export class SDUnLimitedRate {
  sdUnLimitedRateID: number;
  customerContractID: number;
  customerContractCarCategoryID:number;
  customerContractCityTiersID:number;
  packageID:number;
  minimumDays:number;
  packageRate:number;
  extraPerdayRate:number;
  extraHourRate:number;
  deliveryCharges:number;
  pickupChargesAtNight:number;
  pickupCharges:number;
  deliveryChargesAtNight:number;
  nightChargeStartTime:Date;
  nightChargeStartTimeString:string;
  nightChargeEndTime:Date;
  nightChargeEndTimeString:string;
  nextDayCharging:Date;
  nextDayChargingString:string;
  graceHours:number;
  securityDepositAmount:number;
  activationStatus:boolean;
  ifExtraDrivenMoveToLocalPackages:string;
  customerContractCarCategory:string;
  customerContractCityTier:string;
  package:string;

 constructor(sdUnLimitedRate) {
   {
      this.sdUnLimitedRateID = sdUnLimitedRate.sdUnLimitedRateID || -1;
      this.customerContractID = sdUnLimitedRate.customerContractID || '';
      this.customerContractCarCategoryID = sdUnLimitedRate.customerContractCarCategoryID || '';
      this.customerContractCityTiersID = sdUnLimitedRate.customerContractCityTiersID || '';
      this.packageID = sdUnLimitedRate.packageID || '';
      this.minimumDays = sdUnLimitedRate.minimumDays || '';
      this.packageRate = sdUnLimitedRate.packageRate || '';
      this.extraPerdayRate = sdUnLimitedRate.extraPerdayRate || '';
      this.extraHourRate = sdUnLimitedRate.extraHourRate || '';
      this.deliveryCharges = sdUnLimitedRate.deliveryCharges || '';
      this.deliveryChargesAtNight = sdUnLimitedRate.deliveryChargesAtNight || '';
      this.pickupChargesAtNight = sdUnLimitedRate.pickupChargesAtNight || '';
      this.pickupCharges = sdUnLimitedRate.pickupCharges || '';
      this.nightChargeStartTimeString = sdUnLimitedRate.nightChargeStartTimeString || '';
      this.nightChargeEndTimeString = sdUnLimitedRate.nightChargeEndTimeString || '';
      this.nextDayChargingString = sdUnLimitedRate.nextDayChargingString || '';
      this.graceHours = sdUnLimitedRate.graceHours || '';
      this.securityDepositAmount = sdUnLimitedRate.securityDepositAmount || '';
      this.activationStatus = sdUnLimitedRate.activationStatus || '';     
      this.nightChargeStartTime=new Date();
      this.nightChargeEndTime=new Date();
      this.nextDayCharging=new Date();

   }
 }
  
}

