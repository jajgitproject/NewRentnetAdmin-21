// @ts-nocheck
import { formatDate } from '@angular/common';
export class LocationDetails {
  organizationalEntityID: number;
  organizationalEntityParentID: number;
  employeeID: number;
  organizationalEntityCityID: number;
  designationID: number;
  departmentID: number;
  geoPointID: number;
  transferedLocationID:number;

  organizationalEntityName: string;
  organizationalEntityType: string;
  organizationalEntityBranchType: string;
  organizationalEntityAddress: string;
  organizationalEntityPincode: string;
  organizationalEntityPhone1: string;
  organizationalEntityPhone2: string;
  organizationalEntityFax: string;
  organizationalEntityEmail1: string;
  organizationalEntityEmail2: string;
  stakeHolder: string;
  gender: string;
  mobile: string;
  email: string;
  department: string;
  designation: string;
  positionType: string;
  isHOD: string;
  city: string;
  country: string;
  stateName: string;

  constructor(allotmentLocation) {
    //this.organizationalEntityID = allotmentLocation.organizationalEntityID || 0;
    this.organizationalEntityParentID = allotmentLocation?.organizationalEntityParentID || 0;
    this.employeeID = allotmentLocation?.employeeID || 0;
    this.organizationalEntityCityID = allotmentLocation?.organizationalEntityCityID || 0;
    this.designationID = allotmentLocation?.designationID || 0;
    this.departmentID = allotmentLocation?.departmentID || 0;
    this.geoPointID = allotmentLocation?.geoPointID || 0;
   this.transferedLocationID = allotmentLocation?.transferedLocationID || 0;
    this.organizationalEntityName = allotmentLocation?.organizationalEntityName || '';
    this.organizationalEntityType = allotmentLocation?.organizationalEntityType || '';
    this.organizationalEntityBranchType = allotmentLocation?.organizationalEntityBranchType || '';
    this.organizationalEntityAddress = allotmentLocation?.organizationalEntityAddress || '';
    this.organizationalEntityPincode = allotmentLocation?.organizationalEntityPincode || '';
    this.organizationalEntityPhone1 = allotmentLocation?.organizationalEntityPhone1 || '';
    this.organizationalEntityPhone2 = allotmentLocation?.organizationalEntityPhone2 || '';
    this.organizationalEntityFax = allotmentLocation?.organizationalEntityFax || '';
    this.organizationalEntityEmail1 = allotmentLocation?.organizationalEntityEmail1 || '';
    this.organizationalEntityEmail2 = allotmentLocation?.organizationalEntityEmail2 || '';
    this.stakeHolder = allotmentLocation?.stakeHolder || '';
    this.gender = allotmentLocation?.gender || '';
    this.mobile = allotmentLocation?.mobile || '';
    this.email = allotmentLocation?.email || '';
    this.department = allotmentLocation?.department || '';
    this.designation = allotmentLocation?.designation || '';
    this.positionType = allotmentLocation?.positionType || '';
    this.isHOD = allotmentLocation?.isHOD || '';
    this.city = allotmentLocation?.city || '';
    this.country = allotmentLocation?.country || '';
    this.stateName = allotmentLocation?.stateName || '';
  }
}


