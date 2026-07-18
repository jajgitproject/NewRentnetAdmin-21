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
      this.salutationID = individualCustomerModel.salutationID || '';
      this.salutation = individualCustomerModel.salutation || '';
      this.gender = individualCustomerModel.gender || '';
      this.importance = individualCustomerModel.importance || '';
      this.primaryMobile = individualCustomerModel.primaryMobile || '';
      this.primaryEmail = individualCustomerModel.primaryEmail || '';
      this.billingEmail = individualCustomerModel.billingEmail || '';
      this.locationID = individualCustomerModel.locationID || '';
      this.location = individualCustomerModel.location || '';
      this.gstNumber = individualCustomerModel.gstNumber || '';
      this.gstRate = individualCustomerModel.gstRate || '';
      this.billingName = individualCustomerModel.billingName || '';
      this.billingAddress = individualCustomerModel.billingAddress || '';
      this.billingCityID = individualCustomerModel.billingCityID || '';
      this.billingCityName = individualCustomerModel.billingCityName || '';
      this.billingStateID = individualCustomerModel.billingStateID || '';
      this.billingStateName = individualCustomerModel.billingStateName || '';
      this.billingPin = individualCustomerModel.billingPin || '';
      this.eInvoiceAddress = individualCustomerModel.eInvoiceAddress || '';
      this.employeeID = individualCustomerModel.employeeID || '';
      this.employeeName = individualCustomerModel.employeeName || '';
      this.customerKAMCityID = individualCustomerModel.customerKAMCityID || '';
      this.customerKAMCity = individualCustomerModel.customerKAMCity || '';
      this.roundOffInvoiceValue = individualCustomerModel.roundOffInvoiceValue ?? false;
      this.salesManagerID = individualCustomerModel.salesManagerID || '';
      this.salesManagerName = individualCustomerModel.salesManagerName || '';
      this.activationStatus = individualCustomerModel.activationStatus ?? true;
      this.userID = individualCustomerModel.userID || '';
      this.customerDesignationID = individualCustomerModel.customerDesignationID || '';
      this.customerDepartmentID = individualCustomerModel.customerDepartmentID || '';
      this.countryForISDCodeID = individualCustomerModel.countryForISDCodeID || '';
      this.maskMobileNumber = individualCustomerModel.maskMobileNumber || '';
      this.isPostPickUpCallAllowed = individualCustomerModel.isPostPickUpCallAllowed ?? false;
      this.customerContractID = individualCustomerModel.customerContractID || '';
      this.customerContractName = individualCustomerModel.customerContractName || '';
    }
  }
}
