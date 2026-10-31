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
  triggerBillingFromApp:boolean;
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
       this.misRequired = customerConfigurationBilling.misRequired ?? false;
       this.documentRequired = customerConfigurationBilling.documentRequired ?? false;
       this.useOnlyAppDataForBilling = customerConfigurationBilling.useOnlyAppDataForBilling ?? false;
       this.mapMandatoryWithDutySlip = customerConfigurationBilling.mapMandatoryWithDutySlip ?? false;
       this.runningDetailsMandatoryWithDutySlip = customerConfigurationBilling.runningDetailsMandatoryWithDutySlip ?? false;
      //  this.fuelSurchargeFormula = customerConfigurationBilling.fuelSurchargeFormula || '';
      //  this.fuelSurchargeOnBasePackageRate = customerConfigurationBilling.fuelSurchargeOnBasePackageRate || '';
      //  this.fuelSurchargeOnExtraKM = customerConfigurationBilling.fuelSurchargeOnExtraKM || '';
      //  this.fuelSurchargeOnExtraHour = customerConfigurationBilling.fuelSurchargeOnExtraHour || '';
       this.isSEZCustomer = customerConfigurationBilling.isSEZCustomer || '';
       this.useDataFromAppToPrintOnDutySlip = customerConfigurationBilling.useDataFromAppToPrintOnDutySlip ?? false;
       this.runningDetailsSource = customerConfigurationBilling.runningDetailsSource || 'App';
       this.activationStatus = customerConfigurationBilling.activationStatus ?? true;
    }
  }
  
}

