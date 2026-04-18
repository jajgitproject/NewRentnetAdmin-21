// @ts-nocheck
import { formatDate } from '@angular/common';
export class CDCOutStationOneWayTripRate {
  cdcOutStationOneWayTripRateID: number;
  customerContractID: number;
  customerContractCarCategoryID:number;
  customerContractCityTiersID:number;
  packageID:number;
  billFromTo:string;
  customerContractCarCategory:string;
  customerContractCityTier:string;
  package:string;
  minimumKms:number;
  packageRate:number;
  packageRateForSupplier:number;
  extraKmsRate:number;
  extraKmsRateForSupplier:number;
 
  driverAllowance:number;
  driverAllowanceForSupplier:number;
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
userID:number;
nightChargesBasedOn:string;



 constructor(cdcOutStationOneWayTripRate) {
   {
      this.cdcOutStationOneWayTripRateID = cdcOutStationOneWayTripRate.cdcOutStationOneWayTripRateID || -1;
      this.customerContractID = cdcOutStationOneWayTripRate.customerContractID || '';
      this.customerContractCarCategoryID = cdcOutStationOneWayTripRate.customerContractCarCategoryID || '';
      this.customerContractCityTiersID = cdcOutStationOneWayTripRate.customerContractCityTiersID || '';
      this.packageID = cdcOutStationOneWayTripRate.packageID || '';
      this.billFromTo = cdcOutStationOneWayTripRate.billFromTo || ''
       this.nightChargesBasedOn = cdcOutStationOneWayTripRate.nightChargesBasedOn || '';
      this.minimumKms = cdcOutStationOneWayTripRate.minimumKms || '';
      this.packageRate = cdcOutStationOneWayTripRate.packageRate || '';
      this.packageRateForSupplier = cdcOutStationOneWayTripRate.packageRateForSupplier || '';
      this.extraKmsRate = cdcOutStationOneWayTripRate.extraKmsRate || '';
      this.extraKmsRateForSupplier = cdcOutStationOneWayTripRate.extraKmsRateForSupplier || '';
    
      this.driverAllowance = cdcOutStationOneWayTripRate.driverAllowance || '';
      this.driverAllowanceForSupplier = cdcOutStationOneWayTripRate.driverAllowanceForSupplier || '';
      this.nightChargeable = cdcOutStationOneWayTripRate.nightChargeable || ''; 
      this.nightCharge = cdcOutStationOneWayTripRate.nightCharge || '';
      this.nightChargeForSupplier = cdcOutStationOneWayTripRate.nightChargeForSupplier || '';
      this.nightChargesStartTimeString = cdcOutStationOneWayTripRate.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = cdcOutStationOneWayTripRate.nightChargesEndTimeString || ''; 
      this.graceMinutesForNightCharge = cdcOutStationOneWayTripRate.graceMinutesForNightCharge || 0;
      this.graceMinutesNightChargeAmount = cdcOutStationOneWayTripRate.graceMinutesNightChargeAmount || 0;
      this.additionalKM = cdcOutStationOneWayTripRate.additionalKM || 0;
      this.additionalMinutes = cdcOutStationOneWayTripRate.additionalMinutes || 0;
      this.tollChargeable = cdcOutStationOneWayTripRate.tollChargeable || '';
      this.parkingChargeable = cdcOutStationOneWayTripRate.parkingChargeable || '';
      this.interStateChargeable = cdcOutStationOneWayTripRate.interStateChargeable || '';
      this.activationStatus = cdcOutStationOneWayTripRate.activationStatus || '';     
    
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

