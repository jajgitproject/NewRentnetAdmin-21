// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationBilling {
  customerConfigurationBillingID:number;
  customerID:number;
  ecoCompanyID:number;
  fixBillingBranchID:number;
  misRequired:boolean;
  documentRequired:boolean;
  useOnlyAppDataForBilling:boolean;
  mapMandatoryWithDutySlip:boolean;
  runningDetailsMandatoryWithDutySlip:boolean;
  //fuelSurchargeFormula:string;
  //fuelSurchargeOnBasePackageRate:boolean;
  //fuelSurchargeOnExtraKM:boolean;
  //fuelSurchargeOnExtraHour:boolean;
  isSEZCustomer:boolean;
  useDataFromAppToPrintOnDutySlip:boolean;
  activationStatus:boolean;
  fixBillingBranch:string;
  ecoCompany:string;
  runningDetailsSource:string;
  userID:number;
  

  constructor(customerConfigurationBilling) {
    {
       this.customerConfigurationBillingID = customerConfigurationBilling.customerConfigurationBillingID || -1;
       this.customerID = customerConfigurationBilling.customerID || '';
       this.ecoCompanyID = customerConfigurationBilling.ecoCompanyID || '';
       this.fixBillingBranchID = customerConfigurationBilling.fixBillingBranchID || '';
       this.misRequired = customerConfigurationBilling.misRequired || '';
       this.documentRequired = customerConfigurationBilling.documentRequired || '';
       this.useOnlyAppDataForBilling = customerConfigurationBilling.useOnlyAppDataForBilling || '';
       this.mapMandatoryWithDutySlip = customerConfigurationBilling.mapMandatoryWithDutySlip || '';
       this.runningDetailsMandatoryWithDutySlip = customerConfigurationBilling.runningDetailsMandatoryWithDutySlip || '';
      //  this.fuelSurchargeFormula = customerConfigurationBilling.fuelSurchargeFormula || '';
      //  this.fuelSurchargeOnBasePackageRate = customerConfigurationBilling.fuelSurchargeOnBasePackageRate || '';
      //  this.fuelSurchargeOnExtraKM = customerConfigurationBilling.fuelSurchargeOnExtraKM || '';
      //  this.fuelSurchargeOnExtraHour = customerConfigurationBilling.fuelSurchargeOnExtraHour || '';
       this.isSEZCustomer = customerConfigurationBilling.isSEZCustomer || '';
       this.useDataFromAppToPrintOnDutySlip = customerConfigurationBilling.useDataFromAppToPrintOnDutySlip || '';
       this.runningDetailsSource = customerConfigurationBilling.runningDetailsSource || '';
       this.activationStatus = customerConfigurationBilling.activationStatus || '';
    }
  }
  
}

