// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorContractModel {
  vendorContractID:number;
  vendorContractName:string;
  vendorContractValidFrom:Date;
  vendorContractValidFromString:string;
  vendorContractValidTo:Date;
  vendorContractValidToString:string;
  copiedFromID:number;
  copiedFrom:string;
  modeOfPaymentID:number;
  modeOfPayment:string;
  contractCreatedByID:number;
  contractCreatedByName:string;
  contractApprovedByID:number;
  contractApprovedByName:string;
  currencyForBillingID:number;
  currencyName:string;
  currencyRateFixedorFloating:string;
  fixedRateOfExchange:number;
  billingCycle:string;
  tdsChargedOn:string;
  tdsPercentage:number;
  branchID:number;
  branch:string;
  userID:number;
  activationStatus:boolean;

  constructor(vendorContractModel) {
    {
      this.vendorContractID = vendorContractModel.vendorContractID || -1;
      this.vendorContractName = vendorContractModel.vendorContractName || '';
      this.vendorContractValidFromString = vendorContractModel.vendorContractValidFromString || '';
      this.vendorContractValidToString = vendorContractModel.vendorContractValidToString || '';
      this.copiedFromID = vendorContractModel.copiedFromID || '';
      this.copiedFrom = vendorContractModel.copiedFrom || '';
      this.modeOfPaymentID = vendorContractModel.modeOfPaymentID || '';
      this.modeOfPayment = vendorContractModel.modeOfPayment || '';
      this.contractCreatedByID = vendorContractModel.contractCreatedByID || '';
      this.contractCreatedByName = vendorContractModel.contractCreatedByName || '';
      this.contractApprovedByID = vendorContractModel.contractApprovedByID || '';
      this.contractApprovedByName = vendorContractModel.contractApprovedByName || '';
      this.currencyForBillingID = vendorContractModel.currencyForBillingID || '';
      this.currencyName = vendorContractModel.currencyName || '';
      this.currencyRateFixedorFloating = vendorContractModel.currencyRateFixedorFloating || '';
      this.fixedRateOfExchange = vendorContractModel.fixedRateOfExchange || '';
      this.billingCycle = vendorContractModel.billingCycle || '';
      this.tdsChargedOn = vendorContractModel.tdsChargedOn || '';
      this.tdsPercentage = vendorContractModel.tdsPercentage || '';
      this.branchID = vendorContractModel.branchID || '';
      this.branch = vendorContractModel.branch || '';       
      this.activationStatus = vendorContractModel.activationStatus || '';
      this.vendorContractValidFrom = new Date();
      this.vendorContractValidTo = new Date();
    }
  }
  
}


export class VendorContractDropDown {
 
   vendorContractID: number;
   vendorContractName: string;

  constructor(vendorContractDropDown) {
    {
       this.vendorContractID = vendorContractDropDown.vendorContractID || -1;
       this.vendorContractName = vendorContractDropDown.vendorContractName || '';
    }
  }
  
}
