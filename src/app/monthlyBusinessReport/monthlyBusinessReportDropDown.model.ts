// @ts-nocheck
import { formatDate } from '@angular/common';
export class MonthlyBusinessReportDropDown {
 
   monthID: number;
   monthName: string;
   year: string;
  constructor(monthlyBusinessReportDropDown) {
    {
       this.monthID = monthlyBusinessReportDropDown.monthID || -1;
       this.monthName = monthlyBusinessReportDropDown.monthName || '';
       this.year = monthlyBusinessReportDropDown.year || '';
    }
  }
  
}

