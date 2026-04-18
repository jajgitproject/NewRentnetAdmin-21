// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCDCLocalOnDemand {
  supplierContractCDCLocalOnDemandID: number;
  userID:number;
  supplierContractID: number;
  vehicleCategoryID:number;
  cityTierID:number;
  billFromTo:string;
  vehicleCategory:string;
  cityTier:string;
  gpsPerKMRate:number;
  perMinuteRate:number;
  freeMinutes:number;
  baseRate:number;
  driverAllowance:number;
  nightChargesStartTime:Date;
  nightChargesStartTimeString:string;
  nightChargesEndTime:Date;
  nightChargesEndTimeString:string;
  nightCharge:number;
  graceMinutesForNightCharge:number;
  graceMinutesNightCharge:number;
  fkmP2P:number;
  fixedP2PAmount:number;
  tollChargeable:boolean;
  parkingChargeable:boolean;
  interStateTaxChargeable:boolean; 
  nightChargeable:boolean;
  activationStatus:boolean;

 constructor(supplierContractCDCLocalOnDemand) {
   {
      this.supplierContractCDCLocalOnDemandID = supplierContractCDCLocalOnDemand.supplierContractCDCLocalOnDemandID || -1;
      this.supplierContractID = supplierContractCDCLocalOnDemand.supplierContractID || '';
      this.vehicleCategoryID = supplierContractCDCLocalOnDemand.vehicleCategoryID || '';
      this.cityTierID = supplierContractCDCLocalOnDemand.cityTierID || '';
      this.billFromTo = supplierContractCDCLocalOnDemand.billFromTo || '';
      this.gpsPerKMRate = supplierContractCDCLocalOnDemand.gpsPerKMRate || '';
      this.perMinuteRate = supplierContractCDCLocalOnDemand.perMinuteRate || '';
      this.freeMinutes = supplierContractCDCLocalOnDemand.freeMinutes || '';
      this.baseRate = supplierContractCDCLocalOnDemand.baseRate || '';
      this.driverAllowance = supplierContractCDCLocalOnDemand.driverAllowance || '';
      this.nightChargesStartTimeString = supplierContractCDCLocalOnDemand.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = supplierContractCDCLocalOnDemand.nightChargesEndTimeString || '';
      this.nightCharge = supplierContractCDCLocalOnDemand.nightCharge || '';
      this.graceMinutesForNightCharge = supplierContractCDCLocalOnDemand.graceMinutesForNightCharge || '';
      this.graceMinutesNightCharge = supplierContractCDCLocalOnDemand.graceMinutesNightCharge || '';
      this.fkmP2P = supplierContractCDCLocalOnDemand.fkmP2P || '';
      this.fixedP2PAmount = supplierContractCDCLocalOnDemand.fixedP2PAmount || '';     
      this.tollChargeable = supplierContractCDCLocalOnDemand.tollChargeable || '';
      this.parkingChargeable = supplierContractCDCLocalOnDemand.parkingChargeable || '';
      this.interStateTaxChargeable = supplierContractCDCLocalOnDemand.interStateTaxChargeable || '';
      this.nightChargeable = supplierContractCDCLocalOnDemand.nightChargeable || '';
      this.activationStatus = supplierContractCDCLocalOnDemand.activationStatus || '';
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}

