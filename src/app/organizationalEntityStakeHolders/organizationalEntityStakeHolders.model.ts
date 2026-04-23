// @ts-nocheck
import { formatDate } from '@angular/common';
export class OrganizationalEntityStakeHolders {
  organizationalEntityStakeHoldersID: number;
   employeeID: number;
   departmentID: number;
   designationID:number;
   designation:string;
   organizationalEntityID:number;
   startDateString:string;
   endDateString:string;
   startDate:Date;
   firstName:string;
   lastName:string;
   department:string;
   organizationalEntityName:string;
   endDate:Date;
   isHOD:Boolean;
   isResponsibleForChildEntities:Boolean;
   positionType:string;
   activationStatus: Boolean;
   employee:string;
   desgination:string;
   userID:number;
  
  constructor(organizationalEntityStakeHolders) {
    {
       this.organizationalEntityStakeHoldersID = organizationalEntityStakeHolders.organizationalEntityStakeHoldersID || -1;
       this.employeeID = organizationalEntityStakeHolders.employeeID || '';
       this.departmentID = organizationalEntityStakeHolders.departmentID || '';
       this.firstName = organizationalEntityStakeHolders.firstName || '';
       this.lastName = organizationalEntityStakeHolders.lastName || '';
       this.designationID = organizationalEntityStakeHolders.designationID || '';
       this.organizationalEntityID = organizationalEntityStakeHolders.organizationalEntityID || '';
       this.startDateString = organizationalEntityStakeHolders.startDateString || '';
       this.endDateString = organizationalEntityStakeHolders.endDateString || '';
       this.isHOD = organizationalEntityStakeHolders.isHOD || '';
       this.isResponsibleForChildEntities = organizationalEntityStakeHolders.isResponsibleForChildEntities || '';
       this.activationStatus = organizationalEntityStakeHolders.activationStatus || '';
       this.positionType = organizationalEntityStakeHolders.positionType || '';
       this.startDate=new Date();
       this.endDate=new Date();
      
    }
  }
  
}

