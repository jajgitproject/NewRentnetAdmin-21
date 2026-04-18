// @ts-nocheck
import { formatDate } from '@angular/common';
export class CDCOutStationLumpsumRate {
  cdcOutStationLumpsumRateID: number;
  customerContractID: number;
  customerContractCarCategoryID:number;
  customerContractCityTiersID:number;
  packageID:number;
  billFromTo:string;
  minimumKms:number;
  minimumHours:number;
  minimumDays:number;
  packageRate:number;
  packageRateForSupplier:number;
  extraKmsRate:number;
  extraKmsRateForSupplier:number;
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
  additionalKM:number;
  additionalMinutes:number;
  tollChargeable:boolean;
  parkingChargeable:boolean;
  interStateChargeable:boolean;  
  activationStatus:boolean;
  vehicleCategory:string;
  cityTier:string;
  package:string;
  userID:number;
  nightChargesBasedOn:string;

 constructor(cdcOutStationLumpsumRate) {
   {
      this.cdcOutStationLumpsumRateID = cdcOutStationLumpsumRate.cdcOutStationLumpsumRateID || -1;
      this.customerContractID = cdcOutStationLumpsumRate.customerContractID || '';
      this.customerContractCarCategoryID = cdcOutStationLumpsumRate.customerContractCarCategoryID || '';
      this.customerContractCityTiersID = cdcOutStationLumpsumRate.customerContractCityTiersID || '';
      this.packageID = cdcOutStationLumpsumRate.packageID || '';
      this.billFromTo = cdcOutStationLumpsumRate.billFromTo || '';
      this.nightChargesBasedOn = cdcOutStationLumpsumRate.nightChargesBasedOn || '';
      this.minimumKms = cdcOutStationLumpsumRate.minimumKms || '';
      this.minimumHours = cdcOutStationLumpsumRate.minimumHours || '';
      this.minimumDays = cdcOutStationLumpsumRate.minimumDays || '';
      this.packageRate = cdcOutStationLumpsumRate.packageRate || '';
      this.packageRateForSupplier = cdcOutStationLumpsumRate.packageRateForSupplier || '';
      this.extraKmsRate = cdcOutStationLumpsumRate.extraKmsRate || '';
      this.extraKmsRateForSupplier = cdcOutStationLumpsumRate.extraKmsRateForSupplier || '';
      this.driverAllowance = cdcOutStationLumpsumRate.driverAllowance || '';
      this.driverAllowanceForSupplier = cdcOutStationLumpsumRate.driverAllowanceForSupplier || '';
      this.kMsPerExtraHR = cdcOutStationLumpsumRate.kMsPerExtraHR || '';
      this.nightChargeable = cdcOutStationLumpsumRate.nightChargeable || ''; 
      this.nightCharge = cdcOutStationLumpsumRate.nightCharge || '';
      this.nightChargeForSupplier = cdcOutStationLumpsumRate.nightChargeForSupplier || '';
      this.nightChargesStartTimeString = cdcOutStationLumpsumRate.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = cdcOutStationLumpsumRate.nightChargesEndTimeString || ''; 
      this.graceMinutesForNightCharge = cdcOutStationLumpsumRate.graceMinutesForNightCharge || 0;
      this.graceMinutesNightChargeAmount = cdcOutStationLumpsumRate.graceMinutesNightChargeAmount || 0;    
      this.additionalKM = cdcOutStationLumpsumRate.additionalKM || 0;
      this.additionalMinutes = cdcOutStationLumpsumRate.additionalMinutes || 0;
      this.tollChargeable = cdcOutStationLumpsumRate.tollChargeable || '';
      this.parkingChargeable = cdcOutStationLumpsumRate.parkingChargeable || '';
      this.interStateChargeable = cdcOutStationLumpsumRate.interStateChargeable || '';
      this.activationStatus = cdcOutStationLumpsumRate.activationStatus || '';     
    
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

