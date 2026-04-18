// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorContractLocalRateModel {
  vendorLocalRateID: number;
  vendorContractID: number;
  vendorContractCarCategoryID:number;
  vendorContractCityTiersID:number;
  packageID:number;
  billFromTo:string;
  minimumHours:number;
  minimumKM:number;
  billingOption:string;
  baseRate:number;
  baseRateForSupplier:number;
  extraKMRate:number;
  extraKMRateForSupplier:number;
  extraHRRate:number;
  extraHRRateForSupplier:number;
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
  fkmP2P:number;
  fixedP2PAmount:number;
  additionalKM:number;
  additionalMinutes:number;
  packageJumpCriteria:string;
  nextPackageSelectionCriteria:string;
  graceMinutes:number;
  graceKM:number;
  tollChargeable:boolean;
  parkingChargeable:boolean;
  interStateTaxChargeable:boolean;  
  activationStatus:boolean;
  vendorContractCityTier:string;
  vendorContractCarCategory:string;
  package:string;
  vehicleCategory:string;
  vendorContractCityTiers:string;
  userID:number;
  nightChargesBasedOn:string;
 constructor(vendorContractLocalRateModel) {
   {
      this.vendorLocalRateID = vendorContractLocalRateModel.vendorLocalRateID || -1;
      this.vendorContractID = vendorContractLocalRateModel.vendorContractID || '';
      this.vendorContractCarCategoryID = vendorContractLocalRateModel.vendorContractCarCategoryID || '';
      this.vendorContractCityTiersID = vendorContractLocalRateModel.vendorContractCityTiersID || '';
      this.vendorContractCityTier = vendorContractLocalRateModel.vendorContractCityTier || '';
      this.packageID = vendorContractLocalRateModel.packageID || '';
      this.billFromTo = vendorContractLocalRateModel.billFromTo || '';
      this.minimumHours = vendorContractLocalRateModel.minimumHours || '';
      this.minimumKM = vendorContractLocalRateModel.minimumKM || '';
      this.nightChargesBasedOn = vendorContractLocalRateModel.nightChargesBasedOn || '';
      this.billingOption = vendorContractLocalRateModel.billingOption || '';
      this.baseRate = vendorContractLocalRateModel.baseRate || '';
      this.baseRateForSupplier = vendorContractLocalRateModel.baseRateForSupplier || '';
      this.extraKMRate = vendorContractLocalRateModel.extraKMRate || '';
      this.extraKMRateForSupplier = vendorContractLocalRateModel.extraKMRateForSupplier || '';
      this.extraHRRate = vendorContractLocalRateModel.extraHRRate || '';
      this.extraHRRateForSupplier = vendorContractLocalRateModel.extraHRRateForSupplier || '';
      this.driverAllowance = vendorContractLocalRateModel.driverAllowance || '';
      this.driverAllowanceForSupplier = vendorContractLocalRateModel.driverAllowanceForSupplier || '';
      this.kMsPerExtraHR = vendorContractLocalRateModel.kMsPerExtraHR || '';
      this.nightChargeable = vendorContractLocalRateModel.nightChargeable || ''; 
      this.nightCharge = vendorContractLocalRateModel.nightCharge || '';
      this.nightChargeForSupplier = vendorContractLocalRateModel.nightChargeForSupplier || '';
      this.nightChargesStartTimeString = vendorContractLocalRateModel.nightChargesStartTimeString || '';
      this.nightChargesEndTimeString = vendorContractLocalRateModel.nightChargesEndTimeString || ''; 
      this.graceMinutesForNightCharge = vendorContractLocalRateModel.graceMinutesForNightCharge || '';
      this.graceMinutesNightChargeAmount = vendorContractLocalRateModel.graceMinutesNightChargeAmount || '';    
      this.fkmP2P = vendorContractLocalRateModel.fkmP2P || '';
      this.fixedP2PAmount = vendorContractLocalRateModel.fixedP2PAmount || '';
      this.additionalKM = vendorContractLocalRateModel.additionalKM || '';
      this.additionalMinutes = vendorContractLocalRateModel.additionalMinutes || '';
      this.packageJumpCriteria = vendorContractLocalRateModel.packageJumpCriteria || '';
      this.nextPackageSelectionCriteria = vendorContractLocalRateModel.nextPackageSelectionCriteria || '';
      this.graceMinutes = vendorContractLocalRateModel.graceMinutes || '';
      this.graceKM = vendorContractLocalRateModel.graceKM || '';
      this.tollChargeable = vendorContractLocalRateModel.tollChargeable || '';
      this.parkingChargeable = vendorContractLocalRateModel.parkingChargeable || '';
      this.interStateTaxChargeable = vendorContractLocalRateModel.interStateTaxChargeable || '';
      this.activationStatus = vendorContractLocalRateModel.activationStatus || '';     
      this.nightChargesStartTime=new Date();
      this.nightChargesEndTime=new Date();

   }
 }
  
}


export class VendorContractCityTiersDropDownModel { 
  vendorContractCityTiersID: number;
  vendorContractCityTier: string;

  constructor(vendorContractCityTiersDropDownModel) {
    {
      this.vendorContractCityTiersID = vendorContractCityTiersDropDownModel.vendorContractCityTiersID || -1;
      this.vendorContractCityTier = vendorContractCityTiersDropDownModel.vendorContractCityTier || '';
    }
  }
  
}



export class VendorLocalFixedDetailsModel {
  vendorLocalFixedDetailsID: number;
  vendorContractID:number;
  billFromTo: string;
  packageJumpCriteria:string;
  nextPackageSelectionCriteria:string;
  packageGraceMinutes:number;
  packageGraceKms:number;
  activationStatus: boolean;
  showAddtionKMAndHours:boolean;
  addtionalKms:number;
  addtionalMinutes:number
  userID:number;

  constructor(vendorLocalFixedDetailsModel) {
    {
       this.vendorLocalFixedDetailsID= vendorLocalFixedDetailsModel.vendorLocalFixedDetailsID || -1;
       this.vendorContractID = vendorLocalFixedDetailsModel.vendorContractID || '';
       this.billFromTo = vendorLocalFixedDetailsModel.billFromTo || '';
       this.packageJumpCriteria = vendorLocalFixedDetailsModel.packageJumpCriteria|| '';
       this.nextPackageSelectionCriteria = vendorLocalFixedDetailsModel.nextPackageSelectionCriteria || '';
       this.packageGraceMinutes = vendorLocalFixedDetailsModel.packageGraceMinutes || '';
       this.packageGraceKms = vendorLocalFixedDetailsModel.packageGraceKms|| '';
       this.activationStatus = vendorLocalFixedDetailsModel.activationStatus || '';
       this.showAddtionKMAndHours = vendorLocalFixedDetailsModel.showAddtionKMAndHours || '';
       this.addtionalKms = vendorLocalFixedDetailsModel.addtionalKms || '';
       this.addtionalMinutes = vendorLocalFixedDetailsModel.addtionalMinutes || '';
       
    }
  }
  
}
