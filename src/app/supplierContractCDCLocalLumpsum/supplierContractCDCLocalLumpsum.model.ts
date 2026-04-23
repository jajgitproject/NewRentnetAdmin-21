// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCDCLocalLumpsum {
  supplierContractCDCLocalLumpsumID: number;
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
    minimumHours:number;
    minimumKMs:number;
    minimumDays:number;
    nextDayCharging:string;
    graceMinutes:number;
    graceKms:number;
    tollChargeable:boolean;
    parkingChargeable:boolean;
    interStateTaxChargeable:boolean;
    nightChargeable:boolean;
    baseRate:number;
    billingOption:string;
    extraKMRate:number;
    extraHRRate:number;
    kMsPerExtraHR:number;
    nightCharge:number;
    graceMinutesForNightCharge:number;
    graceMinutesNightCharge:number;
    fkmP2P:number;
    fixedP2PAmount:number;
    packageGraceMinutes:number;
    packageGraceKMs:number;
    driverAllowance:number;
    activationStatus:boolean;
vehicleCategory:string;
cityTierName:string;
cityTier:string;
package:string;
    
  constructor(supplierContractCDCLocalLumpsum) {
    {
       this.supplierContractCDCLocalLumpsumID = supplierContractCDCLocalLumpsum.supplierContractCDCLocalLumpsumID || -1;
       this.supplierContractID = supplierContractCDCLocalLumpsum.supplierContractID || '';
       this.nightChargeStartTimeString = supplierContractCDCLocalLumpsum. nightChargeStartTimeString || '';
       this.nightChargeEndTimeString = supplierContractCDCLocalLumpsum. nightChargeEndTimeString || '';
       this.vehicleCategoryID = supplierContractCDCLocalLumpsum. vehicleCategoryID || '';
       this.cityTierID = supplierContractCDCLocalLumpsum. vehicleCategoryID || '';
       this.packageID = supplierContractCDCLocalLumpsum. packageID || '';
       this.billFromTo = supplierContractCDCLocalLumpsum. billFromTo || '';
       this.packageID = supplierContractCDCLocalLumpsum. packageID || '';
       this.minimumHours = supplierContractCDCLocalLumpsum. minimumHours || '';
       this.minimumKMs = supplierContractCDCLocalLumpsum.minimumKMs || '';
       this.graceMinutes = supplierContractCDCLocalLumpsum.graceMinutes || 0;
       this.graceKms = supplierContractCDCLocalLumpsum.graceKms || 0;
       this.baseRate = supplierContractCDCLocalLumpsum.baseRate ||'';
       this.extraKMRate = supplierContractCDCLocalLumpsum. extraKMRate || '';
       this.billingOption = supplierContractCDCLocalLumpsum. billingOption || '';
       this.extraHRRate = supplierContractCDCLocalLumpsum. extraHRRate || '';
       this.kMsPerExtraHR = supplierContractCDCLocalLumpsum. kMsPerExtraHR || '';
       this.tollChargeable = supplierContractCDCLocalLumpsum. tollChargeable || '';
       this.parkingChargeable = supplierContractCDCLocalLumpsum. parkingChargeable || '';
       this.interStateTaxChargeable = supplierContractCDCLocalLumpsum. interStateTaxChargeable || '';
       this.nightChargeable = supplierContractCDCLocalLumpsum. nightChargeable || '';
       this.nightCharge = supplierContractCDCLocalLumpsum. nightCharge ||'';
       this.graceMinutesForNightCharge = supplierContractCDCLocalLumpsum. graceMinutesForNightCharge ||'';
       this.graceMinutesNightCharge = supplierContractCDCLocalLumpsum. graceMinutesNightCharge ||'';
       this.fkmP2P = supplierContractCDCLocalLumpsum.fkmP2P ||'';
       this.fixedP2PAmount = supplierContractCDCLocalLumpsum. fixedP2PAmount ||'';
       this.packageGraceMinutes = supplierContractCDCLocalLumpsum. packageGraceMinutes ||'';
       this.packageGraceKMs = supplierContractCDCLocalLumpsum. packageGraceKMs ||'';
       this.driverAllowance = supplierContractCDCLocalLumpsum. driverAllowance ||'';
       this.activationStatus =  supplierContractCDCLocalLumpsum.activationStatus || '';
       this.nightChargeEndTime=new Date();
       this.nightChargeStartTime=new Date();
       
    }
  }
  
}

