// @ts-nocheck
import { formatDate } from '@angular/common';
export class SDLimitedRate {
  sdLimitedRateID: number;
  customerContractID: number;
  customerContractCarCategoryID:number;
  customerContractCityTiersID:number;
  packageID:number;
  billFromTo:string;
  minimumDays:number;
  freeKMPerday:number;
  packageRate:number;
  extraPerdayRate:number;
  extraHourRate:number;
  extraKMRate:number;
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
  graceKMs:number;
  graceHours:number;
  securityDepositAmount:number;
  activationStatus:boolean;
  ifExtraDrivenMoveToLocalPackages:string;
  customerContractCarCategory:string;
  customerContractCityTier:string;
  package:string;
  vehicleCategory:string;
  cityTier:string;

 constructor(sdlimitedRate) {
   {
      this.sdLimitedRateID = sdlimitedRate.sdLimitedRateID || -1;
      this.customerContractID = sdlimitedRate.customerContractID || '';
      this.customerContractCarCategoryID = sdlimitedRate.customerContractCarCategoryID || '';
      this.customerContractCityTiersID = sdlimitedRate.customerContractCityTiersID || '';
      this.packageID = sdlimitedRate.packageID || '';
      this.billFromTo = sdlimitedRate.billFromTo || '';
      this.minimumDays = sdlimitedRate.minimumDays || '';
      this.freeKMPerday = sdlimitedRate.freeKMPerday || '';
      this.packageRate = sdlimitedRate.packageRate || '';
      this.extraPerdayRate = sdlimitedRate.extraPerdayRate || '';
      this.extraHourRate = sdlimitedRate.extraHourRate || '';
      this.extraKMRate = sdlimitedRate.extraKMRate || '';
      this.deliveryCharges = sdlimitedRate.deliveryCharges || '';
      this.deliveryChargesAtNight = sdlimitedRate.deliveryChargesAtNight || '';
      this.pickupChargesAtNight = sdlimitedRate.pickupChargesAtNight || '';
      this.pickupCharges = sdlimitedRate.pickupCharges || '';
      this.nightChargeStartTimeString = sdlimitedRate.nightChargeStartTimeString || '';
      this.nightChargeEndTimeString = sdlimitedRate.nightChargeEndTimeString || '';
      this.nextDayChargingString = sdlimitedRate.nextDayChargingString || '';
      this.graceKMs = sdlimitedRate.graceKMs || '';
      this.graceHours = sdlimitedRate.graceHours || '';
      this.securityDepositAmount = sdlimitedRate.securityDepositAmount || '';
      this.activationStatus = sdlimitedRate.activationStatus || '';     
      this.nightChargeStartTime=new Date();
      this.nightChargeEndTime=new Date();
      this.nextDayCharging=new Date();

   }
 }
  
}

