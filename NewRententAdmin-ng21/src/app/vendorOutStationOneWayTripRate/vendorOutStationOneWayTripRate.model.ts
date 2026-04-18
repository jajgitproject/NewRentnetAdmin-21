// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorOutStationOneWayTripRate {
  vendorOutStationOneWayTripRateID: number;
 vendorContractID: number;
  customerContractCarCategoryID:number;
  customerContractCityTiersID:number;
   vendorContractCarCategoryID:number;
  vendorContractCityTiersID:number;
  vendorContractCarCategory:string;
  vendorContractCityTier:string;
  packageID:number;
  billFromTo:string;
  minimumKmsPerDay:number;
  ratePerDay:number;
   minimumKms:number;
  packageRate:number;
  ratePerDayForSupplier:number;
  extraKmsRate:number;
  extraKmsRateForSupplier:number;
  nextDayCharging:string;
  graceMinutesForNextDayCharges:number;
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
  customerContractCarCategory:string;
  customerContractCityTier:string;
  package:string;
  vehicleCategory:string;
  cityTier:string;
 
  userID:number;
  
nightChargesBasedOn:string;



 constructor(vendorOutStationOneWayTripRate) {
   {
      this.vendorOutStationOneWayTripRateID = vendorOutStationOneWayTripRate.vendorOutStationOneWayTripRateID || -1;
      this.vendorContractID = vendorOutStationOneWayTripRate.vendorContractID || '';
      this.customerContractCarCategoryID = vendorOutStationOneWayTripRate.customerContractCarCategoryID || '';
      this.customerContractCityTiersID = vendorOutStationOneWayTripRate.customerContractCityTiersID || '';
       this.customerContractCarCategoryID = vendorOutStationOneWayTripRate.customerContractCarCategoryID || '';
      this.vendorContractCarCategory = vendorOutStationOneWayTripRate.vendorContractCarCategory || '';
          this.vendorContractCityTier = vendorOutStationOneWayTripRate.vendorContractCityTier || '';
      this.vendorContractCityTiersID = vendorOutStationOneWayTripRate.vendorContractCityTiersID || '';
      this.packageID = vendorOutStationOneWayTripRate.packageID || '';
      this.billFromTo = vendorOutStationOneWayTripRate.billFromTo || '';
      this.minimumKmsPerDay = vendorOutStationOneWayTripRate.minimumKmsPerDay || '';
      this.ratePerDay = vendorOutStationOneWayTripRate.ratePerDay || '';
       this.nightChargesBasedOn = vendorOutStationOneWayTripRate.nightChargesBasedOn || '';
      this.ratePerDayForSupplier = vendorOutStationOneWayTripRate.ratePerDayForSupplier || '';
      this.extraKmsRate = vendorOutStationOneWayTripRate.extraKmsRate || '';
      this.extraKmsRateForSupplier = vendorOutStationOneWayTripRate.extraKmsRateForSupplier || '';
      this.nextDayCharging = vendorOutStationOneWayTripRate.nextDayCharging || '';
      this.graceMinutesForNextDayCharges = vendorOutStationOneWayTripRate.graceMinutesForNextDayCharges || '';

      this.driverAllowance = vendorOutStationOneWayTripRate.driverAllowance || '';
      this.driverAllowanceForSupplier = vendorOutStationOneWayTripRate.driverAllowanceForSupplier || '';
      this.nightChargeable = vendorOutStationOneWayTripRate.nightChargeable || ''; 
      this.nightCharge = vendorOutStationOneWayTripRate.nightCharge || '';
      this.nightChargeForSupplier = vendorOutStationOneWayTripRate.nightChargeForSupplier || '';
      this.nightChargesStartTimeString = vendorOutStationOneWayTripRate.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = vendorOutStationOneWayTripRate.nightChargesEndTimeString || ''; 
      this.graceMinutesForNightCharge = vendorOutStationOneWayTripRate.graceMinutesForNightCharge || 0;
      this.graceMinutesNightChargeAmount = vendorOutStationOneWayTripRate.graceMinutesNightChargeAmount || 0;    
      this.additionalKM = vendorOutStationOneWayTripRate.additionalKM || 0;
      this.additionalMinutes = vendorOutStationOneWayTripRate.additionalMinutes || 0;
      this.tollChargeable = vendorOutStationOneWayTripRate.tollChargeable || '';
      this.parkingChargeable = vendorOutStationOneWayTripRate.parkingChargeable || '';
      this.interStateChargeable = vendorOutStationOneWayTripRate.interStateChargeable || '';
      this.activationStatus = vendorOutStationOneWayTripRate.activationStatus || '';     
    
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

