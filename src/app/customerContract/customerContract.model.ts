// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContract {
  customerContractID:number;
  customerContractName:string;
  currencyName:string;
  customerContractValidFrom:Date;
  customerContractValidFromString:string;
  customerContractValidTo:Date;
  customerContractValidToString:string;
  copiedFromID:number;
  copiedFrom:string;
  contractCreatedByID:number;
  contractApprovedByID:number;
  //currencyForBillingID:number;
  //currencyRateFixedorFloating:string;
  //fixedRateOfExchange:number;
  gstOnParking:boolean;
  modeOfPaymentID:number;
  billingCycle:string;
  createdBy:string;
  approvedBy:string;
  billingCurrency:string;
  petrolPriceOnContract:number;
  dieselPriceOnContract:number;
  surchargeFormula:string;
  percentageOfChangeForFuelSurcharge:number;
  surchargePercentageForAOrB:number;
  surchargeApplicableOnBaseRate:boolean;
  surchargeApplicableOnExtraKM:boolean;
  surchargeApplicableOnExtraHR:boolean;
  //tdsChargedOn:string;
  //tdsPercentage:number;
  branchID:number;
  contractCreatedByName:string;
  contractApprovedByName:string;
  modeOfPayment:string;
  branch:string;
  organizationalEntityName:string;
  userID:number;
  activationStatus:boolean;

  constructor(customerContract) {
    {
       this.customerContractID = customerContract.customerContractID || -1;
       this.customerContractName = customerContract.customerContractName || '';
       this.customerContractValidFromString = customerContract.customerContractValidFromString || '';
       this.customerContractValidToString = customerContract.customerContractValidToString || '';
       this.copiedFromID = customerContract.copiedFromID || '';
       this.copiedFrom = customerContract.copiedFrom || '';
       this.contractCreatedByID = customerContract.contractCreatedByID || '';
       this.contractApprovedByID = customerContract.contractApprovedByID || '';
       //this.currencyForBillingID = customerContract.currencyForBillingID || '';
       //this.currencyRateFixedorFloating = customerContract.currencyRateFixedorFloating || '';
       //this.fixedRateOfExchange = customerContract.fixedRateOfExchange || '';
       this.gstOnParking = customerContract.gstOnParking || '';
       this.modeOfPaymentID = customerContract.modeOfPaymentID || '';
       this.billingCycle = customerContract.billingCycle || '';
       this.petrolPriceOnContract = customerContract.petrolPriceOnContract || '';
       this.dieselPriceOnContract = customerContract.dieselPriceOnContract || '';
       //this.surchargeFormula = customerContract.surchargeFormula || '';
       this.percentageOfChangeForFuelSurcharge = customerContract.percentageOfChangeForFuelSurcharge || '';
       this.surchargeApplicableOnBaseRate = customerContract.surchargeApplicableOnBaseRate || '';
       this.surchargePercentageForAOrB = customerContract.surchargePercentageForAOrB || '';
       this.surchargeApplicableOnExtraKM = customerContract.surchargeApplicableOnExtraKM || '';
       this.surchargeApplicableOnExtraHR = customerContract.surchargeApplicableOnExtraHR || '';
       //this.tdsChargedOn = customerContract.tdsChargedOn || '';
       //this.tdsPercentage = customerContract.tdsPercentage || '';
       this.branchID = customerContract.branchID || '';
       this.activationStatus = customerContract.activationStatus || '';

       this.customerContractValidFrom = new Date();
       this.customerContractValidTo = new Date();
    }
  }
  
}

