// @ts-nocheck
import { formatDate } from '@angular/common';
export class BankChargeConfig {
   bankChargeConfigID: number;
   cardID: number;
   bankBranchID:number;
   cardProcessingChargeID:number;
   bankChargePercentage:number;
   bankChargeConfigStartDate:Date;
   bankChargeConfigStartDateString:string;
   bankChargeConfigEndDate:Date;
   bankChargeConfigEndDateString:string;
   bankChargeConfigCGSTRate:number;
   bankChargeConfigSGSTRate:number;
   bankChargeConfigIGSTRate:number;
   bankID:number;
   bank:string;
   card:string;
   bankBranch:string;
   cardProcessingCharge:string;
   activationStatus:boolean;
   userID:number;
  constructor(bankChargeConfig) {
    {
       this.bankChargeConfigID = bankChargeConfig.bankChargeConfigID || -1;
       this.cardID = bankChargeConfig.cardID || '';
       this.bankBranchID = bankChargeConfig.bankBranchID || '';
       this.cardProcessingChargeID = bankChargeConfig.cardProcessingChargeID || '';
       this.bankChargePercentage = bankChargeConfig.bankChargePercentage || '';
       this.bankChargeConfigStartDateString = bankChargeConfig.bankChargeConfigStartDateString || '';
       this.bankChargeConfigEndDateString = bankChargeConfig.bankChargeConfigEndDateString || '';
       this.bankChargeConfigCGSTRate = bankChargeConfig.bankChargeConfigCGSTRate || '';
       this.bankChargeConfigSGSTRate = bankChargeConfig.bankChargeConfigSGSTRate || '';
       this.bankChargeConfigIGSTRate = bankChargeConfig.bankChargeConfigIGSTRate || '';
       this.activationStatus = bankChargeConfig.activationStatus || '';
       this.bank = bankChargeConfig.bank || '';
       this.card = bankChargeConfig.card || '';
       this.bankBranch = bankChargeConfig.bankBranch || '';
       this.cardProcessingCharge = bankChargeConfig.cardProcessingCharge || '';
       this.bankChargeConfigStartDate=new Date();
       this.bankChargeConfigEndDate=new Date();
    }
  }
  
}

