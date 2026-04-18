// @ts-nocheck
import { formatDate } from '@angular/common';
export class OrganizationalEntity {
  organizationalEntityID: number;
  organizationalEntityName: string;
  organizationalEntityType:string;
  parent:string;
  supplierName:string;
  organizationalEntityParentID:number;
  organizationalEntityCityID:number;
  organizationalEntityAddress:string;
  organizationalEntityPincode:string;
  organizationalEntityPhone1:string;
  organizationalEntityPhone2:string;
  organizationalEntityFax:string;
  organizationalEntityEmail1:string;
  organizationalEntityEmail2:string;
  organizationalEntityWebsite:string;
  organizationalEntityPAN:string;
  organizationalEntityRegistrationNo:string;
  organizationalEntityLogo:string;
  organizationalEntityStartDate:Date;
  organizationalEntityStartDateString:string;
  organizationalEntityEndDate:Date;
  organizationalEntityEndDateString:string;
  organizationalEntityCINNo:string;
  organizationalEntityPrefix:string;
  organizationalEntityGSTN:string;
  organizationalEntityOwnership:string;
  organizationalEntitySupplierID:number;
  organizationalEntitySupplier:string;
  organizationalEntityAddressString:string;
  organizationalEntityGeoLocation:string;
  operationalStatus:boolean;
  activationStatus:boolean;
  latitude:string;
  longitude:string;
  stateID:number;
  countryID:number;
  state:string;
  country:string;
  city:string;
  supplierCreatedByEmployeeID:number;
  organizationalEntityBranchType:string;
  userID:number;
  oldRentNetService_Location:string;

  constructor(organizationalEntity) {
    {
       this.organizationalEntityID = organizationalEntity.organizationalEntityID || -1;
       this.organizationalEntityName = organizationalEntity.organizationalEntityName || '';
       this.organizationalEntityType = organizationalEntity.organizationalEntityType || '';
       this.organizationalEntityParentID = organizationalEntity.organizationalEntityParentID || '';
       this.organizationalEntityCityID = organizationalEntity.organizationalEntityCityID || '';
       this.organizationalEntityAddress = organizationalEntity.organizationalEntityAddress || '';
       this.organizationalEntityPincode = organizationalEntity.organizationalEntityPincode || '';
       this.organizationalEntityPhone1 = organizationalEntity.organizationalEntityPhone1 || '';
       this.organizationalEntityPhone2 = organizationalEntity.organizationalEntityPhone2 || '';
       this.organizationalEntityFax = organizationalEntity.organizationalEntityFax || '';
       this.organizationalEntityEmail1 = organizationalEntity.organizationalEntityEmail1 || '';
       this.organizationalEntityEmail2 = organizationalEntity.organizationalEntityEmail2 || '';
       this.organizationalEntityWebsite = organizationalEntity.organizationalEntityWebsite || '';
       this.organizationalEntityPAN = organizationalEntity.organizationalEntityPAN || '';
       this.organizationalEntityRegistrationNo = organizationalEntity.organizationalEntityRegistrationNo || '';
       this.organizationalEntityLogo = organizationalEntity.organizationalEntityLogo || '';
       this.organizationalEntityStartDateString = organizationalEntity.organizationalEntityStartDateString || '';
       this.organizationalEntityEndDateString = organizationalEntity.organizationalEntityEndDateString || '';
       this.organizationalEntityCINNo = organizationalEntity.organizationalEntityCINNo || '';
       this.organizationalEntityPrefix = organizationalEntity.organizationalEntityPrefix || '';
       this.organizationalEntityGSTN = organizationalEntity.organizationalEntityGSTN || '';
       this.organizationalEntityOwnership = organizationalEntity.organizationalEntityOwnership || '';
       this.organizationalEntityAddressString = organizationalEntity.organizationalEntityAddressString || '';
       this.organizationalEntityGeoLocation = organizationalEntity.organizationalEntityGeoLocation || '';
       this.operationalStatus = organizationalEntity.operationalStatus || '';
       this.supplierCreatedByEmployeeID = organizationalEntity.supplierCreatedByEmployeeID || '';
       this.activationStatus = organizationalEntity.activationStatus || '';
       this.organizationalEntityBranchType = organizationalEntity.organizationalEntityBranchType || '';
       this.organizationalEntityStartDate=new Date();
       //this.organizationalEntityEndDate=new Date();
       this.oldRentNetService_Location=organizationalEntity.oldRentNetService_Location || '';
    }
  }
  
}

