// @ts-nocheck
export class IndividualCustomerModel {
  customerPersonName: string;
  salutationID: number;
  salutation: string;
  gender: string;
  importance: string;
  primaryMobile: string;
  primaryEmail: string;
  billingEmail: string;
  locationID: number;
  location: string;
  gstNumber: string;
  gstRate: string;
  billingName: string;
  billingAddress: string;
  billingCityID: number;
  billingCityName: string;
  billingStateID: number;
  billingStateName: string;
  billingPin: string;
  eInvoiceAddress: string;
  employeeID: number;
  employeeName: string;
  customerKAMCityID: number;
  customerKAMCity: string;
  roundOffInvoiceValue: boolean;
  salesManagerID: number;
  salesManagerName: string;
  activationStatus: boolean;
  customerDesignationID: number;
  customerDepartmentID: number;
  userID: number;
  countryForISDCodeID: number;
  maskMobileNumber: boolean;
  isPostPickUpCallAllowed: boolean;
  customerContractID: number;
  customerContractName: string;

  constructor(individualCustomerModel) {
    {
      this.customerPersonName = individualCustomerModel.customerPersonName || '';
      this.salutationID = individualCustomerModel.salutationID || 0;
      this.salutation = individualCustomerModel.salutation || '';
      this.gender = individualCustomerModel.gender || '';
      this.importance = individualCustomerModel.importance || '';
      this.primaryMobile = individualCustomerModel.primaryMobile || '';
      this.primaryEmail = individualCustomerModel.primaryEmail || '';
      this.billingEmail = individualCustomerModel.billingEmail || '';
      this.locationID = individualCustomerModel.locationID || 0;
      this.location = individualCustomerModel.location || '';
      this.gstNumber = individualCustomerModel.gstNumber || '';
      this.gstRate = individualCustomerModel.gstRate || '';
      this.billingName = individualCustomerModel.billingName || '';
      this.billingAddress = individualCustomerModel.billingAddress || '';
      this.billingCityID = individualCustomerModel.billingCityID || 0;
      this.billingCityName = individualCustomerModel.billingCityName || '';
      this.billingStateID = individualCustomerModel.billingStateID || 0;
      this.billingStateName = individualCustomerModel.billingStateName || '';
      this.billingPin = individualCustomerModel.billingPin || '';
      this.eInvoiceAddress = individualCustomerModel.eInvoiceAddress || '';
      this.employeeID = individualCustomerModel.employeeID || 0;
      this.employeeName = individualCustomerModel.employeeName || '';
      this.customerKAMCityID = individualCustomerModel.customerKAMCityID || 0;
      this.customerKAMCity = individualCustomerModel.customerKAMCity || '';
      this.roundOffInvoiceValue = individualCustomerModel.roundOffInvoiceValue ?? false;
      this.salesManagerID = individualCustomerModel.salesManagerID || 0;
      this.salesManagerName = individualCustomerModel.salesManagerName || '';
      this.activationStatus = individualCustomerModel.activationStatus ?? true;
      this.userID = individualCustomerModel.userID || 0;
      this.customerDesignationID = individualCustomerModel.customerDesignationID || 0;
      this.customerDepartmentID = individualCustomerModel.customerDepartmentID || 0;
      this.countryForISDCodeID = individualCustomerModel.countryForISDCodeID || 0;
      this.maskMobileNumber = individualCustomerModel.maskMobileNumber ?? false;
      this.isPostPickUpCallAllowed = individualCustomerModel.isPostPickUpCallAllowed ?? false;
      this.customerContractID = individualCustomerModel.customerContractID || 0;
      this.customerContractName = individualCustomerModel.customerContractName || '';
    }
  }
}
