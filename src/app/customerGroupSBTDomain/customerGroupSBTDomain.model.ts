// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerGroupSBTDomain {

  customerGroupSBTDomainID: number;
  customerGroupID: number;
  allowCDPLogin: boolean;
  sbtDomain: string;
  allowPassengerToMakeReservation: string;
  requireApprovalOnReservation: boolean;
  singleApproverOrPersonSpecificApprover: string;
  status: boolean;
  allowAllCars: boolean;
  allowAllDutyTypes: boolean;
  designationSpecificCars: boolean;
  designationSpecificDutyTypes: boolean;
  userID: number;
  approvarCustomerPersonID: number;
  approverCustomerPersonName: string;
  allowPassengerToLoginCDP: boolean;

  constructor(data?: any) {
    this.customerGroupSBTDomainID = data?.customerGroupSBTDomainID ?? -1;
    this.customerGroupID = data?.customerGroupID ?? 0;
    this.approverCustomerPersonName = data?.approverCustomerPersonName ?? '';
    this.allowCDPLogin = data?.allowCDPLogin ?? '';
    this.sbtDomain = data?.sbtDomain ?? '';
    this.allowPassengerToMakeReservation =
      data?.allowPassengerToMakeReservation ?? '';
    this.requireApprovalOnReservation =
      data?.requireApprovalOnReservation ?? '';
    this.singleApproverOrPersonSpecificApprover =
      data?.singleApproverOrPersonSpecificApprover ?? '';
    this.status = data?.status ?? '';
    this.approvarCustomerPersonID = data?.approvarCustomerPersonID ?? '';
    this.allowAllCars = data?.allowAllCars ?? '';
    this.allowAllDutyTypes = data?.allowAllDutyTypes ?? '';
    this.designationSpecificCars =
      data?.designationSpecificCars ?? '';
    this.designationSpecificDutyTypes = data?.designationSpecificDutyTypes ?? '';
    this.allowPassengerToLoginCDP = data?.allowPassengerToLoginCDP || '';
     
  }
}


