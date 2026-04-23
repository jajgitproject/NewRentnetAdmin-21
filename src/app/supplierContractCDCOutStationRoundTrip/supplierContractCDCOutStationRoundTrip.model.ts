// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCDCOutStationRoundTrip {
  supplierContractCDCOutStationRoundTripID: number;
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
    minimumKMsPerDay:number;
    ratePerDay:number;
    extraKMRate:number;
    graceMinutes:number;
    nextDayCharging:string;
    graceMinutesForNextDay:number;
    graceMinutesForNextDayCharges:number;
    tollChargeable:boolean;
    parkingChargeable:boolean;
    interStateTaxChargeable:boolean;
    nightChargeable:boolean;
    nightCharge:number;
    graceMinutesForNightCharge:number;
    graceMinutesNightCharge:number;
    driverAllowance:number;
    activationStatus:boolean; 
vehicleCategory:string;
cityTierName:string;
package:string;
    
  constructor(supplierContractCDCOutStationRoundTrip) {
    {
       this.supplierContractCDCOutStationRoundTripID = supplierContractCDCOutStationRoundTrip.supplierContractCDCOutStationRoundTripID || -1;
       this.supplierContractID = supplierContractCDCOutStationRoundTrip.supplierContractID || '';
       this.nightChargeStartTimeString = supplierContractCDCOutStationRoundTrip. nightChargeStartTimeString || '';
       this.nightChargeEndTimeString = supplierContractCDCOutStationRoundTrip. nightChargeEndTimeString || '';
       this.vehicleCategoryID = supplierContractCDCOutStationRoundTrip. vehicleCategoryID || '';
       this.cityTierID = supplierContractCDCOutStationRoundTrip. vehicleCategoryID || '';
       this.packageID = supplierContractCDCOutStationRoundTrip. packageID || '';
       this.billFromTo = supplierContractCDCOutStationRoundTrip. billFromTo || '';
       this.packageID = supplierContractCDCOutStationRoundTrip. packageID || '';
       this.minimumKMsPerDay = supplierContractCDCOutStationRoundTrip. minimumKMsPerDay || '';
       this.ratePerDay = supplierContractCDCOutStationRoundTrip. ratePerDay || '';
       this.graceMinutes = supplierContractCDCOutStationRoundTrip. graceMinutes || '';
       this.extraKMRate = supplierContractCDCOutStationRoundTrip. extraKMRate || '';
       this.nextDayCharging = supplierContractCDCOutStationRoundTrip. nextDayCharging || '';
       this.graceMinutesForNextDay = supplierContractCDCOutStationRoundTrip. graceMinutesForNextDay || '';
       this.graceMinutesForNextDayCharges = supplierContractCDCOutStationRoundTrip. graceMinutesForNextDayCharges || '';
       this.tollChargeable = supplierContractCDCOutStationRoundTrip. tollChargeable || '';
       this.parkingChargeable = supplierContractCDCOutStationRoundTrip. parkingChargeable || '';
       this.interStateTaxChargeable = supplierContractCDCOutStationRoundTrip. interStateTaxChargeable || '';
       this.nightChargeable = supplierContractCDCOutStationRoundTrip. nightChargeable || '';
       this.nightChargeStartTime = supplierContractCDCOutStationRoundTrip. nightChargeStartTime || '';
       this.nightChargeEndTime = supplierContractCDCOutStationRoundTrip. nightChargeEndTime ||'';
       this.nightCharge = supplierContractCDCOutStationRoundTrip. nightCharge ||'';
       this.graceMinutesForNightCharge = supplierContractCDCOutStationRoundTrip. graceMinutesForNightCharge ||'';
       this.graceMinutesNightCharge = supplierContractCDCOutStationRoundTrip. graceMinutesNightCharge ||'';
       this.driverAllowance = supplierContractCDCOutStationRoundTrip. driverAllowance ||'';
       this.activationStatus =  supplierContractCDCOutStationRoundTrip.activationStatus || '';
       this.nightChargeEndTime=new Date();
       this.nightChargeStartTime=new Date();
       
    }
  }
  
}

