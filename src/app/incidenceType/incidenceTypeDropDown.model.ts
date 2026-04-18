// @ts-nocheck
import { formatDate } from '@angular/common';
export class IncidenceTypeDropDown {
  incidenceTypeID: number;
   incidenceType: string;

  constructor(incidenceTypeDropDown) {
    {
       this.incidenceTypeID = incidenceTypeDropDown.incidenceTypeID || -1;
       this.incidenceType = incidenceTypeDropDown.incidenceType || '';
    }
  }
  
}

