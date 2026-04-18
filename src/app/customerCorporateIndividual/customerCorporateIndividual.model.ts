// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCorporateIndividualModel {
  corporateCompanyID:number;
  corporateCompany:string;  
  customerPersonID: number;
  customerPersonName: string;
  salutationID:number
  salutation:string; 
  gender:string;
  importance:boolean;
  primaryMobile:string;
  primaryEmail:string;
  billingEmail:string;
  locationID:number;
  location:string;
  gstNumber:string;
  gstRate:string;
  billingName:string;
  billingAddress:string;
  billingCityID:number;
  billingCityName:string;
  billingStateID:number;
  billingStateName:string;
  billingPin:string;
  eInvoiceAddress:string;
  employeeID:number;
  employeeName:string;
  customerKAMCityID:number;
  customerKAMCity:string;
  roundOffInvoiceValue:boolean;
  salesManagerID:number;
  salesManagerName:string;
  activationStatus:boolean;
  customerDesignationID:number;
  customerDepartmentID:number;
  userID:number;
  countryForISDCodeID:number;
  maskMobileNumber:boolean;
  constructor(customerCorporateIndividualModel) {
    {
      this.corporateCompanyID = customerCorporateIndividualModel.corporateCompanyID || '';
      this.corporateCompany = customerCorporateIndividualModel.corporateCompany || '';
      this.customerPersonID = customerCorporateIndividualModel.customerPersonID || '';
      this.customerPersonName = customerCorporateIndividualModel.customerPersonName || '';
      this.salutationID = customerCorporateIndividualModel.salutationID || '';
      this.salutation = customerCorporateIndividualModel.salutation || '';
      this.gender = customerCorporateIndividualModel.gender || '';
      this.importance = customerCorporateIndividualModel.customerGroupID || '';
      this.primaryMobile = customerCorporateIndividualModel.mobile || '';
      this.primaryEmail = customerCorporateIndividualModel.primaryEmail || '';
      this.billingEmail = customerCorporateIndividualModel.billingEmail || '';
      this.locationID = customerCorporateIndividualModel.locationID || '';
      this.location = customerCorporateIndividualModel.location || '';
      this.gstNumber = customerCorporateIndividualModel.gstNumber || '';
      this.gstRate = customerCorporateIndividualModel.gstRate || ''; 
      this.billingName = customerCorporateIndividualModel.billingName || '';
      this.billingAddress = customerCorporateIndividualModel.billingAddress || '';
      this.billingCityID = customerCorporateIndividualModel.billingCityID || '';
      this.billingCityName = customerCorporateIndividualModel.billingCityName || '';
      this.billingStateID = customerCorporateIndividualModel.billingStateID || '';
      this.billingStateName = customerCorporateIndividualModel.billingStateName || '';
      this.billingPin  = customerCorporateIndividualModel.billingPin  || '';
      this.eInvoiceAddress = customerCorporateIndividualModel.eInvoiceAddress || '';
      this.employeeID = customerCorporateIndividualModel.employeeID || '';
      this.employeeName = customerCorporateIndividualModel.employeeName || '';
      this.customerKAMCityID = customerCorporateIndividualModel.customerKAMCityID || '';
      this.customerKAMCity = customerCorporateIndividualModel.customerKAMCity || '';
      this.roundOffInvoiceValue = customerCorporateIndividualModel.roundUpName || '';
      this.salesManagerID = customerCorporateIndividualModel.salesManagerID || '';
      this.salesManagerName = customerCorporateIndividualModel.salesManagerName || '';
      this.activationStatus = customerCorporateIndividualModel.activationStatus || '';
      this.userID = customerCorporateIndividualModel.userID || '';
      this.customerDesignationID = customerCorporateIndividualModel.customerDesignationID || '';
      this.customerDepartmentID = customerCorporateIndividualModel.customerDepartmentID || '';
      this.countryForISDCodeID = customerCorporateIndividualModel.countryForISDCodeID || '';
      this.maskMobileNumber = customerCorporateIndividualModel.maskMobileNumber || '';
    }
  }
}
export class CustomerPersonModels
{
  approvarCustomerPersonID: number;
  approverCustomerPersonName: string;
  approverID:number;
  approverName:string;
 // primaryMobile:string;
  constructor(customerPersonModel) {
  {
    this.approvarCustomerPersonID = customerPersonModel.approvarCustomerPersonID || -1;
    this.approverCustomerPersonName = customerPersonModel.approverCustomerPersonName || '';
    this.approverID = customerPersonModel.approverID || '';
    this.approverName = customerPersonModel.approverName || '';
    //this.primaryMobile = customerPersonModel.primaryMobile || '';
    }
  }
}



export class CustomerPersonModel
{
  customerPersonID: number;
  customerPersonName: string;
  primaryMobile:string;
  constructor(customerPersonModel) {
  {
    this.customerPersonID = customerPersonModel.customerPersonID || -1;
    this.customerPersonName = customerPersonModel.customerPersonName || '';
    this.primaryMobile = customerPersonModel.primaryMobile || '';
    }
  }
}


export class CorporateCompanyModel {
  corporateCompanyID: number;
  corporateCompany: string;

  constructor(corporateCompanyModel) {
    {
      this.corporateCompanyID = corporateCompanyModel.corporateCompanyID || -1;
      this.corporateCompany = corporateCompanyModel.corporateCompany || '';
    }
  }
  
}

