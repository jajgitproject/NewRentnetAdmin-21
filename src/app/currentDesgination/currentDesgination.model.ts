// @ts-nocheck
import { formatDate } from '@angular/common';
export class CurrentDesgination {
  currentDesginationID: number;
   employeeID: number;
   departmentID: number;
   designationID:number;
   organizationalEntityID:number;
   startDateString:string;
   endDateString:string;
   startDate:Date;
   endDate:Date;
   isHOD:Boolean;
   isResponsibleForChildEntities:Boolean;
   positionType:string;
   activationStatus: Boolean;
  

  constructor(currentDesgination) {
    {
       this.currentDesginationID = currentDesgination.currentDesginationID || -1;
       this.employeeID = currentDesgination.employeeID || '';
       this.departmentID = currentDesgination.departmentID || '';
       this.designationID = currentDesgination.designationID || '';
       this.organizationalEntityID = currentDesgination.organizationalEntityID || '';
       this.startDateString = currentDesgination.startDateString || '';
       this.endDateString = currentDesgination.endDateString || '';
       this.isHOD = currentDesgination.isHOD || '';
       this.isResponsibleForChildEntities = currentDesgination.isResponsibleForChildEntities || '';
       this.activationStatus = currentDesgination.activationStatus || '';
       this.positionType = currentDesgination.positionType || '';
       this.startDate=new Date();
       this.endDate=new Date();
      
    }
  }
  
}

