// @ts-nocheck
import { formatDate } from '@angular/common';
export class IncidenceType {
   incidenceTypeID: number;
   incidenceType: string;
   userID:number;
   departmentID: number;
   department: string;
   activationStatus: boolean;

  constructor(incidenceType) {
    {
       this.incidenceTypeID = incidenceType.incidenceTypeID || -1;
       this.incidenceType = incidenceType.incidenceType || '';
       this.incidenceType = incidenceType.incidenceType || '';
       this.department = incidenceType.department || '';
       this.activationStatus = incidenceType.activationStatus || '';
    }
  }
  
}

